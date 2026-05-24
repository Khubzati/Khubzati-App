# E2E_TEST_RESULTS

## Run Timestamp
- 2026-05-15 (Asia/Amman)

## New/Updated Test Files in This Pass
- `Khubzati-backend-apis/__tests__/marketplace.flows.integration.test.js`
- `Khubzati-backend-apis/__tests__/marketplace.kpi.alert.queue.integration.test.js`
- `Khubzati-backend-apis/__tests__/marketplace.stress.integration.test.js`
- `Khubzati-backend-apis/__tests__/security.regression.extended.test.js`

## Command Results

### Backend Targeted Flow Suites
- `npm test -- __tests__/marketplace.flows.integration.test.js --runInBand` -> PASS (5/5)
- `npm test -- __tests__/marketplace.kpi.alert.queue.integration.test.js --runInBand` -> PASS (2/2)
- `npm test -- __tests__/marketplace.stress.integration.test.js --runInBand` -> FAIL (1/4 failing)
- `npm test -- __tests__/security.regression.extended.test.js --runInBand` -> FAIL (1/6 failing)

### Backend Full Suite
- `npm test` -> FAIL
- Summary: `Test Suites: 8 failed, 10 passed, 18 total` / `Tests: 16 failed, 42 passed, 58 total`
- Key observation: several failures in full run are caused by `P2037 Too many database connections opened`; those same suites pass when executed individually.

### Isolation Checks (to differentiate root causes)
- `npm test -- __tests__/notifications.queue.test.js --runInBand` -> PASS
- `npm test -- __tests__/payments.test.js --runInBand` -> PASS
- `npm test -- __tests__/driver.delivery.test.js --runInBand` -> PASS
- `npm test -- __tests__/load.smoke.test.js --runInBand` -> PASS
- `npm test -- __tests__/qa.reliability.test.js --runInBand` -> PASS
- `npm test -- __tests__/bakery.availability.test.js --runInBand` -> PASS

## Key Failing Steps (True Defects)
1. Stress order concurrency:
- Step: 50 concurrent `POST /v1/orders/create` against product stock 25.
- Expected: max 25 successful orders.
- Actual: 40 successful orders; inventory observed below zero in error traces.
- Impact: oversell under load.

2. Admin auth fallback bypass:
- Step: `POST /v1/admin/auth/login` with empty body `{}`.
- Expected: non-200 rejection.
- Actual: 200 success in non-production path.
- Impact: insecure fallback behavior and auth integrity risk.

## E2E Conclusion
- Marketplace functional breadth is well-covered and many critical flows pass.
- Launch is currently blocked by two critical defects and one high reliability issue (DB connection exhaustion in full runs).
