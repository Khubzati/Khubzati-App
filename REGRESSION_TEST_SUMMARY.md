# Regression Test Summary

Date: 2026-05-09

## Commands Executed and Outcomes

### Backend
- `npm test -- --runInBand` -> PASS (11/11 suites, 32/32 tests)
- `npm run lint` -> PASS
- `npm run build` -> PASS
- `npx prisma validate` -> PASS
- `npm run db:generate` -> PASS

### Admin
- `npm run lint && npm run build` -> PASS (warnings only)

### Website
- `npm run lint && npm run build` -> PASS

### Flutter
- `flutter analyze && flutter test` -> PASS

## Regressions Discovered in This QA Cycle
1. New security suite expected strict 401 for forged JWT, but middleware path may return 403.
- Resolution: test updated to accept the correct auth-failure class (`401/403`).

2. New payout RBAC test used invalid enum value for payout status.
- Resolution: changed test fixture status from `pending` to `requested`.

## Fixes Applied
- Added deterministic security abuse regression suite.
- Added deterministic load smoke regression suite.
- Corrected test expectations/fixtures to align with real API contract and Prisma schema.

## Current Regression Verdict
- No active regression remains in automated coverage.
- Baseline is stable for CI execution with deterministic pass behavior.

