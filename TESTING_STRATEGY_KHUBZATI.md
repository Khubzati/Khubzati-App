# TESTING_STRATEGY_KHUBZATI

## Source of Truth Used
- `KPI_DEFINITIONS.md`
- `ALERT_THRESHOLD_CONFIGURATION.md`
- `INCIDENT_RUNBOOK_MARKETPLACE_HEALTH.md`
- `LAUNCH_READINESS_CHECKLIST_2026-08-11.md`

## Objective
Run a production launch dress rehearsal for Khubzati marketplace behavior across backend APIs, workers/queues, finance/disputes, KPI/SLA alerting, admin contracts, and mobile quality gates.

## Approach
1. Prioritize end-to-end backend integration over isolated unit tests.
2. Use deterministic seed baseline (`node scripts/test-setup.js`) and explicit cleanup.
3. Validate both:
   - isolated suite behavior (to verify business logic)
   - full-suite execution behavior (to expose lifecycle/resource failures)
4. Include negative/security/concurrency/stress scenarios.
5. Treat launch blockers as any Critical/High issues affecting correctness, auth, or operational reliability.

## Execution Layers
- Security regression: JWT/auth/upload/ownership/OTP/rate limits/admin protection.
- Marketplace flows: onboarding, ordering, scheduled delivery, dispatch, refunds/disputes, payout/settlement/reconciliation.
- KPI and SLA reliability: formula accuracy, idempotent backfill, alert generation/resolution, webhook signing + retry/dead-letter.
- Worker/observability: health endpoints, queue metrics, dedicated worker process wiring.
- Platform checks: Prisma schema validation, backend suite, admin type-check, Flutter analyze/tests.

## Test Design Rules Applied
- No mock-only E2E flow replacement.
- No flaky sleep-based assertions.
- Use direct polling/state assertions where async behavior exists.
- Explicitly validate idempotency and race behavior (orders/dispatch/queues).

## Known Harness Gaps
- Admin UI E2E harness not configured (no Playwright/Cypress config found).
- Flutter integration-test harness not configured (`integration_test/` missing).
- Therefore: backend/API integration coverage is the primary launch confidence signal.
