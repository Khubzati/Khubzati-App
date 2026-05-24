# Admin Operations Guide

## Daily Operations
1. Review pending vendors/users/drivers.
2. Monitor active orders and failed/cancelled trends.
3. Triage new disputes and refund requests.
4. Review payout queue and approve/reject/settle.
5. Process notification jobs and inspect failures.
6. Check reconciliation report for mismatches.

## Finance Console APIs
- Refund queues: `GET /v1/finance/refunds`
- Dispute queues: `GET /v1/finance/disputes`
- Payout queues: `GET /v1/finance/payouts`
- Transactions: `GET /v1/finance/transactions`
- Reconciliation: `GET /v1/finance/reconciliation`
- Audit logs: `GET /v1/finance/audit-logs`

## Notification Operations
- Enqueue jobs: `POST /v1/notifications/jobs`
- Process jobs: `POST /v1/notifications/jobs/process`
- Monitor jobs: `GET /v1/notifications/jobs`

## Escalation Triggers
- Reconciliation mismatch count increases week-over-week.
- Notification job failures spike or remain stuck in pending.
- Refund process errors for provider-backed refunds.
- Delivery failures by vendor/driver exceed baseline.
