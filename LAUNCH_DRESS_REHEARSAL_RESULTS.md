# LAUNCH_DRESS_REHEARSAL_RESULTS

## Run Date
- 2026-05-15 (Asia/Amman)

## Validation Commands
- `npx prisma validate` -> PASS (with relationMode/index warnings)
- `npm test` (backend full suite) -> FAIL
  - `Test Suites: 8 failed, 12 passed, 20 total`
  - `Tests: 16 failed, 48 passed, 64 total`
- `npm run type-check` (admin) -> PASS
- Admin E2E -> NOT AVAILABLE (no Playwright/Cypress setup)
- `flutter analyze` -> PASS
- `flutter test` -> PASS
- Flutter integration tests -> NOT AVAILABLE (`integration_test/` missing)

## Added/Improved Tests in This Rehearsal
- `Khubzati-backend-apis/__tests__/security.regression.extended.test.js` (expanded)
- `Khubzati-backend-apis/__tests__/kpi.formula.validation.integration.test.js` (new)
- `Khubzati-backend-apis/__tests__/sla.alerts.rehearsal.integration.test.js` (new)

## Key Isolated Suite Results
- PASS: `kpi.formula.validation.integration.test.js`
- PASS: `sla.alerts.rehearsal.integration.test.js`
- FAIL: `security.regression.extended.test.js` (admin empty-credential login bypass)
- FAIL: `marketplace.stress.integration.test.js` (oversell under concurrency)
- PASS (isolated): `payments.test.js`, `driver.delivery.test.js`, `bakery.availability.test.js`

## Full-Suite Failure Pattern
- Multiple suites fail with `P2037 / Too many database connections opened` in full run only.
- Those same suites pass when executed individually, indicating environment/lifecycle/pooling weakness rather than isolated business-path correctness in all cases.

## Go / No-Go
- **Recommendation: NO-GO**
- Reason:
  1. Critical inventory oversell under concurrent ordering.
  2. Critical admin auth fallback bypass with empty credentials.
  3. High operational reliability risk from DB connection exhaustion during broad execution.
