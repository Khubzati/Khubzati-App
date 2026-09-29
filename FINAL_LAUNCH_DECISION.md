# Final Launch Decision

## Decision: NO-GO

This decision is based only on defects reproduced through executable requests, database state, the running Flutter application, or required build-quality commands. Static-only and non-reproduced concerns are excluded.

## Confirmed launch blockers

| Blocker | Runtime proof | Why it blocks launch | Estimated fix effort |
|---|---|---|---|
| Stripe replay duplicates financial transactions | Same valid signed event posted twice; two financial transactions remained | Normal provider retries corrupt reconciliation and ledger totals | 2–4 engineering days, including migration and sequential/parallel replay tests |
| Payout reservation and mark-paid paths are raceable/replayable | Concurrent 6+6 requests succeeded against balance 10; repeated mark-paid created duplicate -5 entries | Platform can reserve/pay more than the available balance and double-post settlement | 4–7 days, including atomic reservation, transition constraints, idempotency and migration |
| Refund reservation is raceable | Two concurrent refunds totaling 12 succeeded on an order worth 10 | Refund liabilities can exceed the authoritative order value | 2–4 days, including transaction/locking and concurrency tests |
| Privilege revocation is ineffective for issued admin JWTs | Same token continued to receive 200 after account suspension | A revoked administrator retains production authority until token expiry | 2–4 days, including token-version/current-user enforcement and regression tests |
| Core database ownership/cardinality invariants are absent | Ambiguous dual-owner product was inserted; concurrent flow created two active carts | Invalid authoritative state is reachable under normal writes and concurrency | 3–6 days, including cleanup/backfill, constraints and race tests |
| Driver dashboard has no production entry path | Live account-type screen has no Driver option; driver login/OTP and restoration paths do not navigate to the dashboard | Drivers cannot operate deliveries if driver operations are in launch scope | 3–5 days plus end-to-end login/OTP/resume testing |
| Vendor controls payout verification state | Owner request persisted `isVerified: true` | Untrusted clients can manufacture trusted payout metadata | 0.5–1.5 days plus authorization tests |
| Token refresh contract is broken | Real `/v1/auth/refresh-token` request returned 404 | Expired authenticated sessions cannot recover as the client promises | 1–3 days, depending on whether refresh is implemented or removed |
| Required Flutter analyzer gate is red | Analyzer exited nonzero with 21 issues | A release cannot be distinguished from a regressed build under the current required gate | 1–3 days, followed by a clean CI run |

Estimated critical path: approximately **3–4 calendar weeks for one engineer**, or **1–2 weeks with backend, Flutter and release work performed in parallel**, followed by a full financial/security regression run.

## Withdrawals and exclusions

- The alleged unauthenticated deep-link bypass is withdrawn: real cold and warm URL-scheme execution did not reach a protected page.
- Quarantined DI classes did not overwrite the live classes because they are distinct Dart types; no wrong runtime resolution was observed.
- Parallel networking stacks did not split current production calls: measured application call sites use ApiClient; Retrofit is unused residue.
- Upload durability, admin JavaScript token theft, malware scanning, active-content serving, rate-limit topology, stage/prod host separation, missing-index performance and deployment packaging were not reproduced in a production-equivalent environment. They remain verification or debt items, not evidence-based blockers.

Launch must remain **NO-GO** until every blocker above has a passing executable regression and the release checklist is green.
