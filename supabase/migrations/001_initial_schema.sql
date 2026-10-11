-- =====================================================================
-- JCER E-CELL — Migration 001: initial schema
-- public.profiles | public.user_roles | public.public_profiles
-- Target: a FRESH, dedicated STAGING Supabase project (PostgreSQL 15).
-- Run as: postgres (Supabase SQL Editor).
--
-- ONE-TIME, NON-IDEMPOTENT initial migration. The preflight guard below
-- aborts (and rolls back) if target objects already exist. Do NOT re-run
-- against a populated schema; create a reviewed upgrade migration instead.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 0. PRE-FLIGHT GUARD — fail closed on schema drift / conflicting objects.
--    Checks tables, the view, and the auth.users signup trigger so this
--    migration cannot be applied twice or onto a non-empty schema.
-- ---------------------------------------------------------------------
do $$
begin
  if to_regclass('public.profiles') is not null
     or to_regclass('public.user_roles') is not null
     or to_regclass('public.public_profiles') is not null then
    raise exception
      'Migration 001 stopped: profiles, user_roles, or public_profiles already exists. '
      'Inspect the schema and create a reviewed upgrade migration instead.';
  end if;

  if to_regprocedure('public.is_admin()') is not null
     or to_regprocedure('public.handle_new_user()') is not null
     or to_regprocedure('public.guard_profile_update()') is not null
     or to_regprocedure('public.set_updated_at()') is not null
     or to_regprocedure('public.submit_my_profile()') is not null
     or to_regprocedure('public.withdraw_my_profile()') is not null
     or to_regprocedure('public.admin_review_profile(uuid,text,timestamptz,text,boolean)') is not null then
    raise exception
      'Migration 001 stopped: one or more target functions already exist. '
      'Inspect the schema and create a reviewed upgrade migration instead.';
  end if;

  if exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'auth' and c.relname = 'users'
      and t.tgname = 'on_auth_user_created'
  ) then
    raise exception
      'Migration 001 stopped: trigger on_auth_user_created already exists on auth.users.';
  end if;
end
$$;

-- Schema usage for the API roles. NOTE: USAGE on the schema is NOT table
-- access and is NOT authorization — it only allows name resolution. Table
-- privileges and RLS (below) are the actual access controls.
grant usage on schema public to anon, authenticated;

-- ---------------------------------------------------------------------
-- 1. user_roles — server-controlled authorization source of truth.
--    No client INSERT/UPDATE/DELETE policy exists -> students cannot
--    grant themselves roles. Writable only by postgres/service_role.
-- ---------------------------------------------------------------------
create table public.user_roles (
  user_id    uuid primary key
             references auth.users (id) on delete cascade,
  role       text not null default 'student'
             constraint user_roles_role_check
             check (role in ('student', 'admin', 'resource_manager')),
  granted_by uuid references auth.users (id) on delete set null,
  granted_at timestamptz not null default now()
);

comment on table public.user_roles is
  'Server-controlled roles. Absence of a row == no elevated role. '
  'No client write path (no INSERT/UPDATE/DELETE policy; writes revoked).';

-- ---------------------------------------------------------------------
-- 2. profiles — one row per auth user; id mirrors auth.users.id.
--    Fields map to the app's profile object (camelCase -> snake_case).
--    achievements[] and gallery[] from the current localStorage model are
--    intentionally DEFERRED to a future migration (they need their own
--    RLS-protected tables); collegeEmail is redundant with the auth email.
-- ---------------------------------------------------------------------
create table public.profiles (
  id                   uuid primary key
                      references auth.users (id) on delete cascade,

  -- Identity (denormalized from auth.users; auth.users is source of truth)
  email                text,                                   -- PROTECTED (nullable: phone/OAuth)
  full_name            text not null default '',
  slug                 text not null,                          -- PROTECTED

  -- Academic
  usn                  text,                                   -- private; editable by owner
  department           text not null default '',
  academic_year        text not null default '',

  -- Public-facing content (edits to these on an approved profile force re-review)
  avatar_url           text,
  bio                  text not null default '',
  primary_role         text not null default '',
  skills               text[]    not null default '{}',
  collaboration_status text     not null default 'open',
  preferred_roles      text[]    not null default '{}',
  social_links         jsonb     not null default '{}'::jsonb,

  -- Review workflow (PROTECTED; changed only via RPCs/trigger)
  status               text      not null default 'draft'
                      constraint profiles_status_check
                      check (status in ('draft', 'pending_review', 'approved', 'rejected')),
  is_featured          boolean   not null default false,        -- PROTECTED
  rejection_reason     text,                                    -- PROTECTED
  submitted_at         timestamptz,                             -- PROTECTED
  approved_at          timestamptz,                             -- PROTECTED
  approved_by          uuid
                      references auth.users (id) on delete set null, -- PROTECTED

  -- Timestamps
  created_at           timestamptz not null default now(),      -- PROTECTED
  updated_at           timestamptz not null default now(),      -- PROTECTED

  -- Explicitly named constraints (stable names for exception handling)
  constraint profiles_slug_unique unique (slug),
  constraint profiles_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint profiles_social_links_object check (jsonb_typeof(social_links) = 'object'),

  -- Defense-in-depth: review metadata must be internally consistent per status.
  constraint profiles_review_metadata check (
       (status = 'approved'
         and approved_at is not null and approved_by is not null
         and rejection_reason is null)
    or (status = 'rejected'
         and rejection_reason is not null
         and length(trim(rejection_reason)) > 0
         and approved_at is null and approved_by is null)
    or (status in ('draft', 'pending_review')
         and approved_at is null and approved_by is null
         and rejection_reason is null)
  ),

  -- Defense-in-depth: only approved profiles may be featured.
  constraint profiles_featured_requires_approved
    check (status = 'approved' or is_featured = false)
);

