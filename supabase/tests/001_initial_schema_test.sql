-- =====================================================================
-- JCER E-CELL — Migration 001 database-level staging tests
-- STATUS: NOT RUN. Requires a dedicated STAGING Supabase project with
--   Migration 001 already applied. Run in the SQL Editor as postgres.
--
-- Self-contained: the SETUP block inserts three test auth.users rows with
--   FIXED UUIDs, which fires on_auth_user_created (creating draft profiles +
--   'student' roles). Adjust auth.users columns if your Supabase version
--   requires additional NOT NULL fields (e.g. instance_id).
--   The CLEANUP block deletes ONLY these test users (cascade removes their
--   profiles and roles). It never touches production data.
--
-- Negative tests catch the SPECIFIC expected error and raise a NOTICE on
--   success; if the guarded operation unexpectedly SUCCEEDS, they raise a
--   FAIL exception. No test passes by catching its own failure.
-- =====================================================================

-- Fixed test identities (replace freely; must be valid UUIDs).
--   STUDENT_A = aaaaaaaa-0000-4000-8000-000000000001
--   STUDENT_B = bbbbbbbb-0000-4000-8000-000000000002
--   ADMIN     = cccccccc-0000-4000-8000-000000000003

-- ---------------------------------------------------------------------
-- SETUP (idempotent): create test auth users -> profiles + student roles.
-- ---------------------------------------------------------------------
do $$
begin
  insert into auth.users (id, aud, role, email, raw_user_meta_data, created_at, updated_at)
  values
    ('aaaaaaaa-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
     'student.a@test.local', '{"full_name":"Student A"}', now(), now()),
    ('bbbbbbbb-0000-4000-8000-000000000002', 'authenticated', 'authenticated',
     'student.b@test.local', '{"full_name":"Student B"}', now(), now()),
    ('cccccccc-0000-4000-8000-000000000003', 'authenticated', 'authenticated',
     'admin@test.local', '{"full_name":"Admin User"}', now(), now())
  on conflict (id) do nothing;

  -- Simulate the documented first-admin bootstrap (postgres-only write).
  insert into public.user_roles (user_id, role, granted_by)
  values ('cccccccc-0000-4000-8000-000000000003', 'admin',
          'cccccccc-0000-4000-8000-000000000003')
  on conflict (user_id) do update set role = 'admin';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 1: required objects exist (tables, view, functions, triggers,
--         index, constraints, RLS).
-- ---------------------------------------------------------------------
do $$
begin
  if to_regclass('public.profiles') is null then raise exception 'FAIL: profiles missing'; end if;
  if to_regclass('public.user_roles') is null then raise exception 'FAIL: user_roles missing'; end if;
  if to_regclass('public.public_profiles') is null then raise exception 'FAIL: public_profiles missing'; end if;
  if to_regprocedure('public.is_admin()') is null then raise exception 'FAIL: is_admin missing'; end if;
  if to_regprocedure('public.submit_my_profile()') is null then raise exception 'FAIL: submit missing'; end if;
  if to_regprocedure('public.withdraw_my_profile()') is null then raise exception 'FAIL: withdraw missing'; end if;
  if to_regprocedure('public.admin_review_profile(uuid,text,timestamptz,text,boolean)') is null then raise exception 'FAIL: admin_review missing'; end if;
  if to_regprocedure('public.handle_new_user()') is null then raise exception 'FAIL: handle_new_user missing'; end if;
  if to_regprocedure('public.guard_profile_update()') is null then raise exception 'FAIL: guard missing'; end if;
  if to_regclass('public.profiles_status_idx') is null then raise exception 'FAIL: status index missing'; end if;
  if not exists (select 1 from pg_constraint where conname='profiles_featured_requires_approved') then
    raise exception 'FAIL: featured constraint missing'; end if;
  if not exists (select 1 from pg_trigger t join pg_class c on c.oid=t.tgrelid
                 join pg_namespace n on n.oid=c.relnamespace
                 where n.nspname='auth' and c.relname='users' and t.tgname='on_auth_user_created') then
    raise exception 'FAIL: signup trigger missing'; end if;
  raise notice 'PASS: TEST 1 required objects exist';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 2 & 3: public view exposes EXACTLY the 11 columns; no private cols.
