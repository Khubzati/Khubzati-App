# SECURITY_REGRESSION_RESULTS

## Test File
- `Khubzati-backend-apis/__tests__/security.regression.extended.test.js`

## Status
- FAIL (1 critical regression)

## Passed Security Checks
- Invalid JWT rejected on protected endpoints.
- Upload endpoints require auth.
- Upload ownership validation blocks cross-owner upload.
- Address takeover blocked.
- Non-admin blocked from admin APIs.
- OTP failed-attempt cap enforced.
- OTP/auth route rate limiting enforced.
- Firebase login missing/invalid token does not authenticate.

## Failed Security Check (Critical)
### Admin empty-credential login succeeds
- Endpoint: `POST /v1/admin/auth/login`
- Input: `{}`
- Expected: reject with 4xx
- Actual: `200`
- Root cause: fallback credential path + non-production auto-bootstrap logic in admin auth route.
- Affected file: `Khubzati-backend-apis/src/routes/admin.js`
- Launch impact: **Blocker**
