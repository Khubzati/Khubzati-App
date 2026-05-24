# BUG_REPORTS_KHUBZATI_QA

## 1) Oversell under concurrent order creation
- Severity: **Critical**
- Launch blocker: **Yes**
- Reproduction:
  1. Create product with `stockQuantity=25`.
  2. Send 50 concurrent `POST /v1/orders/create` with quantity 1 each.
  3. Count successful 201 responses.
- Expected: <=25 successes; stock remains >=0.
- Actual: ~40 successes; negative availability appears in traces.
- Likely root cause:
  - Inventory reservation logic in order creation is not fully race-safe under high concurrency.
- Affected files:
  - `Khubzati-backend-apis/src/routes/orders.js`
  - `Khubzati-backend-apis/__tests__/marketplace.stress.integration.test.js`
- Recommended fix:
  - Add strict row-level locking or SERIALIZABLE-safe reservation strategy with invariant checks and retry semantics.

## 2) Admin auth fallback/bypass with empty credentials
- Severity: **Critical**
- Launch blocker: **Yes**
- Reproduction:
  1. Call `POST /v1/admin/auth/login` with `{}`.
  2. Observe status.
- Expected: reject (4xx).
- Actual: `200` due fallback credential path.
- Likely root cause:
  - Runtime fallback to `process.env.ADMIN_EMAIL` / `process.env.ADMIN_PASSWORD` and auto-bootstrap branch in non-production.
- Affected files:
  - `Khubzati-backend-apis/src/routes/admin.js`
  - `Khubzati-backend-apis/__tests__/security.regression.extended.test.js`
- Recommended fix:
  - Remove fallback auth and require explicit credentials in request for all environments.

## 3) Full-suite DB connection exhaustion (`P2037`)
- Severity: **High**
- Launch blocker: **Potentially** (blocks CI reliability; can impact runtime under process scaling)
- Reproduction:
  1. Run full backend suite `npm test`.
  2. Observe failures in later suites with `Too many database connections opened`.
- Expected: stable suite completion.
- Actual: cross-suite failures despite individual suite pass.
- Likely root cause:
  - Multiple `new PrismaClient()` instantiations across route/service modules causing cumulative connection pressure.
- Affected files (representative):
  - `Khubzati-backend-apis/src/routes/*.js` (many)
  - `Khubzati-backend-apis/src/services/*` using local clients
  - `Khubzati-backend-apis/src/lib/prisma.js` exists but not consistently reused
- Recommended fix:
  - Centralize Prisma client, refactor imports, add global teardown and pool thresholds.

## 4) Missing cart API route in customer flow
- Severity: **Medium**
- Launch blocker: **No** (if intentionally deferred), **Yes for full customer flow parity**
- Reproduction:
  1. Authenticated customer requests `GET /v1/cart`.
  2. Observe `404`.
- Expected: cart retrieval endpoint exists for add-to-cart flow.
- Actual: route not found.
- Affected files:
  - `Khubzati-backend-apis/__tests__/marketplace.flows.integration.test.js`
- Recommended fix:
  - Implement cart domain/API or align product flow documentation if cart is intentionally out of scope.
