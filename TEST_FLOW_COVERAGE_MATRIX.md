# TEST_FLOW_COVERAGE_MATRIX

| Area | Coverage Status | Evidence |
|---|---|---|
| Security: invalid JWT/upload auth/ownership/non-admin blocking/OTP caps | PARTIAL | `security.regression.extended.test.js` passes these checks |
| Security: OTP/Firebase fallback removed | PARTIAL | Firebase missing/invalid token is rejected; admin fallback bypass still exists |
| Security: rate limits enforced | PASS | `security.regression.extended.test.js` rate-limit check reaches 429 |
| Ordering idempotency + cancellation restock reason | PASS | `marketplace.flows.integration.test.js` isolated pass |
| Inventory append-only movement ledger | PASS | order/cancel flow checks movement records |
| Oversell prevention under concurrency | FAIL | `marketplace.stress.integration.test.js` isolated fail (40 success on stock=25) |
| Delivery slots/zone/shift/dispatch/assignment lock | PASS (isolated) | flow + driver + reliability suites pass isolated |
| Delivery completion state transitions | PASS (isolated) | `driver.delivery.test.js` isolated pass |
| Finance payout/ledger/settlement/reconciliation export | PASS (isolated) | `finance.test.js` isolated pass (full suite affected by DB exhaustion) |
| Refund/dispute lifecycle + ledger impact | PASS (isolated) | flow/reliability/finance isolated passes |
| KPI formulas (all required formulas) | PASS | `kpi.formula.validation.integration.test.js` |
| KPI global ALL row + city rows + rerun/backfill idempotency | PASS | same KPI formula integration test |
| SLA alert types (all requested) | PASS | `sla.alerts.rehearsal.integration.test.js` |
| SLA webhook headers/signature/retry/backoff/dead-letter/resolve | PASS | same SLA rehearsal integration test |
| Admin KPI/alerts/backfill/test-webhook auth controls | PASS | `admin.kpi.alerts.permissions.test.js` |
| Admin dashboard loading/empty/error/success UI states | GAP | No admin UI E2E harness configured |
| Workers/observability endpoints + KPI worker process wiring | PASS | SLA rehearsal worker observability test + package script check |
| Notification worker poison job handling | PASS | `marketplace.kpi.alert.queue.integration.test.js`, `notifications.queue.test.js` |
| Flutter smoke | PASS | `flutter analyze`, `flutter test` |
| Flutter integration E2E | GAP | `integration_test/` not present |