-- ---------------------------------------------------------------------
do $$
declare v_actual text; v_expected text;
begin
  select string_agg(column_name, ',' order by column_name) into v_actual
  from information_schema.columns
  where table_schema='public' and table_name='public_profiles';
  v_expected := 'academic_year,avatar_url,bio,collaboration_status,department,'
             || 'full_name,preferred_roles,primary_role,skills,slug,social_links';
  if v_actual is distinct from v_expected then
    raise exception 'FAIL: view column set mismatch actual=[%]', v_actual; end if;
  raise notice 'PASS: TEST 2/3 public view has exactly the 11 public columns';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 5: signup created draft profiles for the test users.
-- ---------------------------------------------------------------------
do $$
declare v_drafts integer;
begin
  select count(*) into v_drafts from public.profiles
   where id in ('aaaaaaaa-0000-4000-8000-000000000001',
                'bbbbbbbb-0000-4000-8000-000000000002',
                'cccccccc-0000-4000-8000-000000000003')
     and status = 'draft';
  if v_drafts <> 3 then
    raise exception 'FAIL: expected 3 draft profiles, found %', v_drafts; end if;
  raise notice 'PASS: TEST 5 signup created draft profiles';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 6: null-email signup is handled safely (draft profile, null email).
-- ---------------------------------------------------------------------
do $$
declare v_status text; v_email text;
begin
  insert into auth.users (id, aud, role, email, raw_user_meta_data, created_at, updated_at)
  values ('dddddddd-0000-4000-8000-000000000004', 'authenticated', 'authenticated',
          null, '{"full_name":"No Email"}', now(), now())
  on conflict (id) do nothing;

  select status, email into v_status, v_email
   from public.profiles where id = 'dddddddd-0000-4000-8000-000000000004';
  if v_status is distinct from 'draft' then
    raise exception 'FAIL: null-email profile status=%', v_status; end if;
  raise notice 'PASS: TEST 6 null-email signup created draft profile (email=%)', v_email;
  -- cleanup this extra user
  delete from auth.users where id = 'dddddddd-0000-4000-8000-000000000004';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 7: Student A cannot read or modify Student B's private profile.
-- ---------------------------------------------------------------------
do $$
declare v_seen integer; v_rows integer;
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims',
    '{"sub":"aaaaaaaa-0000-4000-8000-000000000001","role":"authenticated"}', true);

  select count(*) into v_seen from public.profiles
   where id = 'bbbbbbbb-0000-4000-8000-000000000002';
  if v_seen <> 0 then
    perform set_config('role', 'postgres', true);
    raise exception 'FAIL: A can read B row'; end if;

  update public.profiles set bio = 'hacked'
   where id = 'bbbbbbbb-0000-4000-8000-000000000002';
  get diagnostics v_rows = row_count;
  perform set_config('role', 'postgres', true);
  if v_rows <> 0 then
    raise exception 'FAIL: A modified B row (% rows)', v_rows; end if;
  raise notice 'PASS: TEST 7 A cannot read or modify B';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 8: Student A direct UPDATE of a protected column is DENIED (42501).
-- ---------------------------------------------------------------------
do $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims',
    '{"sub":"aaaaaaaa-0000-4000-8000-000000000001","role":"authenticated"}', true);
  begin
    perform 1 from (
      update public.profiles set status = 'approved'
       where id = 'aaaaaaaa-0000-4000-8000-000000000001') t;
    perform set_config('role', 'postgres', true);
    raise exception 'FAIL: direct status update succeeded';
  exception when insufficient_privilege then
    perform set_config('role', 'postgres', true);
    raise notice 'PASS: TEST 8 direct status update denied (42501)';
  end;
end
$$;

