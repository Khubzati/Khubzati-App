# Release Risk Register

Audit date: 2026-07-25  
Release decision: **NO-GO**

| ID | Severity | Risk | Impact | Likelihood | Mitigation / exit criterion |
|---|---|---|---|---|---|
| R-01 | Critical | Stripe webhook replay appends duplicate financial transactions | Corrupt ledger, reconciliation and audit totals | High; provider retries are normal | Put event and ledger write in one transaction, unique-key the side effect, and pass sequential/parallel replay cardinality tests |
| R-02 | Critical | Payout request and status paths are non-atomic and replayable | Overpayment or duplicate negative ledger entries | Medium-High under retries/concurrency | Serializable balance reservation, legal transition predicates, idempotency keys and unique ledger constraints |
| R-03 | Critical | Refund sum-check/create race | Total reserved refunds can exceed order total | Medium under concurrent clients/retries | Lock/order-scoped serializable transaction or atomic refundable-balance reservation; concurrent test |
| R-04 | High | Suspended/changed users retain JWT authority | Privileged access persists up to token expiry | Medium | Current-user/token-version verification and revocation tests |
| R-05 | High | Database lacks vendor/cardinality invariants | Orphaned or ambiguous product/order/review/cart state | Medium | Check constraints, unique cart ownership, FK/index audit and migration backfill |
| R-06 | High | Backend CI has no PostgreSQL or migration step | Green local state cannot be reproduced; defects merge untested | High on clean runner | Add service DB, explicit test URLs, `prisma migrate deploy`, then run all suites |
| R-07 | High | Uploads silently use local disk | File loss across deploy/restart; inconsistent replicas | High on ephemeral/horizontal hosting | Implement durable object storage; fail production startup for unsupported driver |
| R-08 | High | Admin bearer token is accessible to JavaScript | XSS becomes 24-hour admin credential theft | Medium | HttpOnly secure session/BFF, CSP, short rotation |
| R-09 | Medium | Malware scanner is optional/fail-open | Malicious public uploads | Medium | Mandatory production scanner/quarantine and isolated serving origin |
| R-10 | Medium | Vendor can mark payout account verified | Untrusted payout metadata appears trusted | Medium | Force false for vendor writes; admin/provider-only verification |
| R-11 | Medium | Flutter token refresh endpoint does not exist | Expired sessions cannot recover and are forced to login | High when refresh tokens are present | Align or remove refresh contract; integration test against registered backend |
| R-12 | Medium | Missing relation/filter indexes and full ledger scans | Slow dashboards, orders and payouts as data grows | High over time | Production-like query plans, composite indexes, aggregate balances |
| R-13 | Medium | Flutter CI hard-fails on accepted analyzer issues | Main branch pipeline cannot represent accepted baseline | High | Remove/fix warnings or explicitly scope analyzer; require zero unexpected findings |
| R-14 | Medium | Admin CI omits tests and type-check | Route/auth/finance regressions can merge | High | Run `npm run type-check`, complete tests and build in CI |
| R-15 | Medium | Runtime auth DDL masks missed migrations | Locking/privilege failures during live requests | Medium | Migrations-only schema ownership; readiness checks schema version |
| R-16 | Medium | Rate limits are per-process and fail-open | OTP/upload abuse during Redis absence | Medium | Required shared Redis in production and fail-closed auth limits |
| R-17 | Medium | No container/deployment artifact in repository | Environment drift and unverifiable runtime packaging | Medium | Versioned Docker/runtime manifest, non-root image, health probes and immutable release artifact |
| R-18 | Low | Detailed worker/queue metrics are anonymous | Operational information disclosure | Medium | Network-restrict or authenticate detailed metrics |
| R-19 | Low | Legacy backend stacks and quarantined Flutter code ship with source | Larger attack/dependency/maintenance surface | High | Remove after dependency/import proof; keep outside production packages |

## Release gate

Critical risks R-01 through R-03 and high risks R-04 through R-08 must be closed with executable tests and production-like migration/deployment evidence. Medium security/CI risks require closure or an explicit owner, deadline, monitoring control and rollback plan before reconsidering GO.

