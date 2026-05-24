# BUG_REPORTS_LAUNCH_BLOCKERS

## 1) CRITICAL: Concurrent order oversell
- Area: Ordering/Inventory
- Repro:
  1. Product stock=25
  2. Fire 50 concurrent `POST /v1/orders/create`
  3. Count successful responses
- Expected: <=25 successes, never negative stock
- Actual: ~40 successes; negative stock observed in logs
- Likely root cause:
  - reservation race not fully enforced under high concurrency
- Affected files:
  - `Khubzati-backend-apis/src/routes/orders.js`
  - `Khubzati-backend-apis/__tests__/marketplace.stress.integration.test.js`
- Launch impact: **Blocker**
- Recommended fix:
  - harden reservation with stronger locking/isolation and invariant checks at commit boundary

## 2) CRITICAL: Admin auth fallback bypass
- Area: Security/Admin Auth
- Repro:
  1. `POST /v1/admin/auth/login` with `{}`
- Expected: reject (4xx)
- Actual: `200`
- Likely root cause:
  - fallback to env credentials + auto-provisioning in route
- Affected file:
  - `Khubzati-backend-apis/src/routes/admin.js`
- Launch impact: **Blocker**
- Recommended fix:
  - remove runtime fallback auth path and enforce explicit request credentials in all environments

## 3) HIGH: DB connection exhaustion across full-suite workload
- Area: Platform reliability / DevOps / test gate
- Repro:
  1. Run backend full suite `npm test`
  2. Observe multiple suites fail with `P2037` / `Too many database connections opened`
- Actual impact:
  - many flow suites fail with 500 due DB connection starvation
  - isolated runs pass, indicating lifecycle/pooling issue
- Likely root cause:
  - many independent `new PrismaClient()` instances across routes/services increase connection pressure
- Affected (representative):
  - `Khubzati-backend-apis/src/routes/*.js`
  - `Khubzati-backend-apis/src/services/*`
- Launch impact: **High risk** (operational stability + CI signal degradation)
- Recommended fix:
  - enforce singleton Prisma client usage, add connection pool controls and teardown discipline

## 4) MEDIUM: Admin/Flutter UI E2E harness gaps
- Area: Release confidence
- Findings:
  - no Playwright/Cypress admin UI E2E setup detected
  - no Flutter `integration_test/` setup detected
- Impact:
  - reduced confidence in real UI workflow/state rendering under production scenarios
- Recommended fix:
  - add minimal smoke E2E harnesses for admin and mobile critical paths