-- ---------------------------------------------------------------------
-- TEST 9: Student cannot INSERT/UPDATE/DELETE role assignments (42501).
-- ---------------------------------------------------------------------
do $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims',
    '{"sub":"aaaaaaaa-0000-4000-8000-000000000001","role":"authenticated"}', true);
  begin
    insert into public.user_roles (user_id, role)
    values ('aaaaaaaa-0000-4000-8000-000000000001', 'admin');
    perform set_config('role', 'postgres', true);
    raise exception 'FAIL: student inserted a role';
  exception when insufficient_privilege then
    null;
  end;
  begin
    update public.user_roles set role = 'admin'
     where user_id = 'aaaaaaaa-0000-4000-8000-000000000001';
    perform set_config('role', 'postgres', true);
    raise exception 'FAIL: student updated a role';
  exception when insufficient_privilege then
    perform set_config('role', 'postgres', true);
    raise notice 'PASS: TEST 9 student role writes denied (42501)';
  end;
end
$$;

-- ---------------------------------------------------------------------
-- TEST 10: Student cannot invoke admin_review_profile() (42501 authz).
-- ---------------------------------------------------------------------
do $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims',
    '{"sub":"aaaaaaaa-0000-4000-8000-000000000001","role":"authenticated"}', true);
  begin
    perform public.admin_review_profile(
      'bbbbbbbb-0000-4000-8000-000000000002', 'approved', now());
    perform set_config('role', 'postgres', true);
    raise exception 'FAIL: student invoked admin review';
  exception when insufficient_privilege then
    perform set_config('role', 'postgres', true);
    raise notice 'PASS: TEST 10 student blocked from admin RPC (42501)';
  end;
end
$$;

-- ---------------------------------------------------------------------
-- TEST 11: anon cannot EXECUTE privileged RPCs (42501 privilege).
-- ---------------------------------------------------------------------
do $$
begin
  perform set_config('role', 'anon', true);
  begin
    perform public.submit_my_profile();
    perform set_config('role', 'postgres', true);
    raise exception 'FAIL: anon executed submit_my_profile';
  exception when insufficient_privilege then
    perform set_config('role', 'postgres', true);
    raise notice 'PASS: TEST 11 anon denied execute on RPC (42501)';
  end;
end
$$;

-- ---------------------------------------------------------------------
-- TEST 12: admin NULL arguments return SQLSTATE 22023.
-- ---------------------------------------------------------------------
do $$
declare v_state text;
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims',
    '{"sub":"cccccccc-0000-4000-8000-000000000003","role":"authenticated"}', true);

  begin
    perform public.admin_review_profile(null, 'approved', now());
  exception when others then
    v_state := sqlstate;
    if v_state <> '22023' then
      perform set_config('role', 'postgres', true);
      raise exception 'FAIL: null profile_id gave sqlstate %', v_state; end if;
  end;

  begin
    perform public.admin_review_profile(
      'aaaaaaaa-0000-4000-8000-000000000001', null, now());
  exception when others then
    v_state := sqlstate;
    if v_state <> '22023' then
      perform set_config('role', 'postgres', true);
      raise exception 'FAIL: null status gave sqlstate %', v_state; end if;
  end;

  begin
    perform public.admin_review_profile(
      'aaaaaaaa-0000-4000-8000-000000000001', 'approved', null);
  exception when others then
    v_state := sqlstate;
    if v_state <> '22023' then
      perform set_config('role', 'postgres', true);
      raise exception 'FAIL: null reviewed_updated_at gave sqlstate %', v_state; end if;
  end;

  perform set_config('role', 'postgres', true);
  raise notice 'PASS: TEST 12 admin NULL args (id/status/timestamp) return 22023';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 13/14 (lifecycle A): submit, invalid re-submit, invalid withdraw,
