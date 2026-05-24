# Finance Architecture

## Scope
Finance domain includes commission, order financial snapshots, refunds, disputes, payouts, reconciliation, and immutable transaction logs.

## Data Model
- `commission_configs`: active global/vendor commission rates (`rate_bps`).
- `order_financial_records`: per-order financial snapshot (gross, commission, vendor net, refunded, payout, platform net).
- `refund_requests`: customer/admin refund lifecycle.
- `dispute_cases` + `dispute_messages`: structured dispute workflow and conversation.
- `payout_requests`: vendor payout lifecycle.
- `financial_transactions`: immutable transaction log for payment/refund/payout/adjustment events.
- `audit_logs`: sensitive action trail.

## Commission Engine
- Default path: active global config.
- Override path: active vendor-specific config by `vendorType + vendorId`.
- Snapshot captured per order through `ensureOrderFinancialRecord`.

## Refund Lifecycle
1. Create: customer/admin -> `pending` (or `approved` when admin-created).
2. Approve/Reject: admin decision.
3. Process: Stripe sync when provider is Stripe, otherwise manual-complete path.
4. Ledger update: append financial transaction and update order financial record refunded/platform amounts.

## Dispute Lifecycle
- `open` -> `vendor_responded` / `under_review` -> `resolved` or `rejected`.
- Customer opens, vendor/admin can respond, admin resolves.

## Payout Lifecycle
- Vendor creates payout request (`requested`).
- Admin approves/rejects.
- Admin marks paid with optional transaction reference.
- Each stage appends `financial_transactions` records.

## Reconciliation
- Compares snapshot fields and reports mismatches.
- Endpoint: `GET /v1/finance/reconciliation`.

## Key APIs
- Commission:
  - `GET /v1/finance/commission-config`
  - `PUT /v1/finance/commission-config/global`
  - `PUT /v1/finance/commission-config/vendors/:vendorType/:vendorId`
- Refunds:
  - `POST /v1/finance/refunds`
  - `GET /v1/finance/refunds`
  - `POST /v1/finance/refunds/:refundId/approve`
  - `POST /v1/finance/refunds/:refundId/reject`
  - `POST /v1/finance/refunds/:refundId/process`
- Disputes:
  - `POST /v1/finance/disputes`
  - `GET /v1/finance/disputes`
  - `POST /v1/finance/disputes/:disputeId/messages`
  - `POST /v1/finance/disputes/:disputeId/resolve`
- Payouts:
  - `POST /v1/finance/payouts/request`
  - `GET /v1/finance/payouts`
  - `POST /v1/finance/payouts/:payoutId/approve`
  - `POST /v1/finance/payouts/:payoutId/reject`
  - `POST /v1/finance/payouts/:payoutId/mark-paid`
- Reporting:
  - `GET /v1/finance/transactions`
  - `GET /v1/finance/audit-logs`
  - `GET /v1/finance/reconciliation`
