# Final Production Audit

Audit date: 2026-07-25  
Method: independent source review of production entrypoints, registered routes, Prisma schema/migrations, Flutter and admin clients, workers, tests, and CI configuration. Prior readiness reports were not treated as evidence.

## Decision

**NO-GO. The previous GO decision is overturned.**

The core restaurant and bakery lifecycles are well tested, but production readiness is contradicted by executable financial-integrity, authorization-revocation, data-integrity, storage, and CI defects. The most direct release blocker is Stripe webhook replay: the unique webhook record detects a duplicate, but the code still appends another `FinancialTransaction` after the transaction returns. The existing idempotency test checks only the response flag and never checks ledger cardinality.

## Area ratings

| Area | Rating | Evidence-based assessment |
|---|---|---|
| Flutter customer app | Good | Secure storage, centralized Dio, explicit failure states and transport tests are strong. Token refresh calls an endpoint absent from the backend (`api_constants.dart:20`, `auth_interceptor.dart:135-175`), so refresh recovery cannot work. |
| Restaurant owner app | Good | Production routing, explicit vendor context and mutation failure handling are covered. Shared singleton networking and broad legacy/quarantine surface increase coupling. |
| Bakery owner app | Good | Production shell and backend lifecycle pass. Backend owner router remains a 2,500-line module with duplicated order/catalog logic. |
| Driver flow | Good | Role/assignment boundaries and canonical delivery transitions are tested. |
| Express backend | Needs improvement | Registered routes and global error handling exist, but role-bearing JWTs are trusted without current-user lookup, runtime schema DDL exists in auth, and multiple critical finance transitions are not atomic/idempotent. |
| Prisma/database | Critical | `relationMode = "prisma"` weakens ORM-enforced referential behavior; polymorphic vendor columns lack database check constraints; cart ownership lacks uniqueness; important foreign/filter columns lack indexes. |
| Authentication/authorization | Critical | `authenticateToken` verifies signature/payload only and does not reject a user suspended or role-changed after issuance (`auth.js` middleware lines 58-85). Admin tokens remain privileged for 24 hours. |
| Payments/finance | Critical | Duplicate webhook ledger writes, concurrent over-refund/over-payout races, and replayable payout state mutations directly threaten monetary correctness. |
| Uploads | Needs improvement | Ownership, size and MIME checks exist, but production silently falls back to local disk and malware scanning is optional/fail-open when unconfigured. SVG is accepted and served from `/uploads`. |
| Notifications/jobs | Acceptable | Queue models, retries, dead letters, health and advisory locking exist. Some health counts convert database errors to zero, masking failure. |
| Admin panel | Needs improvement | Backend remains the authority, but the browser stores the admin JWT in localStorage and a non-HttpOnly cookie. Middleware only decodes, not verifies, the cookie. |
| Security | Critical | Privilege revocation and finance integrity are release blockers; see `SECURITY_AUDIT.md`. |
| Performance/scalability | Needs improvement | Missing indexes, full-ledger balance scans, in-process rate limiting, local uploads and row-by-row loops limit horizontal scale. |
| Testing | Acceptable | Backend lifecycle and Flutter failure suites are valuable, but critical concurrency, ledger-cardinality, token-revocation, migration and CI tests are absent. |
| CI/CD | Critical | Backend CI provisions no PostgreSQL service or database variables and runs no migrations. Flutter CI runs `flutter analyze` even though the repository’s accepted analyzer baseline exits nonzero with 21 issues. Admin CI omits tests and type-check. |
| Production operations | Needs improvement | Liveness/readiness and shutdown hooks exist. No Docker/container definition is present, upload durability is not solved, deployment CI does not apply migrations, and rollback/backup procedures are documentation rather than automated gates. |

## Release blockers

1. **Duplicate ledger entries on Stripe webhook replay.** `payment-service.js:225-244` marks duplicate, but `payment-service.js:364-380` unconditionally appends a transaction. `FinancialTransaction` has no uniqueness key (`schema.prisma:634-653`).
2. **Payout and refund concurrency/state integrity.** Refund sum-check then create is non-transactional (`finance.js:243-269`). Payout balance-check then create is non-transactional (`finance.js:758-780`). Payout status endpoints accept any prior state and append ledger entries on every replay (`finance.js:860-923`).
3. **Suspension/role changes do not revoke access tokens.** Middleware trusts token `id`/`role` without loading the user (`middleware/auth.js:58-85`). Admin login issues a 24-hour token (`admin.js:282-286`), while suspension merely writes `deletedAt` (`admin.js:1224-1234`).
4. **Database invariants are not enforced.** Product/order/review vendor identity uses nullable parallel foreign keys without “exactly one” checks. Cart has no unique active cart per user, while `cart.js:136-137` performs raceable find-then-create.
5. **The release pipeline is not reproducible.** Backend CI has no database service/migration step; Flutter analyze is configured as a hard gate despite the known nonzero baseline; admin CI does not run its tests or type-check.
6. **Uploads are not production durable.** `upload.js:140-143` logs that non-local drivers are unimplemented and falls back to local disk.

## What is genuinely strong

- The mounted `/v1` lifecycle for both vendor types has isolated end-to-end evidence.
- Order pricing ignores client prices and snapshots product/modifier identity.
- Stripe signatures and webhook event uniqueness are implemented.
- Owner context and cross-role boundaries have executable coverage.
- Flutter secure storage, session invalidation, stale-vendor-response cancellation and recoverable transport failures are explicitly tested.
- Admin data mutations call protected backend routes; page middleware is not the ultimate authority.
- Readiness (`/ready`), liveness (`/health`), request IDs, queue models, audit records and graceful signal handlers exist.

## Minimum conditions to restore GO

- Make webhook financial writes part of the same idempotent transaction and assert one ledger entry after repeated/concurrent delivery.
- Serialize refund/payout balance changes and enforce legal payout transitions plus replay idempotency at database level.
- Revalidate current user role/status on protected requests or implement token-version/session revocation.
- Add database check/unique constraints for vendor polymorphism and cart ownership, with safe migrations/backfill.
- Provide durable object storage with mandatory production malware scanning policy.
- Make CI provision PostgreSQL, apply migrations, run backend tests; make Flutter analyzer policy internally consistent; run admin type-check and tests.
- Execute migration rollback/restore and deployment smoke rehearsals in an ephemeral production-like environment.