comment on column public.profiles.status is
  'draft -> pending_review -> approved|rejected. PROTECTED: changed only via RPC/trigger.';

-- Index used by the public view (status='approved') and admin queues.
create index profiles_status_idx on public.profiles (status);

-- ---------------------------------------------------------------------
-- 3. public_profiles — approved-only, EXACTLY these 11 public columns.
--    Owner-based security (security_invoker = false): the underlying read
--    runs as the owner (postgres, BYPASSRLS), bypassing base-table RLS so
--    anon can read approved rows WITHOUT any anon policy on profiles.
--    Column exposure is bounded by this SELECT list only. No auth UUID,
--    email, USN, status, is_featured, review metadata, or timestamps.
--    The view is auto-updatable -> DML is revoked in the grants section.
-- ---------------------------------------------------------------------
create view public.public_profiles
with (security_invoker = false)
as
select
  slug,
  full_name,
  department,
  academic_year,
  avatar_url,
  bio,
  primary_role,
  skills,
  collaboration_status,
  preferred_roles,
  social_links
from public.profiles
where status = 'approved';

comment on view public.public_profiles is
  'Public directory: approved profiles, exactly 11 public columns. '
  'Owner=postgres (BYPASSRLS), security_invoker=false. DML revoked from clients.';
alter view public.public_profiles owner to postgres;

-- ---------------------------------------------------------------------
-- 4. is_admin() — narrow SECURITY DEFINER predicate. Reads user_roles as
--    postgres (BYPASSRLS), so it does NOT re-trigger the user_roles RLS
--    policy that calls is_admin() -> no recursion. auth.uid() is NULL for
--    anon -> returns false (fail-closed). search_path fixed to '' and all
--    references schema-qualified.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = (select auth.uid())
      and ur.role = 'admin'
  );
$$;

comment on function public.is_admin() is
  'True iff the authenticated caller has an admin role row. NULL uid -> false.';
alter function public.is_admin() owner to postgres;

-- ---------------------------------------------------------------------
-- 5. set_updated_at() — BEFORE UPDATE helper (not security definer; it
--    only touches updated_at, so it needs no elevated privileges).
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

alter function public.set_updated_at() owner to postgres;

-- ---------------------------------------------------------------------
-- 6. guard_profile_update() — BEFORE UPDATE trigger.
--    * Enforces re-review: editing public content on an APPROVED profile
--      forces status back to pending_review and clears review metadata, so
--      modified content is not publicly visible until re-approved.
--    * Private-only edits (e.g. usn) do NOT set public_content_changed, so
--      they do not trigger re-review.
--    * Column grants are the PRIMARY control (status/review/identity are not
--      updatable by clients); this trigger performs the transition and adds
--      defense-in-depth. It writes status as postgres (definer), permitted
--      because column privileges are checked only against the client
--      statement's SET columns, not trigger-modified values.
--    * Touches only review columns (disjoint from set_updated_at), so the
--      two BEFORE-UPDATE triggers are order-independent.
-- ---------------------------------------------------------------------
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_public_content_changed boolean;
begin
  v_public_content_changed :=
       new.full_name            is distinct from old.full_name
    or new.department           is distinct from old.department
    or new.academic_year        is distinct from old.academic_year
    or new.avatar_url           is distinct from old.avatar_url
    or new.bio                  is distinct from old.bio
    or new.primary_role         is distinct from old.primary_role
    or new.skills               is distinct from old.skills
    or new.collaboration_status is distinct from old.collaboration_status
    or new.preferred_roles      is distinct from old.preferred_roles
    or new.social_links         is distinct from old.social_links;

  -- Re-review on public-content edit of an approved profile.
  if old.status = 'approved' and v_public_content_changed then
    new.status           := 'pending_review';
    new.submitted_at     := now();
    new.approved_at      := null;
    new.approved_by      := null;
    new.rejection_reason := null;
    new.is_featured      := false;
  end if;

  -- Owner ID is immutable (defense-in-depth; id is also not column-granted).
  if new.id is distinct from old.id then
    raise exception 'Profile owner ID cannot be changed' using errcode = '42501';
  end if;

  return new;
