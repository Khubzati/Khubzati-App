# KPI_FORMULA_VALIDATION_RESULTS

## Test File
- `Khubzati-backend-apis/__tests__/kpi.formula.validation.integration.test.js`

## Status
- Isolated run: PASS

## Formula Validation (from KPI_DEFINITIONS.md)
Validated against persisted `kpi_daily_fact` rows:
- `fill_rate = fulfilled_orders / total_orders` -> PASS (`3/4 = 0.75`)
- `stockout_rate = stockout_cancellations / total_orders` -> PASS (`1/4 = 0.25`)
- `assignment_latency_sec = avg(assigned_at - created_at)` -> PASS (`avg(120,300)=210`)
- `on_time_delivery_rate = on_time_deliveries / deliveries_with_eta` -> PASS (`2/3`)
- `refund_ratio = refunded_amount / order_revenue` -> PASS (`25/250 = 0.1`)
- `payout_aging_hours = avg age(requested/approved payouts)` -> PASS (`20h`)
- `dispute_aging_hours = avg age(open/under_review/vendor_responded disputes)` -> PASS (`36h`)
- `cancellation_rate = cancelled_orders / total_orders` -> PASS (`1/4 = 0.25`)

## Row/Dimension Validation
- Global row `city=ALL` exists -> PASS
- City rows (`Amman`, `Zarqa`) exist -> PASS
- Rerun/backfill idempotency -> PASS
  - same-date non-force rerun skipped safely
  - force rerun upsert preserved metric correctness

## Note
- In full suite, this test can fail secondarily from DB connection exhaustion (`P2037`) when run after many suites.
