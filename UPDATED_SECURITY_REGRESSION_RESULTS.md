# UPDATED_SECURITY_REGRESSION_RESULTS

Date: 2026-05-16

## Command
`npm test -- __tests__/security.regression.extended.test.js --runInBand`

## Result
- Status: **PASS**
- Suites: **1/1**
- Tests: **11/11**

## Security checks covered
- Invalid JWT rejected.
- Upload endpoint requires auth.
- Upload ownership enforced (cross-owner blocked).
- Address takeover blocked.
- Non-admin access to admin APIs blocked.
- OTP failed-attempt cap enforced.
- OTP route rate limit enforced.
- Firebase login fallback does not authenticate invalid/missing token.
- Admin login `{}` rejected.
- Admin login missing email/password rejected.
- Admin login invalid credentials rejected.
- Valid explicit admin credentials accepted.

## Additional full-suite confirmation
- Backend full suite: **20/20 suites pass, 70/70 tests pass**.

## Notes
- Firebase credential warnings in test environment are expected when local Firebase admin secrets are not configured.
