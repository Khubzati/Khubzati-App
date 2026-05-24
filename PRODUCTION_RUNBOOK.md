# Production Runbook

## Pre-Deploy Checklist
- Backend: `npm run lint && npm test && npm run build`
- Prisma: `npx prisma validate && npm run db:generate`
- Admin: `npm run lint && npm run build`
- Website: `npm run lint && npm run build`
- Flutter: `flutter analyze && flutter test`

## Deployment Steps
1. Deploy backend app image/code.
2. Run `npm run db:migrate` against production database.
3. Verify health probes:
   - `GET /health`
   - `GET /ready`
4. Validate payment webhooks and notification job processing.
5. Verify admin finance endpoints for refunds/payouts/disputes.

## Post-Deploy Validation
- Create a test order (sandbox flow).
- Confirm order financial snapshot exists.
- Trigger notification job and confirm sent status.
- Validate refund request -> approve -> process lifecycle.

## Incident Playbook
- Payment mismatch: use `/v1/finance/reconciliation` and `/v1/finance/transactions`.
- Notification delays: process queue via `/v1/notifications/jobs/process` and inspect failures.
- Delivery failures: inspect `/v1/driver/assignments` and assignment failure reasons.

## Launch-Gate Operations Reference
- For M3/M4 go-live execution (backup-first migration, dedicated KPI worker, webhook verification, rollback, limited rollout, and hypercare monitoring), follow:
  - `M3_M4_LAUNCH_OPERATIONAL_EXECUTION.md`
