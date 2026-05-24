# PERFORMANCE_STRESS_TEST_RESULTS

## Suites Executed
- `__tests__/marketplace.stress.integration.test.js` -> FAIL (1/4)
- `__tests__/load.smoke.test.js` -> PASS in isolated run

## Stress Scenarios

### 1) Concurrent order creation vs inventory (CRITICAL)
- Scenario: Product stock = 25, send 50 concurrent `POST /v1/orders/create`.
- Expected:
  - success count <= 25
  - stock never negative
- Actual:
  - success count = 40
  - trace shows negative availability values during failures
- Result: **FAILED**
- Launch impact: **Blocker** (financial/inventory inconsistency).

### 2) Dispatch assignment race
- Scenario: two drivers accept same assignment concurrently.
- Expected: one `200`, one `409`.
- Actual: expected behavior observed.
- Result: PASS

### 3) Notification poison job retry/dead-letter
- Scenario: high-volume poison jobs with low maxAttempts.
- Expected: retries then dead-letter migration.
- Actual: dead-letter flow observed.
- Result: PASS

### 4) KPI aggregation high-volume snapshot
- Scenario: aggregate KPI after large order insert set.
- Expected: non-zero KPI daily fact counts and metrics.
- Actual: aggregation successful after timezone-aware date-key alignment.
- Result: PASS

## Additional Reliability Finding (HIGH)
- Full backend suite (`npm test`) fails with `P2037 Too many database connections opened`.
- Individual suites pass, indicating connection lifecycle/exhaustion across broad run.
- Likely structural cause: many modules instantiate `new PrismaClient()` independently instead of consistently using a shared singleton (`src/lib/prisma.js`).

## Recommended Fixes
1. Enforce single Prisma client instance import pattern across routes/services/workers.
2. Add test harness global setup/teardown for Prisma lifecycle.
3. Add DB connection pool guard metrics and alerts in CI and runtime.
