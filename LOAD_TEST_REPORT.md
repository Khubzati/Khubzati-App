# Load Test Report

Date: 2026-05-09
Type: CI-safe deterministic load smoke (in-process)

## Method
- Tooling: Jest + Supertest against in-memory Express app.
- Goal: catch reliability regressions under burst/concurrent request patterns without flaky timing assertions.

## Scenarios Executed
1. Burst health checks
- 40 concurrent `GET /health`
- Expected: no 5xx, all 200

2. Concurrent authenticated actor traffic
- 20 concurrent customer `GET /v1/orders`
- 20 concurrent driver `GET /v1/driver/available-deliveries`
- Expected: no 5xx

3. Concurrency correctness
- Simultaneous driver assignment accept attempts for same order
- Expected: one success, one conflict, single persisted assignment

## Results
- All load-smoke scenarios passed.
- No 5xx responses observed in tested burst/concurrency runs.
- No duplicate assignment persistence under concurrent accept race.

## Evidence
- `__tests__/load.smoke.test.js`
- `__tests__/qa.reliability.test.js`

## Limitations
- This is application-level load smoke, not infrastructure throughput benchmarking.
- Does not measure p95/p99 latency with real network, database isolation levels under high parallelism, or autoscaling behavior.
- Recommended next stage:
  - run k6/Gatling against staging environment,
  - include realistic payment/webhook traffic,
  - include DB/queue metrics and saturation thresholds.

