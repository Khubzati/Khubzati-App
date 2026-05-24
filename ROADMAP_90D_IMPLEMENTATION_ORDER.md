# Khubzati Sprint Implementation Order (Executed)

## Dependency-First Order
1. Security primitives and schema foundations
2. Auth and upload hardening
3. Order consistency and idempotency
4. Contract alignment (admin + Flutter)
5. Delivery orchestration entities/APIs
6. Finance ops extensions and exports
7. Queue/dead-letter observability
8. Validation and regression tests

## Milestone Alignment
- M1 Security/Integrity Freeze (target: 2026-05-31): on track with implemented hardening.
- M2 Workflow Reliability Beta (target: 2026-06-28): foundation in place via idempotency + reconciliation.
- M3 Multi-city + Finance Ops RC (target: 2026-07-26): base entities/APIs added, optimization pending.
- M4 Launch Gate (target: 2026-08-11): requires stress/failover drills and production data backfill.

## Priority Matrix
- Critical:
  - Auth fallback removal
  - Upload auth/ownership enforcement
  - Idempotent order creation
  - Cancellation inventory reconciliation
- High:
  - Admin/API contract alignment
  - Queue dead-letter + metrics
  - Payout account and settlement foundations
- Medium:
  - Delivery slots/zones/shifts/dispatch API maturity
  - Client error event adoption
  - KPI daily fact ETL jobs
- Low:
  - UI polish follow-ups
  - Additional finance dashboard slicing
