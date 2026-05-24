# Remaining Risks Report

Date: 2026-05-15

## Open Risks
1. Existing worktree already contains broad unrelated deltas in backend/admin/flutter.
   - Impact: merge and release risk.
   - Action: isolate this roadmap pass in dedicated integration branch and run conflict audit.

2. New schema entities require migration deployment in all environments.
   - Impact: runtime route failures if migration not deployed.
   - Action: enforce migration gate in CI/CD before rollout.

3. Upload auth enforcement may affect pre-auth onboarding flows.
   - Impact: signup UX regression for document-heavy onboarding.
   - Action: verify onboarding sequence in QA; if needed, introduce signed temporary onboarding upload tokens.

4. Idempotency robustness depends on client adoption of `Idempotency-Key`.
   - Impact: duplicate creation risk remains for non-adopting clients under retry storms.
   - Action: enforce key generation in Flutter/admin API clients for order create.

5. Delivery dispatch optimization is foundational, not fully optimized.
   - Impact: assignment latency may miss SLA at scale.
   - Action: add scoring/ranking worker and city-level load testing.

6. KPI daily fact table exists without ETL scheduler.
   - Impact: dashboards not yet fully data-backed.
   - Action: implement nightly aggregation job and backfill procedure.