end;
$$;

alter function public.guard_profile_update() owner to postgres;

-- ---------------------------------------------------------------------
-- 7. handle_new_user() — AFTER INSERT ON auth.users.
--    Creates a draft profile. Never trusts metadata for role/status.
--    Handles nullable email (column is nullable; no synthetic address and
--    no email unique constraint, so no email conflict is possible).
--    Bounded slug retry: retries ONLY the profiles_slug_unique conflict;
--    re-raises any other unique violation (e.g. pkey race) without looping.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_base       text;
  v_slug       text;
  v_name       text;
  v_attempt    integer := 0;
  v_email      text;
  v_constraint text;
begin
  -- Idempotency: never create a duplicate profile for an existing user.
  if exists (select 1 from public.profiles where id = new.id) then
    return new;
  end if;

  v_email := new.email;  -- may be NULL (phone/OAuth); column is nullable
  v_name  := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    ''
  );

  v_base := lower(regexp_replace(
    regexp_replace(
      coalesce(nullif(v_name, ''), split_part(coalesce(v_email, 'student'), '@', 1)),
      '[^a-zA-Z0-9]+', '-', 'g'
    ),
    '(^-+|-+$)', '', 'g'
  ));
  if v_base = '' then
    v_base := 'student';
  end if;

  loop
    v_attempt := v_attempt + 1;
    if v_attempt > 5 then
      raise exception 'Could not allocate a unique profile slug for user %', new.id;
    end if;

    if v_attempt = 1 then
      v_slug := v_base;
    else
      v_slug := v_base || '-' || substr(md5(random()::text || new.id::text), 1, 6);
    end if;

    begin
      insert into public.profiles (id, email, full_name, slug, status)
      values (new.id, v_email, v_name, v_slug, 'draft');
      exit;
    exception
      when unique_violation then
        get stacked diagnostics v_constraint = constraint_name;
        if v_constraint = 'profiles_slug_unique' then
          continue;                 -- slug taken -> retry with new suffix
        elsif v_constraint = 'profiles_pkey' then
          return new;               -- race: profile already created
        else
          raise;                    -- any other conflict -> propagate (no loop)
        end if;
    end;
  end loop;

  -- Establish the single default role (single-role model).
  insert into public.user_roles (user_id, role)
  values (new.id, 'student')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

alter function public.handle_new_user() owner to postgres;

-- ---------------------------------------------------------------------
-- 8. submit_my_profile() — student RPC: draft|rejected -> pending_review.
--    SECURITY DEFINER (postgres) so it can write status/review columns the
--    client cannot. Scoped to the caller's own id via auth.uid().
-- ---------------------------------------------------------------------
create or replace function public.submit_my_profile()
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user    uuid := auth.uid();
  v_profile public.profiles;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  update public.profiles p
     set status = 'pending_review',
         submitted_at = now(),
         approved_at = null,
         approved_by = null,
         rejection_reason = null,
         is_featured = false
   where p.id = v_user
     and p.status in ('draft', 'rejected');

  if not found then
    raise exception 'Profile cannot be submitted from its current status'
      using errcode = 'P0001';
  end if;

  select * into v_profile from public.profiles where id = v_user;
  return v_profile;
end;
$$;

alter function public.submit_my_profile() owner to postgres;

-- ---------------------------------------------------------------------
-- 9. withdraw_my_profile() — student RPC: approved -> draft ONLY.
--    (Pending-review withdrawal is intentionally NOT supported here.)
-- ---------------------------------------------------------------------
create or replace function public.withdraw_my_profile()
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user    uuid := auth.uid();
  v_profile public.profiles;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  update public.profiles p
     set status = 'draft',
         submitted_at = null,
         approved_at = null,
         approved_by = null,
         rejection_reason = null,
         is_featured = false
   where p.id = v_user
     and p.status = 'approved';

  if not found then
    raise exception 'Only an approved profile can be withdrawn'
      using errcode = 'P0001';
  end if;

  select * into v_profile from public.profiles where id = v_user;
  return v_profile;
