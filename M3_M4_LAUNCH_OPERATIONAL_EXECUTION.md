# M3/M4 Launch Operational Execution (Production Readiness)

This checklist is the operational source of truth for the final launch gate pass.

## 1) Safe Production Migration With Backup

1. Freeze deploys and announce a maintenance window.
2. Create a production backup before migration.

```bash
export DATABASE_URL="<production_postgres_url>"
mkdir -p ./backups
pg_dump --format=custom --no-owner --no-privileges "$DATABASE_URL" > "./backups/khubzati_prod_$(date +%Y%m%d_%H%M%S).dump"
```

3. Validate Prisma migration plan:

```bash
cd /Users/user/Documents/Khubzati-App/Khubzati-backend-apis
npx prisma validate
npx prisma migrate status
```

4. Apply migrations:

```bash
npm run db:migrate
```

5. Verify migration health:

```bash
psql "$DATABASE_URL" -c "SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 10;"
```

## 2) Enable Monitoring + SLA Alerts

Set and verify required environment variables in staging and production:

- `SLA_ALERT_WEBHOOK_URL`
- `SLA_ALERT_WEBHOOK_SECRET`
- `SLA_ALERT_WEBHOOK_MAX_ATTEMPTS` (recommended: `6`)
- `SLA_ALERT_WEBHOOK_RETRY_BASE_SECONDS` (recommended: `30`)
- `ENABLE_KPI_WORKER=true`

Service-level checks:

```bash
curl -fsS https://<api-host>/health
curl -fsS https://<api-host>/ready
curl -fsS https://<api-host>/health/workers
curl -fsS https://<api-host>/health/workers/kpi
curl -fsS https://<api-host>/metrics/queues
```

## 3) Run KPI Worker As Dedicated Process

Run KPI worker as a separate service/process (not inside API process):

```bash
cd /Users/user/Documents/Khubzati-App/Khubzati-backend-apis
npm run start:kpi-worker
```

Deployment note:
- Keep API service and KPI worker in separate runtime units.
- Use restart policy (`always`), independent logs, and independent health monitoring.

## 4) Webhook Destination Verification (Staging -> Production)

1. In staging, set a real receiver URL (Slack bridge, PagerDuty gateway, or internal webhook sink).
2. Trigger a signed test event:

```bash
curl -X POST "https://<api-host>/v1/admin/alerts/test-webhook" \
  -H "Authorization: Bearer <admin_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"eventType":"alerts.test","summary":"Launch gate webhook verification","processNow":true}'
```

3. Confirm receiver got:
- `x-khubzati-signature`
- `x-khubzati-timestamp`
- `x-khubzati-event`

4. Confirm no lingering failed deliveries:

```sql
SELECT status, COUNT(*) FROM sla_alert_deliveries GROUP BY status;
SELECT COUNT(*) AS dead_letters_24h
FROM sla_alert_dead_letters
WHERE failed_at >= NOW() - INTERVAL '24 hours';
```

5. Repeat the exact same test in production after cutover.

## 5) Rollback Plan (Pre-Approved)

Because production Prisma migrations are forward-only, rollback is operational:

1. Stop new deploys and pause non-critical workers.
2. If release is unhealthy, route traffic to previous app version.
3. Restore database from pre-migration backup only if data integrity is compromised and rollback criteria are met.
4. Re-run smoke tests after restore/redeploy.

Restore command template:

```bash
pg_restore --clean --if-exists --no-owner --no-privileges -d "$DATABASE_URL" "./backups/<backup_file>.dump"
```

Rollback trigger criteria:
- sustained `5xx` > agreed threshold for > 10 minutes
- stuck payouts/disputes materially increasing
- inventory integrity breach
- queue lag and failed orders not recovering after mitigation

## 6) Limited First Launch (Controlled Rollout)

Launch with constrained operations:

1. One city only.
2. Selected approved bakeries only.
3. Selected active drivers only.
4. Order volume cap window (manual throttling by operations team if threshold exceeded).

Recommended operational controls:
- keep non-pilot bakeries in `pending_approval`/`rejected` status
- publish products only for pilot bakeries
- schedule driver shifts for pilot drivers/city only
- enforce active dispatch zones/slots only for pilot city

## 7) First 72-Hour Hypercare Monitoring

Monitor every 15 minutes (first 24h), then hourly (next 48h):

- Inventory integrity:
```sql
SELECT MIN(stock_quantity) AS min_stock FROM products;
```

- Payout aging:
```sql
SELECT COUNT(*) AS stuck_payouts
FROM payout_requests
WHERE status IN ('requested','approved')
  AND created_at < NOW() - INTERVAL '24 hours';
```

- Dispute aging:
```sql
SELECT COUNT(*) AS aging_disputes
FROM dispute_cases
WHERE status IN ('open','under_review','vendor_responded')
  AND created_at < NOW() - INTERVAL '48 hours';
```

- Queue lag:
```sql
SELECT status, COUNT(*), MIN(created_at) AS oldest
FROM notification_jobs
GROUP BY status;
```

- Failed orders:
```sql
SELECT status, COUNT(*)
FROM orders
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY status;
```

Also track:
- `/metrics/queues`
- `/health/workers`
- `/health/workers/kpi`
- active SLA breaches from `/v1/admin/alerts/active`

## 8) Go/No-Go Gate

Go only when all are true:

- migrations applied with verified backup
- KPI worker dedicated process running
- webhook test event delivered in staging and production
- no critical active SLA breach at cutover time
- pilot city rollout controls confirmed

