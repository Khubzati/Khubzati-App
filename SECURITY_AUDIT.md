# Security Audit

Audit date: 2026-07-25  
Decision impact: **Critical findings overturn GO.**

## Findings

### SEC-01 — High — Suspended or role-changed accounts retain token privileges

- **Risk:** An issued admin token continues authorizing admin routes after account suspension. Non-admin tokens can likewise survive deletion/role change until expiry where a route does not independently reload account state.
- **Evidence:** `Khubzati-backend-apis/src/middleware/auth.js:58-85` verifies JWT signature and trusts embedded `id` and `role`; it performs no user lookup. `src/routes/admin.js:282-286` issues admin tokens for 24 hours. `src/routes/admin.js:1224-1234` suspends by setting `deletedAt`, but every protected admin route relies on the unchanged JWT through `admin.js:318-320`.
- **Recommendation:** Add current-user status/role verification to the authentication boundary or a token-version/session table checked on every privileged request. Revoke all sessions on suspension, password reset and role change. Add a test: issue admin token → suspend/change role directly → protected admin mutation must return 401/403.

### SEC-02 — High — Admin bearer token is exposed to browser JavaScript

- **Risk:** Any admin-origin XSS or compromised third-party script can steal a 24-hour bearer token and use it directly against the API.
- **Evidence:** `admin/src/shared/api/ApiClient.ts:27-35,137-146` stores/reads `admin_token` in localStorage. `admin/src/shared/store/authStore.ts:28-39` additionally copies the token into a non-HttpOnly cookie. No Content-Security-Policy is configured in `admin/next.config.js`.
- **Recommendation:** Use a server-set `HttpOnly; Secure; SameSite=Strict` session cookie/BFF model, short access tokens and rotation. Add a restrictive CSP and eliminate the localStorage bearer token.

### SEC-03 — Medium — Admin middleware accepts an unsigned fabricated rendering session

- **Risk:** Anyone can fabricate a three-part token containing `{role:"admin"}` and future `exp` to bypass the Next middleware page gate. Backend API authorization still prevents data access, so this is not direct privilege escalation, but protected UI and route existence become accessible.
- **Evidence:** `admin/src/shared/auth/session.ts:9-35` explicitly decodes without signature verification; `admin/src/middleware.ts:13-19` relies on that result.
- **Recommendation:** Validate the session server-side using a trusted backend introspection endpoint or signed HttpOnly session controlled by the admin server.

### SEC-04 — High — Finance write operations are replayable/raceable

- **Risk:** Concurrent or repeated requests can create excess refund reservations, excess payouts, and duplicate vendor-ledger/financial-transaction entries.
- **Evidence:** `finance.js:243-269` separates aggregate refund validation from create; `finance.js:758-780` separates available-balance validation from payout creation; `finance.js:860-923` does not validate current payout state and appends records each time.
- **Recommendation:** Use serializable transactions/advisory or row locks, state predicates in atomic updates, idempotency keys, and unique constraints for financial side effects.

### SEC-05 — High — Duplicate Stripe event still creates a duplicate financial transaction

- **Risk:** Normal provider retries corrupt ledger/audit totals and reconciliation exports.
- **Evidence:** `payment-service.js:225-244` detects duplicate `WebhookEvent`, but `payment-service.js:364-380` executes after the transaction regardless of `duplicate`. `financeService.js:99-125` always creates a row. `schema.prisma:634-653` has no unique provider-event constraint. The test at `qa.reliability.test.js:157-180` asserts only `duplicate: true`.
- **Recommendation:** Return immediately for duplicates and write the ledger entry inside the same transaction as the unique webhook insert. Add a database uniqueness key such as provider/event/type and assert row count under parallel replay.

### SEC-06 — Medium — Rate limiting is fail-open and can be per-process

- **Risk:** Redis failure disables protection, and absent Redis each application replica has its own counter. OTP and onboarding/upload abuse scales with replica count.
- **Evidence:** `middleware/rate-limit.js:3-9` falls back to memory; lines 78-81 continue requests when limiter storage errors. `auth.js` also maintains an in-memory fallback map.
- **Recommendation:** Require a shared limiter in production, fail closed for authentication/OTP issuance, trust proxy headers only behind configured proxies, and alert on limiter failure.

### SEC-07 — Medium — Production malware scanning is optional

- **Risk:** Uploaded content is treated as clean when no scanner is configured and is immediately publicly served.
- **Evidence:** `services/malwareScanService.js:4-7` returns `clean: true` when `MALWARE_SCAN_WEBHOOK_URL` is absent. Production startup does not require scanner configuration. `app.js` serves `/uploads` statically.
- **Recommendation:** Fail startup or quarantine uploads until an asynchronous scan completes in production. Store outside the application origin and release only clean objects.

### SEC-08 — Medium — Active content types are served from the API origin

- **Risk:** SVG/PDF uploads can carry active or deceptive content and are publicly reachable.
- **Evidence:** `upload.js:147-155,330-343` accepts SVG and PDF; `app.js` exposes the directory through `express.static`.
- **Recommendation:** Disallow SVG or sanitize/rasterize it; serve documents from an isolated object-storage origin with attachment disposition, nosniff and strict content headers.

### SEC-09 — Medium — Payout-account verification is client-controlled

- **Risk:** A vendor can create its own payout account with `isVerified: true`, undermining the meaning of verification.
- **Evidence:** Non-admin vendors are allowed through `finance.js:1004-1018`; `finance.js:1050` persists `Boolean(req.body?.isVerified)`.
- **Recommendation:** Force vendor-created accounts to unverified; restrict verification changes to audited admin/provider callbacks.

### SEC-10 — Low — Operational queue metrics are public

- **Risk:** Anonymous callers can enumerate queue pressure, failed alert delivery counts and recent KPI execution state.
- **Evidence:** `app.js` exposes `/health/workers`, `/health/workers/kpi` and `/metrics/queues` without authentication.
- **Recommendation:** Keep simple liveness public; protect detailed operational endpoints with network policy or service authentication.

## Positive controls verified

- Helmet and an explicit CORS allowlist are registered before routes.
- Stripe webhook signatures are verified.
- Upload filenames are generated and ownership is checked.
- Passwords use bcrypt; password-reset responses avoid account enumeration.
- Backend admin routes verify JWT signatures and role.
- Vendor ownership/status and cross-role mutation boundaries have executable tests.