end;
$$;

alter function public.withdraw_my_profile() owner to postgres;

-- ---------------------------------------------------------------------
-- 10. admin_review_profile() — admin-only review RPC. The ONLY client route
--     for approval, rejection, and featured-status changes.
--     Optimistic concurrency: the caller must supply the profile's updated_at
--     (p_reviewed_updated_at) from the version it loaded; the row is updated
--     only if it is still pending_review AND updated_at is unchanged. If a
--     student edited the profile in the meantime, updated_at differs and the
--     UPDATE affects 0 rows -> a clear "changed; refresh" error (no silent
--     overwrite). set_updated_at() bumps updated_at on every student edit.
--     Order: authorization -> null p_profile_id (22023) -> null p_status
--     (22023) -> null p_reviewed_updated_at (22023) -> status validation ->
--     rejection-reason check -> existence check -> pending check ->
--     conditional update. approved_by/approved_at are set by the DB
--     (auth.uid()/now()), never from client input.
-- ---------------------------------------------------------------------
create or replace function public.admin_review_profile(
  p_profile_id          uuid,
  p_status              text,
  p_reviewed_updated_at timestamptz,
  p_rejection_reason    text default null,
  p_is_featured         boolean default false
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor   uuid := auth.uid();
  v_profile public.profiles;
  v_exists  boolean;
  v_pending boolean;
begin
  -- Authorization first.
  if v_actor is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if not public.is_admin() then
    raise exception 'Administrator role required' using errcode = '42501';
  end if;

  -- Explicit NULL guards (SQLSTATE 22023), before status-value validation.
  if p_profile_id is null then
    raise exception 'Profile id is required' using errcode = '22023';
  end if;
  if p_status is null then
    raise exception 'Status is required' using errcode = '22023';
  end if;
  if p_reviewed_updated_at is null then
    raise exception 'Reviewed updated_at is required' using errcode = '22023';
  end if;

  -- Only approve/reject are permitted; never arbitrary statuses.
  if p_status not in ('approved', 'rejected') then
    raise exception 'Admin review status must be approved or rejected'
      using errcode = '22023';
  end if;

  if p_status = 'rejected'
     and (p_rejection_reason is null or length(trim(p_rejection_reason)) = 0) then
    raise exception 'A rejection reason is required' using errcode = '22023';
  end if;

  -- Existence and pending-review state (distinct from the concurrency check).
  select exists (select 1 from public.profiles where id = p_profile_id)
    into v_exists;
  if not v_exists then
    raise exception 'Profile not found' using errcode = 'P0001';
  end if;

  select exists (select 1 from public.profiles
                  where id = p_profile_id and status = 'pending_review')
    into v_pending;
  if not v_pending then
    raise exception 'Profile is not pending review' using errcode = 'P0001';
  end if;

  -- Optimistic concurrency: apply ONLY if updated_at still equals the version
  -- the admin reviewed. 0 rows affected => the profile changed underneath us.
  update public.profiles p
     set status           = p_status,
         approved_at      = case when p_status = 'approved' then now() else null end,
         approved_by      = case when p_status = 'approved' then v_actor else null end,
         rejection_reason = case when p_status = 'rejected'
                                 then trim(p_rejection_reason) else null end,
         is_featured      = case when p_status = 'approved'
                                 then coalesce(p_is_featured, false) else false end
   where p.id = p_profile_id
     and p.status = 'pending_review'
     and p.updated_at = p_reviewed_updated_at;

  if not found then
    raise exception 'Profile changed since it was loaded; refresh and retry'
      using errcode = 'P0001';
  end if;

  select * into v_profile from public.profiles where id = p_profile_id;
  return v_profile;
end;
$$;

alter function public.admin_review_profile(uuid, text, timestamptz, text, boolean) owner to postgres;

-- ---------------------------------------------------------------------
-- 11. TRIGGERS
--     Two BEFORE-UPDATE ROW triggers on profiles. PostgreSQL fires same-kind
--     ROW triggers in alphabetical name order (profiles_guard_update before
--     profiles_set_updated_at), but they modify DISJOINT columns, so the
--     result is independent of order.
-- ---------------------------------------------------------------------
drop trigger if exists profiles_guard_update on public.profiles;
create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 12. ENABLE RLS (ENABLE, not FORCE — FORCE would subject the postgres owner
--     to RLS and break the SECURITY DEFINER / owner-based view pattern).
-- ---------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.user_roles enable row level security;

-- ---------------------------------------------------------------------
-- 13. POLICIES (created only after is_admin() exists — section 4).
--     Scalar-subquery wrappers (select auth.uid()) / (select is_admin()) let
--     PostgreSQL evaluate each once per query (InitPlan), not per row.
-- ---------------------------------------------------------------------
-- user_roles: read own role, or all roles if admin. No write policies.
drop policy if exists user_roles_read_self_or_admin on public.user_roles;
create policy user_roles_read_self_or_admin
  on public.user_roles
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_admin())
  );

