# PERFORMANCE_STRESS_RESULTS

## Stress Suites
- `Khubzati-backend-apis/__tests__/marketplace.stress.integration.test.js` -> FAIL
- `Khubzati-backend-apis/__tests__/load.smoke.test.js` -> PASS (isolated)

## Critical Stress Failure
### Oversell under concurrent order creation
- Scenario: stock=25, 50 concurrent create-order requests.
- Expected: <=25 successful orders.
- Actual: 40+ successful orders and negative availability traces.
- Impact: financial/inventory inconsistency.
- Severity: **Critical** (launch blocker)

## Other Stress Signals
- Dispatch assignment race lock -> PASS
- Notification retry/dead-letter pressure -> PASS
- KPI high-volume aggregation snapshot -> PASS

## Platform Reliability Risk (High)
- Full backend suite repeatedly shows `Too many database connections opened` (`P2037`), causing cascading false negatives and instability.
- Indicates connection lifecycle/pooling weakness under broad workload.
