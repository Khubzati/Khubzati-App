# Khubzati KPI Definitions

## Daily Aggregation Source
- Table: `kpi_daily_fact`
- Aggregation cadence: daily, timezone-aware (`KPI_TIMEZONE`, default `Asia/Amman`)
- Dimensions: per city + global row (`city=ALL`)

## KPI Formulas
- Fill rate: `fulfilled_orders / total_orders`
  - Fulfilled statuses: `delivered`, `completed`
- Stockout rate: `stockout_cancellations / total_orders`
  - Stockout reason codes: `stockout`, `out_of_stock`, `inventory_unavailable`, `inventory_shortage`
- Assignment latency (sec): average of `dispatch_jobs.assigned_at - dispatch_jobs.created_at`
- On-time delivery rate: `on_time_deliveries / deliveries_with_eta`
  - On-time when `actual_delivery_time <= estimated_delivery_time`
- Refund ratio: `refunded_amount / order_revenue`
- Payout aging (hours): average age of open payouts (`requested`, `approved`)
- Dispute aging (hours): average age of open disputes (`open`, `under_review`, `vendor_responded`)
- Cancellation rate: `cancelled_orders / total_orders`

## Operational Notes
- KPI aggregation is idempotent by `(metric_date, city)` upsert.
- Backfill re-runs are safe and tracked in `kpi_aggregation_runs`.
- Global KPI row is stored with `city=ALL`.
