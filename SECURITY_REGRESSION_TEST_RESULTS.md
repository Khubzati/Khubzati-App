# SECURITY_REGRESSION_TEST_RESULTS

## Suites Executed
- `__tests__/security.abuse.test.js` -> PASS
- `__tests__/security.regression.extended.test.js` -> FAIL (1 finding)

## Validated Controls (PASS)
- Invalid JWT rejected on protected endpoints.
- Upload routes require auth.
- Cross-owner upload attempts blocked (`403`).
- Address takeover blocked (foreign user cannot update another user's address).
- Non-admin users denied admin APIs (`403`).
- OTP failed-attempt cap enforced (`429` after threshold).

## Security Failure (CRITICAL)
### Admin empty-credential login succeeds
- Test: `admin login must not succeed with empty credentials`
- Request: `POST /v1/admin/auth/login` with `{}`
- Expected: reject request (`400/401/403`)
- Actual: `200`
- Likely cause:
  - In `/src/routes/admin.js`, admin login uses fallback credentials:
    - `effectiveEmail = email || process.env.ADMIN_EMAIL`
    - `effectivePassword = password || process.env.ADMIN_PASSWORD`
  - Non-production branch can auto-provision/upgrade an admin account and issue JWT.
- Affected file:
  - `Khubzati-backend-apis/src/routes/admin.js`
- Launch impact:
  - **Blocker** for secure release practices; bypass/fallback path violates auth-hardening expectations.

## Recommended Security Fixes
1. Remove fallback credential behavior for request-time auth input.
2. Require explicit email/password in all environments.
3. Move admin bootstrap to a one-time explicit script, not runtime login path.
4. Add regression guard tests for empty/missing credentials and fallback disablement.