-- profiles: NO anon policy (public reads go through public_profiles view).
drop policy if exists profiles_read_self_or_admin on public.profiles;
create policy profiles_read_self_or_admin
  on public.profiles
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or (select public.is_admin())
  );

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- No INSERT/DELETE policies on profiles: creation is via the signup trigger;
-- lifecycle changes are via RPCs. No client insert/delete path exists.

-- ---------------------------------------------------------------------
-- 14. TABLE / VIEW PRIVILEGES (minimum; auto-exposure disabled).
-- ---------------------------------------------------------------------
-- profiles: anon none; authenticated SELECT (RLS-scoped) + UPDATE on the
-- 11 content columns ONLY. status/slug/email/review/timestamps are NOT
-- granted for UPDATE. (usn IS in the editable list — it is a private field
-- the owner may edit without triggering public re-review.)
revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant update (
  full_name, usn, department, academic_year, avatar_url, bio,
  primary_role, skills, collaboration_status, preferred_roles, social_links
) on public.profiles to authenticated;
-- NOT granted for update: id, email, slug, status, is_featured,
--   rejection_reason, submitted_at, approved_at, approved_by,
--   created_at, updated_at.

-- user_roles: clients read-only; no write privileges.
revoke all on public.user_roles from public, anon, authenticated;
grant select on public.user_roles to authenticated;

-- public view: SELECT only for anon+authenticated; DML revoked (auto-updatable).
revoke all on public.public_profiles from public;
revoke all on public.public_profiles from anon, authenticated;
grant select on public.public_profiles to anon, authenticated;
revoke insert, update, delete on public.public_profiles from anon, authenticated;

-- ---------------------------------------------------------------------
-- 15. FUNCTION EXECUTE PRIVILEGES.
--     Revoke from PUBLIC/anon, grant EXECUTE to authenticated only.
--     Trigger functions get NO client EXECUTE (postgres owner only).
-- ---------------------------------------------------------------------
revoke all on function public.is_admin() from public;
grant  execute on function public.is_admin() to authenticated;

revoke all on function public.submit_my_profile() from public, anon;
revoke all on function public.withdraw_my_profile() from public, anon;
revoke all on function public.admin_review_profile(uuid, text, timestamptz, text, boolean) from public, anon;
grant execute on function public.submit_my_profile() to authenticated;
grant execute on function public.withdraw_my_profile() to authenticated;
grant execute on function public.admin_review_profile(uuid, text, timestamptz, text, boolean) to authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.guard_profile_update() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 16. DEFAULT PRIVILEGES — avoid accidental future exposure of objects
--     created by postgres in this schema (belt-and-suspenders; recheck if
--     migrations are later run as a different role).
-- ---------------------------------------------------------------------
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 17. POST-CREATION ASSERTIONS (no production data required).
--     Exact-column-set check on the public view (allowlist, not blocklist).
-- ---------------------------------------------------------------------
do $$
declare
  v_actual   text;
  v_expected text;
begin
  -- RLS enabled on both base tables.
  if not (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass) then
    raise exception 'ASSERT FAIL: RLS not enabled on public.profiles';
  end if;
  if not (select relrowsecurity from pg_class where oid = 'public.user_roles'::regclass) then
    raise exception 'ASSERT FAIL: RLS not enabled on public.user_roles';
  end if;

  -- public_profiles must expose EXACTLY the 11 intended columns.
  select string_agg(column_name, ',' order by column_name) into v_actual
  from information_schema.columns
  where table_schema = 'public' and table_name = 'public_profiles';

  v_expected := 'academic_year,avatar_url,bio,collaboration_status,department,'
             || 'full_name,preferred_roles,primary_role,skills,slug,social_links';

  if v_actual is distinct from v_expected then
    raise exception 'ASSERT FAIL: public_profiles column set mismatch. actual=[%] expected=[%]',
      v_actual, v_expected;
  end if;
end
$$;

commit;

-- =====================================================================
-- END Migration 001
-- =====================================================================








