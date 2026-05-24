# UPDATED_PERFORMANCE_STRESS_RESULTS

Date: 2026-05-16

## Command
`npm test -- __tests__/marketplace.stress.integration.test.js --runInBand`

## Result
- Status: **PASS**
- Suites: **1/1**
- Tests: **7/7**

## Stress scenarios validated
1. High-volume concurrent order creation does not oversell inventory.
2. Dispatch assignment race allows only one acceptance.
3. Notification poison-job retries end in dead-letter safely.
4. KPI aggregation handles high-volume snapshot.
5. Duplicate idempotency key does not double reserve inventory.
6. Reservation transaction rollback is atomic when one line-item reserve fails.
7. Cancellation restocks exactly once.

## Before/After blocker metric
- Before fix (QA finding): ~40 successful orders against stock 25.
- After fix: **successes capped at stock (<=25)** under 50 concurrent attempts.

## Integrity outcomes
- Zero negative inventory observed.
- Reserve movement ledger aligns with successful reservations.
- Duplicate idempotency replay returns safe non-reserving response.

## Additional full-suite confirmation
- Backend full suite: **20/20 suites pass, 70/70 tests pass**.

## Note
- Serializable conflict logs (`40001`) appear under stress and are retried/handled; this is expected under concurrent write contention.
