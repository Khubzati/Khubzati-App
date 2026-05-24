# Khubzati Dependency Graph (Execution Baseline)

```mermaid
graph TD
  Flutter["Flutter Apps"] --> APIGW["Express API Layer"]
  Admin["Next.js Admin"] --> APIGW
  APIGW --> Auth["Auth + Security Middleware"]
  APIGW --> Orders["Orders + Inventory Services"]
  APIGW --> Finance["Finance + Reconciliation Services"]
  APIGW --> Delivery["Delivery/Dispatch Services"]
  APIGW --> Notify["Notification Queue Services"]
  APIGW --> Contracts["Contract + Client Error APIs"]

  Auth --> PG[("PostgreSQL / Prisma")]
  Orders --> PG
  Finance --> PG
  Delivery --> PG
  Notify --> PG
  Contracts --> PG

  Auth --> Redis[("Redis (rate-limit/queue infra)")]
  Notify --> Redis
  Delivery --> Redis

  Orders --> Payments["Stripe/Noon Payment Services"]
  Auth --> Push["Push/SMS Services"]
  Notify --> Push
```

## High-Coupling Modules
- `src/routes/orders.js` -> inventory, payments, recurring, notifications.
- `src/routes/finance.js` -> refunds, disputes, payouts, reconciliation, ledger.
- `src/routes/auth.js` -> OTP, token issuance, device tokens, login modes.
- `src/routes/admin.js` -> broad operations controls touching vendors/orders.

## Added Operational Domains
- Security event stream: `user_security_events`.
- Upload ownership + audits: `upload_audit_logs`.
- Inventory movement + cancellation reconciliation: `inventory_movements`, `order_cancellation_reasons`, `order_idempotency_keys`.
- Delivery orchestration: `delivery_slots`, `route_zones`, `driver_shifts`, `dispatch_jobs`.
- Finance ops maturity: `payout_accounts`, `vendor_ledger_entries`, `settlement_batches`.
- Scale observability: `kpi_daily_fact`, `notification_dead_letters`, `client_error_events`, `api_contract_versions`.