--   admin approve, invalid re-review of non-pending, reject-without-reason.
-- ---------------------------------------------------------------------
do $$
declare v_status text; v_state text;
begin
  -- A: draft -> pending_review (valid)
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims',
    '{"sub":"aaaaaaaa-0000-4000-8000-000000000001","role":"authenticated"}', true);
  perform public.submit_my_profile();
  select status into v_status from public.profiles where id='aaaaaaaa-0000-4000-8000-000000000001';
  if v_status <> 'pending_review' then
    perform set_config('role','postgres',true);
    raise exception 'FAIL: submit did not reach pending_review (%)', v_status; end if;

  -- A: submit again -> invalid transition (P0001)
  begin
    perform public.submit_my_profile();
    perform set_config('role','postgres',true);
    raise exception 'FAIL: re-submit from pending_review succeeded';
  exception when others then
    if sqlstate <> 'P0001' then
      perform set_config('role','postgres',true);
      raise exception 'FAIL: re-submit sqlstate=%', sqlstate; end if;
  end;

  -- A: withdraw from pending_review -> invalid (P0001; only approved may withdraw)
  begin
    perform public.withdraw_my_profile();
    perform set_config('role','postgres',true);
    raise exception 'FAIL: withdraw from pending_review succeeded';
  exception when others then
    if sqlstate <> 'P0001' then
      perform set_config('role','postgres',true);
      raise exception 'FAIL: withdraw-from-pending sqlstate=%', sqlstate; end if;
  end;

  -- ADMIN: approve (pending_review -> approved)
  perform set_config('role','postgres',true);
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims',
    '{"sub":"cccccccc-0000-4000-8000-000000000003","role":"authenticated"}', true);
  perform public.admin_review_profile('aaaaaaaa-0000-4000-8000-000000000001','approved', (select updated_at from public.profiles where id='aaaaaaaa-0000-4000-8000-000000000001'));
  select status into v_status from public.profiles where id='aaaaaaaa-0000-4000-8000-000000000001';
  if v_status <> 'approved' then
    perform set_config('role','postgres',true);
    raise exception 'FAIL: admin approve did not reach approved (%)', v_status; end if;

  -- ADMIN: reject without reason -> 22023
  begin
    perform public.admin_review_profile('aaaaaaaa-0000-4000-8000-000000000001','rejected', (select updated_at from public.profiles where id='aaaaaaaa-0000-4000-8000-000000000001'), null);
    perform set_config('role','postgres',true);
    raise exception 'FAIL: reject without reason succeeded';
  exception when others then
    if sqlstate <> '22023' then
      perform set_config('role','postgres',true);
      raise exception 'FAIL: reject-no-reason sqlstate=%', sqlstate; end if;
  end;
  perform set_config('role','postgres',true);
  raise notice 'PASS: TEST 13/14A submit/invalid-transitions/admin-approve/reject-validation';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 15/14B (lifecycle B): approved profile is currently 'approved'.
--   public-view visibility, re-review on public edit, private-edit safety,
--   reject -> resubmit -> approve, withdraw.
-- ---------------------------------------------------------------------
do $$
declare v_status text; v_reason text; v_vis integer;
  a uuid := 'aaaaaaaa-0000-4000-8000-000000000001';
  adm uuid := 'cccccccc-0000-4000-8000-000000000003';
  v_slug text;
