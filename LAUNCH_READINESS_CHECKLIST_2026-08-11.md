# Launch Readiness Checklist (Target: 2026-08-11)

## Security
- [x] OTP fallback authentication removed.
- [x] Firebase fallback authentication removed.
- [x] Upload endpoints require auth.
- [x] Upload ownership validation enforced.
- [x] Security event logging table and writes implemented.
- [ ] Secret rotation runbook validated in staging.

## Ordering & Inventory
- [x] Idempotency keys for create order implemented.
- [x] Inventory movement append-only ledger implemented.
- [x] Cancellation restock reconciliation implemented.
- [ ] Stress tests for oversell at peak concurrency.

## Delivery Ops
- [x] Delivery slots/route zones/driver shifts/dispatch jobs schema added.
- [x] Baseline APIs added.
- [x] SLA alert webhook pipeline with retry + dead-letter + audit logs.
- [ ] Dispatch optimization/scoring and final SLA alerting calibration.

## Finance Ops
- [x] Payout accounts API.
- [x] Vendor ledger entries foundation.
- [x] Settlement batch APIs.
- [x] Reconciliation export endpoint.
- [x] Finance dashboard risk cards (payout/dispute/dispatch).
- [ ] Finance dashboard rollups tuning and historical backfill verification.

## Observability
- [x] Notification queue metrics endpoint.
- [x] Worker health endpoint.
- [x] Notification dead-letter persistence.
- [x] KPI worker health endpoint and queue metrics endpoint.
- [x] Daily KPI aggregation worker + idempotent backfill.
- [ ] Production alert thresholds tuned (lag, payout stuck, dispute aging, refund ratio).

## Marketplace Health
- [x] `kpi_daily_fact` extended with launch KPIs.
- [x] Admin endpoints: `/admin/kpis/daily`, `/admin/alerts/active`, `/admin/kpis/backfill`, `/admin/alerts/test-webhook`.
- [x] Admin dashboard widgets for KPI trend, active SLA breaches, and operational risk cards.
- [ ] Final webhook destination hardening and on-call routing test in staging.

## Product Contracts
- [x] Admin disputes payload alignment.
- [x] Admin commissions payload alignment.
- [x] Contract versions and client error event APIs.
- [ ] Flutter-wide endpoint audit final pass + smoke tests on full app flows.

## Test Gate
- [x] Backend suite passes.
- [x] Admin type-check passes.
- [x] Flutter targeted analyze passes.
- [ ] Full end-to-end launch dress rehearsal.

## M3/M4 Operational Gate
- [ ] Production DB backup created immediately before migration.
- [ ] Production migrations applied and verified via `_prisma_migrations`.
- [ ] Monitoring + SLA alert env vars validated in staging and production.
- [ ] KPI worker running as dedicated process/service (`start:kpi-worker`).
- [ ] Staging webhook destination test passed (`/v1/admin/alerts/test-webhook` with signature headers).
- [ ] Production webhook destination test passed (`/v1/admin/alerts/test-webhook` with signature headers).
- [ ] Rollback plan approved and on-call owner assigned.
- [ ] Limited launch controls applied: one city, selected bakeries, selected drivers, controlled order volume.
- [ ] Hypercare monitoring cadence active for inventory, payouts, disputes, queue lag, and failed orders.

Reference execution runbook:
- `M3_M4_LAUNCH_OPERATIONAL_EXECUTION.md`

## Execution Update (2026-05-17)
- Attempted from local runner environment in `/Users/user/Documents/Khubzati-App`.
- Evidence logs captured under:
  - `/Users/user/Documents/Khubzati-App/launch_evidence/2026-05-17/00_environment_check.log`
  - `/Users/user/Documents/Khubzati-App/launch_evidence/2026-05-17/01_dns_health_probe.log`
  - `/Users/user/Documents/Khubzati-App/launch_evidence/2026-05-17/02_local_validation.log`
- Blockers observed:
  - `staging-api.khubzati.com` DNS resolution failure.
  - `api.khubzati.com` DNS resolution failure.
  - No staging/production `DATABASE_URL` or admin credentials available in this execution environment.
- Result:
  - Local validation checks passed (`prisma validate`, KPI/SLA rehearsal integration test).
  - Staging/production operational gate items remain pending and must be executed from production-capable infra runner or CI/CD cutover job.
