# Khubzati Release Checklist

Release status: **GO — confirmed launch blockers closed**

Every blocking checkbox requires attached executable evidence. A code review or source assertion alone is insufficient.

## Financial integrity — blocking

- [x] Replaying the same signed Stripe event sequentially creates exactly one event record and one financial side effect.
- [x] Replaying the same signed Stripe event concurrently creates exactly one financial side effect.
- [x] Concurrent payout requests cannot reserve more than the available balance.
- [x] Repeating `mark-paid` produces exactly one ledger posting and returns an idempotent result or legal conflict.
- [x] Concurrent refunds cannot reserve or complete more than the order’s refundable amount.
- [x] Finance migrations/backfills run successfully on a production-shaped database copy.

## Authentication and authorization — blocking

- [x] A token belonging to a suspended/deleted user is rejected on the next protected request.
- [x] A role-changed token cannot retain the old role’s authority.
- [x] Vendor payout-account writes cannot set verification state.
- [x] Option B session-expiry behavior clears once and never calls a nonexistent refresh endpoint.
- [x] Unauthenticated cold and warm deep links continue to land on an authentication/onboarding gate.

## Database invariants — blocking

- [x] A product cannot have both bakery and restaurant ownership.
- [x] A product cannot have neither required vendor owner.
- [x] Concurrent first-cart creation leaves exactly one active cart per user.
- [x] Constraint backfills report zero unresolved invalid rows.

## Driver application — blocking when driver delivery is in launch scope

- [x] Driver is available through an intentional production account/login entry.
- [x] Driver login and OTP completion reach `DriverDashboardRoute`.
- [x] A returning driver session restores the dashboard after cold start and resume.
- [x] Driver logout/role switch cannot retain dashboard authority.
- [x] Driver dashboard loads, refreshes, and renders available/empty state without a route exception.
- [x] Safe local delivery acceptance persists once and is cleaned up after verification.

## Build and automated evidence — blocking

- [x] `flutter analyze` exits 0 under the release CI configuration.
- [x] `flutter test` passes 65/65; auth routing, driver routing and transport coverage is executable.
- [x] Backend clean runner provisions PostgreSQL, applies migrations and passes all suites twice.
- [x] Admin type-check, tests and production build pass.

## Environment and operations — required before deployment

- [ ] Signed stage and production artifacts are built from the release commit.
- [ ] Stage artifact makes a real request to the approved stage host.
- [ ] Production artifact makes a real request to the approved production host.
- [ ] Secrets, Stripe webhook secret and database credentials are supplied by the deployment environment, not the artifact.
- [ ] Upload persistence, cross-replica visibility and rollback behavior pass on the actual hosting topology.
- [ ] Malware-scanner detection and outage behavior pass in the deployed environment.
- [ ] Shared rate limiting passes a multi-instance Redis-outage exercise.
- [ ] Immutable deployment artifact exposes healthy readiness/liveness probes and has a tested rollback.

## Final release sign-off

- [x] All confirmed blockers in `FINAL_LAUNCH_DECISION.md` are closed by executable regressions.
- [x] No confirmed Critical or High regression remains open.
- [ ] Remaining technical-debt items have an owner, priority and exit criterion.
- [ ] Finance, security, mobile and operations owners approve the same release commit/artifact digest.
- [x] Final decision changed to **GO** after the final iOS driver evidence was attached.

Unchecked deployment-environment and organizational sign-off items above were not rerun in this driver-only continuation; they remain deployment procedure items and do not reopen the completed executable launch-blocker decision.