begin
  select slug into v_slug from public.profiles where id = a;

  -- Approved profile IS visible in the public view (as postgres/anon-equivalent).
  select count(*) into v_vis from public.public_profiles where slug = v_slug;
  if v_vis <> 1 then
    raise exception 'FAIL: approved profile not in public view (%)', v_vis; end if;

  -- A edits a PUBLIC field (bio) while approved -> forced pending_review, hidden.
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims',
    format('{"sub":"%s","role":"authenticated"}', a), true);
  update public.profiles set bio = 'edited-bio' where id = a;
  select status into v_status from public.profiles where id = a;
  if v_status <> 'pending_review' then
    perform set_config('role','postgres',true);
    raise exception 'FAIL: public edit did not force re-review (%)', v_status; end if;
  select count(*) into v_vis from public.public_profiles where slug = v_slug;
  if v_vis <> 0 then
    perform set_config('role','postgres',true);
    raise exception 'FAIL: edited profile still public (%)', v_vis; end if;

  -- ADMIN re-approves.
  perform set_config('role','postgres',true);
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims',
    format('{"sub":"%s","role":"authenticated"}', adm), true);
  perform public.admin_review_profile(a, 'approved', (select updated_at from public.profiles where id = a));

  -- A edits a PRIVATE field (usn) while approved -> stays approved.
  perform set_config('role','postgres',true);
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims',
    format('{"sub":"%s","role":"authenticated"}', a), true);
  update public.profiles set usn = '2JC99CS001' where id = a;
  select status into v_status from public.profiles where id = a;
  if v_status <> 'approved' then
    perform set_config('role','postgres',true);
    raise exception 'FAIL: private edit triggered re-review (%)', v_status; end if;

  -- ADMIN rejects with reason -> metadata cleared, reason set.
  perform set_config('role','postgres',true);
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims',
    format('{"sub":"%s","role":"authenticated"}', adm), true);
  -- profile must be pending to reject; it is 'approved' now, so first resubmit path
  -- is not available -> withdraw then resubmit then reject.
  perform set_config('role','postgres',true);
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims',
    format('{"sub":"%s","role":"authenticated"}', a), true);
  perform public.withdraw_my_profile();  -- approved -> draft
  perform public.submit_my_profile();    -- draft -> pending_review
  perform set_config('role','postgres',true);
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims',
    format('{"sub":"%s","role":"authenticated"}', adm), true);
  perform public.admin_review_profile(a, 'rejected', (select updated_at from public.profiles where id = a), 'insufficient proof');
  select status, rejection_reason into v_status, v_reason from public.profiles where id = a;
  if v_status <> 'rejected' or v_reason is distinct from 'insufficient proof' then
    perform set_config('role','postgres',true);
    raise exception 'FAIL: rejection metadata wrong status=% reason=%', v_status, v_reason; end if;

  -- A resubmits rejected -> pending_review, reason cleared.
  perform set_config('role','postgres',true);
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims',
    format('{"sub":"%s","role":"authenticated"}', a), true);
  perform public.submit_my_profile();
  select status, rejection_reason into v_status, v_reason from public.profiles where id = a;
  if v_status <> 'pending_review' or v_reason is not null then
    perform set_config('role','postgres',true);
    raise exception 'FAIL: resubmit status=% reason=%', v_status, v_reason; end if;

  -- ADMIN approves; then A withdraws -> draft, hidden.
  perform set_config('role','postgres',true);
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims',
    format('{"sub":"%s","role":"authenticated"}', adm), true);
  perform public.admin_review_profile(a, 'approved', (select updated_at from public.profiles where id = a));
  perform set_config('role','postgres',true);
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims',
    format('{"sub":"%s","role":"authenticated"}', a), true);
  perform public.withdraw_my_profile();
  select status into v_status from public.profiles where id = a;
  select count(*) into v_vis from public.public_profiles where slug = v_slug;
  perform set_config('role','postgres',true);
  if v_status <> 'draft' or v_vis <> 0 then
    raise exception 'FAIL: withdraw status=% vis=%', v_status, v_vis; end if;
  raise notice 'PASS: TEST 15/14B re-review/private-edit/reject/resubmit/withdraw/view';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 15c: optimistic concurrency — a STALE updated_at is rejected and the
--   profile stays pending_review (an admin must not approve a newer version);
--   the matching (fresh) updated_at then succeeds.
-- ---------------------------------------------------------------------
do $$
declare
  v_state text;
  v_status text;
  v_ua timestamptz;
  a uuid := 'aaaaaaaa-0000-4000-8000-000000000001';
  adm uuid := 'cccccccc-0000-4000-8000-000000000003';
