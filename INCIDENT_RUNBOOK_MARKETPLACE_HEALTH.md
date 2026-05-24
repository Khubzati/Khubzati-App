# Incident Runbook: Marketplace Health

## Scope
Covers incident handling for:
- queue lag
- stuck payouts
- aging disputes

## 1) Queue Lag Incident
### Detection
- `/health/workers`
- `/metrics/queues`
- Active alert: `queue_lag`

### Immediate Actions
1. Verify DB/Redis health and API saturation.
2. Check pending notification jobs and oldest `created_at`.
3. Scale worker process count if pending growth persists.
4. Trigger manual processing only if backlog is stable.

### Recovery Validation
- Pending queue trend decreases.
- `queue_lag` alert resolves.

## 2) Stuck Payout Incident
### Detection
- Active alert: `stuck_payouts`
- High count of `payout_requests` in `requested/approved`.

### Immediate Actions
1. Check payout account verification coverage.
2. Inspect failed settlement paths and admin actions.
3. Review recent payout transitions/audit logs.
4. Run manual finance reconciliation export for impacted period.

### Recovery Validation
- Aging payouts drop under threshold.
- `stuck_payouts` alert resolves.

## 3) Aging Dispute Incident
### Detection
- Active alert: `aging_disputes`
- `dispute_cases` open age crossing SLA.

### Immediate Actions
1. Identify oldest open disputes by vendor/city.
2. Rebalance dispute triage workload among admins.
3. Prioritize high-value or repeat-customer disputes.
4. Communicate ETA to affected parties.

### Recovery Validation
- Open aging band decreases.
- `aging_disputes` alert resolves.

## Escalation Matrix
- P1: customer-impacting queue outage or payout freeze > 24h
- P2: SLA breaches rising with partial processing
- P3: transient spikes that self-recover

## Postmortem Checklist
1. Root cause
2. Time to detect
3. Time to recover
4. Alert quality assessment
5. Preventive actions and owners
