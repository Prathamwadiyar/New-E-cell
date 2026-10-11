# JCER E-CELL — Migration 001 Security Review

**Status:** Static review only. **No SQL was executed and no database security
has been proven by execution.** All claims below are design/static conclusions
to be confirmed by the staging test suite (`NOT RUN`).

## 1. Authorization model

- **`user_roles`** is the single authorization source of truth. It has **no**
  client write policy and writes are revoked from `authenticated`/`anon`, so a
  student can never grant themselves `admin`/`resource_manager`. Roles are
  provisioned only by `postgres`/`service_role` (documented bootstrap).
- **`is_admin()`** is a narrow `SECURITY DEFINER` function owned by `postgres`
  with `search_path = ''` and schema-qualified references. It reads
  `user_roles` as `postgres` (BYPASSRLS), so calling it from an RLS policy does
  **not** re-trigger the policy (no recursion). `auth.uid()` is NULL for `anon`,
  so it fails closed.

## 2. Profile privacy and RLS

- RLS is **enabled** (not forced) on `profiles` and `user_roles`.
- `profiles` has **no anon policy**; anonymous access to the directory flows
  only through the `public_profiles` view. Authenticated students can read only
  their own row (`id = auth.uid()`); admins can read all.
- **Column-level grants** are the primary control: `authenticated` may UPDATE
  only the 11 content columns. `status`, `slug`, `email`, `is_featured`,
  `rejection_reason`, `submitted_at`, `approved_at`, `approved_by`, `created_at`,
  `updated_at`, and `id` are **not** updatable by clients. RLS restricts rows;
  column grants restrict columns; the guard trigger enforces value transitions.
- No session flag or client-settable setting is used as an authorization
  boundary.

## 3. Public view

- `public_profiles` exposes **exactly** the 11 agreed public columns
  (`slug, full_name, department, academic_year, avatar_url, bio, primary_role,
  skills, collaboration_status, preferred_roles, social_links`), approved rows
  only. No auth UUID, email, USN, status, `is_featured`, review metadata, or
  timestamps.
- Owner is `postgres` with `security_invoker = false`, so the underlying read
  runs as `postgres` (BYPASSRLS) — this is what lets `anon` read approved rows
  without an anon policy on `profiles`. The Supabase `security_definer_view`
  advisory is expected and acceptable here.
- The view is auto-updatable, so **DML is revoked** from `anon`/`authenticated`.
- A post-creation assertion compares the **exact sorted column set** (allowlist),
  not a blocklist, so future private-column leakage fails the migration.

## 4. Lifecycle (enforced in the database)

- `draft → pending_review` and `rejected → pending_review`: `submit_my_profile()`.
- `approved → draft`: `withdraw_my_profile()` (approved only; no pending
  withdrawal, per the agreed rule).
- `pending_review → approved|rejected`: `admin_review_profile()` only, and only
  from `pending_review`. It rejects null `p_profile_id`/`p_status`/
  `p_reviewed_updated_at` with SQLSTATE `22023` after the admin check and before
  status validation; requires a rejection reason; sets
  `approved_by`/`approved_at` from the DB, never the client. It also enforces
  **optimistic concurrency**: the caller must pass the reviewed version's
  `updated_at` (`p_reviewed_updated_at`), and the row is updated only if it is
  still `pending_review` AND `updated_at` is unchanged. A stale timestamp (a
  student edited the profile after the admin loaded it) updates 0 rows and fails
  with `P0001` ("Profile changed since it was loaded; refresh and retry"), so an
  admin can never approve/reject a newer version. `set_updated_at()` bumps
  `updated_at` on every edit.
- Editing public content on an approved profile forces `pending_review` and
  clears review metadata (guard trigger), removing it from the public view until
  re-approved. Private-only edits (e.g. `usn`) do not trigger re-review.
- Table CHECK constraints (`profiles_review_metadata`,
  `profiles_featured_requires_approved`) provide defense-in-depth.

## 5. Signup trigger

- Creates a `draft` profile only; never trusts metadata for role/status.
- Nullable email is handled (column is nullable; no synthetic address; no email
  unique constraint, so no email-conflict loop).
- Slug generation is bounded (≤5 attempts) and retries **only** the
  `profiles_slug_unique` conflict (identified via `GET STACKED DIAGNOSTICS`);
  any other unique violation is re-raised without looping. Inserts the default
  `student` role idempotently.

## 6. Known limitations / decisions

- **Field mapping:** `achievements[]` and `gallery[]` from the current
  localStorage model are **deferred** to a future migration (they need their own
  RLS-protected tables). `collegeEmail` is treated as redundant with the auth
  `email`. Confirm before frontend integration.
- **Email is nullable/non-unique;** phone/OAuth users may have NULL email.
  Confirm the app tolerates this.
- **Withdrawal scope:** only `approved → draft`. A student who submitted
  (`pending_review`) cannot un-submit in this migration (agreed).
- **Admin flexibility:** the review RPC only approves/rejects from
  `pending_review`; it cannot move a profile to `draft`/`pending_review`
  (agreed).
- **Verification gap:** recursion-safety, RLS, column-grant enforcement, and
  lifecycle behavior are **not** proven until the staging DB + API tests run.

## 7. What was NOT done (by scope)

- No SQL executed; no Supabase connection; no credentials handled.
- No frontend code edited; no packages installed; nothing committed/pushed.
- See `STAGING_VALIDATION.md` for execution, bootstrap, and rollback.