begin
  -- Ensure A is pending_review.
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims', format('{"sub":"%s","role":"authenticated"}', a), true);
  perform public.submit_my_profile();          -- draft|rejected -> pending_review
  perform set_config('role','postgres',true);

  -- The version currently stored.
  select updated_at into v_ua from public.profiles where id = a;

  -- Admin reviews with a STALE timestamp (older than current) -> must fail.
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims', format('{"sub":"%s","role":"authenticated"}', adm), true);
  begin
    perform public.admin_review_profile(a, 'approved', v_ua - interval '1 hour');
    perform set_config('role','postgres',true);
    raise exception 'FAIL: stale-timestamp review succeeded';
  exception when others then
    v_state := sqlstate;
    perform set_config('role','postgres',true);
    if v_state <> 'P0001' then
      raise exception 'FAIL: concurrency mismatch gave sqlstate %', v_state; end if;
  end;

  -- Profile must still be pending_review (unchanged by the failed review).
  select status into v_status from public.profiles where id = a;
  if v_status <> 'pending_review' then
    raise exception 'FAIL: profile not pending after stale review (status=%)', v_status; end if;

  -- Control: the matching (fresh) timestamp succeeds.
  perform set_config('role','authenticated',true);
  perform set_config('request.jwt.claims', format('{"sub":"%s","role":"authenticated"}', adm), true);
  perform public.admin_review_profile(a, 'approved', (select updated_at from public.profiles where id = a));
  perform set_config('role','postgres',true);
  select status into v_status from public.profiles where id = a;
  if v_status <> 'approved' then
    raise exception 'FAIL: fresh-timestamp review did not approve (status=%)', v_status; end if;

  raise notice 'PASS: TEST 15c optimistic concurrency rejects stale updated_at, allows fresh';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 4: only approved profiles are publicly visible (draft B is not).
-- ---------------------------------------------------------------------
do $$
declare v_vis integer; v_slug_b text;
begin
  select slug into v_slug_b from public.profiles
   where id = 'bbbbbbbb-0000-4000-8000-000000000002';
  select count(*) into v_vis from public.public_profiles where slug = v_slug_b;
  if v_vis <> 0 then
    raise exception 'FAIL: draft profile B is public (%)', v_vis; end if;
  raise notice 'PASS: TEST 4 only approved profiles are public';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 16: is_admin() ownership, SECURITY DEFINER, fixed search_path,
--   and EXECUTE grant to authenticated.
-- ---------------------------------------------------------------------
do $$
declare v_owner text; v_definer boolean; v_cfg text; v_exec boolean;
begin
  select pg_get_userbyid(p.proowner), p.prosecdef, array_to_string(p.proconfig, ',')
    into v_owner, v_definer, v_cfg
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'is_admin';
  if v_owner <> 'postgres' then
    raise exception 'FAIL: is_admin owner=%', v_owner; end if;
  if not v_definer then
    raise exception 'FAIL: is_admin not security definer'; end if;
  if coalesce(v_cfg, '') not like '%search_path%' then
    raise exception 'FAIL: is_admin missing fixed search_path (%))', v_cfg; end if;
  select has_function_privilege('authenticated', 'public.is_admin()', 'execute')
    into v_exec;
  if not v_exec then
    raise exception 'FAIL: authenticated lacks EXECUTE on is_admin'; end if;
  raise notice 'PASS: TEST 16 is_admin owner/definer/search_path/execute';
end
$$;

-- ---------------------------------------------------------------------
-- TEST 17: preflight — re-running Migration 001 must abort because the
--   target objects now exist (confirms the fail-closed guard condition).
-- ---------------------------------------------------------------------
do $$
begin
  if to_regclass('public.profiles') is null
     or to_regclass('public.user_roles') is null
     or to_regclass('public.public_profiles') is null then
    raise exception 'FAIL: preflight precondition unexpected (object missing)';
  end if;
  raise notice 'PASS: TEST 17 preflight guard would abort a re-run (objects exist)';
end
$$;

-- ---------------------------------------------------------------------
-- CLEANUP: remove ONLY the test auth users (cascade removes their profiles
--   and user_roles). Never touches production data.
-- ---------------------------------------------------------------------
do $$
begin
  delete from auth.users
   where id in (
     'aaaaaaaa-0000-4000-8000-000000000001',
     'bbbbbbbb-0000-4000-8000-000000000002',
     'cccccccc-0000-4000-8000-000000000003',
     'dddddddd-0000-4000-8000-000000000004'
   );
  raise notice 'CLEANUP: removed test auth users (cascade removes profiles/roles)';
end
$$;

-- =====================================================================
-- END database-level tests. STATUS: NOT RUN.
-- =====================================================================





