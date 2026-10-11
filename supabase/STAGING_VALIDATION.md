# JCER E-CELL — Supabase Staging Validation Guide

**Scope:** Database preparation and validation artifacts for Migration 001.
This is **not** the frontend integration phase. Nothing here has been executed;
everything below is **NOT RUN** until an operator runs it in staging.

Target: a **fresh, dedicated staging Supabase project** (PostgreSQL 15), project
ref `jcer-ecell-production` is the eventual production target — **do not run this
against production.**

---

## 1. Prerequisites

- A dedicated **staging** Supabase project (never production).
- Access to the Supabase **SQL Editor** as `postgres`.
- Supabase **Auth** enabled with **Email** provider (and Google if used).
- The VS Code **REST Client** extension (for `001_api_test.http`) — no install
  required if you translate the requests to `curl`.
- The project **ANON (public) key** for API tests. **Never** use or store the
  **service-role key** in any frontend code or test file.

## 2. Files

| File | Purpose |
|------|---------|
| `supabase/migrations/001_initial_schema.sql` | One-time initial schema migration. |
| `supabase/tests/001_initial_schema_test.sql` | DB-level tests (SQL Editor, self-contained). |
| `supabase/tests/001_api_test.http` | API-level tests (PostgREST, JWT-based). |
| `supabase/STAGING_VALIDATION.md` | This guide. |
| `supabase/SECURITY_REVIEW.md` | Security decisions and limitations. |

## 3. Execution order

1. **Apply the migration.** Open `001_initial_schema.sql` in the SQL Editor and
   run it **once**. It is wrapped in a single transaction with a fail-closed
   preflight guard and post-creation assertions. Expected result: `Success. No
   rows returned`. If the preflight guard fires, the target objects already
   exist — stop and inspect; do not force it.
   - The migration is **intentionally non-idempotent**. Re-running it aborts at
     the preflight guard. For schema changes after go-live, write a new reviewed
     upgrade migration.

2. **Create the first administrator (bootstrap).**
   - Have the intended admin sign up through the app (or via the Auth REST
     endpoint) so an `auth.users` row and a `draft` profile are created by the
     signup trigger.
   - Copy their Auth UUID from **Authentication → Users** in the dashboard
     (this is the only place the UUID is obtained; no credential is exposed).
   - Run the following **once** in the SQL Editor, replacing the placeholder:

     ```sql
     -- BOOTSTRAP FIRST ADMIN — replace the placeholder UUID, run as postgres.
     insert into public.user_roles (user_id, role, granted_by)
     values ('REPLACE_WITH_ADMIN_AUTH_UUID', 'admin', 'REPLACE_WITH_ADMIN_AUTH_UUID')
     on conflict (user_id) do update set role = 'admin';
     ```

   - This is the **only** privileged write to `user_roles`. It is performed by a
     human operator with `postgres` access. No client-side service-role key is
     ever used. Subsequent admins are granted the same way.

3. **Run the DB-level tests.** Run `001_initial_schema_test.sql` in the SQL
   Editor. It inserts three fixed test Auth users (firing the signup trigger),
   runs all assertions, then **deletes only those test users** (cascade removes
   their profiles and roles). Expected: a series of `NOTICE` lines all beginning
   with `PASS:`. Any `FAIL`/`ERROR` indicates a defect — investigate before
   proceeding. It cleans up after itself; it never touches production data.

4. **Run the API-level tests.** These verify real JWT-based PostgREST
   authorization (the SQL Editor simulation alone does not prove API behavior).
   - Create three real Auth users in staging: Student A, Student B, and the
     admin (grant the admin role via the bootstrap in step 2).
   - Sign in as each and copy their `access_token` (Auth REST:
     `POST /auth/v1/token?grant_type=password`).
   - Fill the variables at the top of `001_api_test.http` (`@baseUrl`, `@anonKey`,
     `@aJwt`, `@bJwt`, `@adminJwt`, and the `<STUDENT_*_UUID>` placeholders).
   - Run each request. Expected results are documented inline (A1–A14). Key
     expectations:
     - A2/A7 return `400`/`403` (private column / protected column denied).
     - A6 returns `200` with `[]` (cross-student RLS isolation).
     - A10 returns `403` (student blocked from admin RPC).
     - A13 returns `400` with SQLSTATE `22023`.
   - **curl equivalent** for one RPC (repeat per test with the right token):
     ```bash
     curl -s "$BASE/rest/v1/rpc/submit_my_profile" \
       -H "apikey: $ANON_KEY" -H "Authorization: Bearer $A_JWT" \
       -H "Content-Type: application/json" -d '{}'
     ```

## 4. Test expectations summary

- Every DB-level test prints `PASS: …`. Any `FAIL`/`ERROR` is a blocker.
- API tests return the HTTP status noted inline. A `200` where a `403` is
  expected (or vice-versa) is a blocker.
- **No test has been executed.** All results are to be produced by the operator.

## 5. Cleanup

- The DB-level test file deletes its own test users automatically.
- API tests operate on real staging users you created; delete them from
  **Authentication → Users** when finished. Never run against production data.

## 6. Rollback / recovery

- Because Migration 001 runs in a single transaction with a preflight guard, a
  failed run leaves **no partial objects**.
- To reset a staging project to re-test: drop the three objects and their
  functions, then re-apply. Example (staging only):
  ```sql
  -- Drop dependents before dependencies (no CASCADE). Order matters.
  drop trigger if exists on_auth_user_created on auth.users;          -- depends on handle_new_user()
  drop trigger if exists profiles_guard_update on public.profiles;    -- depends on guard_profile_update()
  drop trigger if exists profiles_set_updated_at on public.profiles;  -- depends on set_updated_at()
  drop function if exists public.admin_review_profile(uuid,text,timestamptz,text,boolean); -- depends on is_admin()
  drop function if exists public.submit_my_profile();                 -- returns public.profiles
  drop function if exists public.withdraw_my_profile();               -- returns public.profiles
  drop function if exists public.handle_new_user();                   -- references profiles, user_roles
  drop function if exists public.guard_profile_update();
  drop function if exists public.set_updated_at();
  drop function if exists public.is_admin();                          -- references user_roles
  drop view  if exists public.public_profiles;                        -- depends on profiles
  drop table if exists public.profiles;
  drop table if exists public.user_roles;
  ```
- Never run destructive DDL against production.

## 7. Frontend integration (next phase — NOT done here)

The frontend still uses simulated auth and `localStorage`. Integration (a later
phase, out of scope for this migration) will:
- Install `@supabase/supabase-js`; create a client with `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` only (never the service-role key).
- Replace `DirectoryAuthContext` login/register with `supabase.auth.*`.
- Replace `ProfileEditor` submit with `rpc('submit_my_profile')`; add a withdraw
  action calling `rpc('withdraw_my_profile')`; save content columns only.
- Replace `AdminDashboard` approve/reject with `rpc('admin_review_profile')`.
- Read the public directory from `public_profiles`; admin reads from `profiles`.
- Derive `isAdmin` from a `user_roles` select for `auth.uid()` (remove the
  hardcoded passcodes and the `jcer_admin_session_auth` localStorage flag).

See `SECURITY_REVIEW.md` for the security model and known limitations.

