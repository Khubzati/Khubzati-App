# Vendor Gap Report

## Final gap disposition — 2026-07-25

**Launch decision: GO.** All launch-critical gaps recorded in the original report are closed and evidenced. Separate restaurant and bakery lifecycle rehearsals and injected Flutter failure-transport tests passed, with repeat full-suite validation. No launch blocker remains. See `FINAL_VENDOR_LIFECYCLE_EVIDENCE.md`. The gap descriptions below are retained as the pre-fix audit record and are superseded by this disposition.

## Critical launch blockers

### G-01 Production bakery owner application is missing

- Files: `khubzati-app/lib/core/routes/app_router.dart:66-125`; `lib/features/bakery_owner/**`.
- Broken interaction: authenticated bakery owner has no production dashboard/catalog/order shell.
- Expected: role guard selects a bakery owner shell and status gate controls it.
- Current: a production `BakeryOwnerShellRoute` now selects the active shared operational pages and gates pending, rejected, suspended, inactive and approved states. It refreshes `/auth/approval-status` on app resume. Legacy prototypes remain excluded. Remaining work is behavioral page/API coverage and complete lifecycle validation.
- Actor: bakery owner.
- Remaining fix: add mocked behavioral widget tests for page loading/empty/error/401/403 states and exercise product/category/order lifecycles through the production shell.

### G-02 Modifier selections cannot be persisted historically

- Files: `Khubzati-backend-apis/prisma/schema.prisma:386-403`; checkout/product-detail Flutter features.
- Expected: groups/options, validation, price calculation and immutable order snapshots.
- Actual: no modifier models; OrderItem has only product FK, quantity, price, subtotal and instructions.
- Actors: customer and both vendors.
- Fix: additive schema/migration, server calculation, request contract, owner editors and customer selector tests.

### G-03 Order item identity is not historically immutable

- Files: `prisma/schema.prisma:386-403`, `src/routes/orders.js`.
- Expected: item name/image/vendor/modifier snapshots survive product edits/deletion.
- Actual: historical display depends on restricted Product relation; price is snapshotted but identity is not.
- Fix: add snapshot columns/JSON and populate transactionally; migration/backfill and invoice tests.

## High

### G-04 Server cart endpoints are missing

Flutter `cart_service.dart` calls `/v1/customer/cart` but explicitly degrades to local storage when the route is missing. Cart/CartItem Prisma models exist, yet `app.js` mounts no cart router. Mixed-device recovery and server checkout consistency are therefore partial. Implement authenticated cart CRUD and mixed-vendor validation or explicitly adopt/document local-only cart.

### G-05 Public pre-registration upload is security-sensitive

`routes/upload.js:308,438` uses optional authentication to support signup before a user exists. With no file, unauthenticated calls return 400 rather than the security test's expected 401; with a file, ownership cannot be strongly bound. Add a short-lived signed onboarding-upload token, require auth or that token, virus scanning/object storage, and tests.

### G-06 Admin finance/dispute screens lack proven persistence

`admin/src/app/refunds`, `payouts`, `disputes`, and `commissions` have no corresponding repositories in `admin/src/data/repositories`. Backend finance routes/models exist. Wire pages to APIs with admin auth, error handling, audit evidence and mutation tests.

### G-07 Full backend suite is not green

Baseline: 17/24 suites and 98/112 tests pass. `marketplace.flows.integration` creates a pending bakery then attempts a status-gated product mutation; cleanup uses a nonexistent Prisma relation and leaves notifications. Several later suites exhaust PostgreSQL connections because every suite runs an external seed process and open handles remain. Fix test isolation/seed lifecycle and disconnect all clients.

## Medium

### G-08 Approval-status collapses multiple vendors

`auth.js:1082-1208` returns one aggregate status and prioritizes any approved entity. The rejection test uses the seeded owner, who already owns an approved bakery, so the rejected new bakery is hidden. Return a vendor list plus selected/current vendor ID, or enforce one vendor per owner; test with isolated users.

### G-09 Category administration and in-use behavior are under-tested

Owner category routes exist, but no admin moderation page or complete behavioral coverage proves cross-owner denial and in-use deletion semantics for both vendor types.

### G-10 Status vocabulary is duplicated

Prisma enums, `order-status.js`, owner route validation, Flutter labels and admin selectors carry parallel spellings/aliases. Centralize the published contract and add contract tests for every actor.

### G-11 Payout/refund capability has no Flutter owner surface

Backend models/routes exist but neither owner application exposes finance. If finance is required at launch this is High; otherwise explicitly defer.

## Low / deferred non-blocking

- Legacy Sequelize models/migrations and Next Todo API remain in the backend repo but are not mounted by the Express vendor runtime. Quarantine in a separate legacy package after deployment verification.
- Bakery edit-product screen contains a Builder.io TEMP image URL (`edit_product_screen.dart:47`); replace with a packaged placeholder.
- Normalized working-hours and image entities do not exist; current JSON/URL fields can remain if contracts are documented.
- WebSocket/polling status push is absent. Profile/status refresh is acceptable if triggered on app resume and admin-result screens explain refresh behavior.
## Implementation checkpoint — 2026-07-25

Closed backend gaps: modifier/snapshot domain, connection-exhaustion test infrastructure, server cart, signed onboarding authorization, finance pagination/persistence, and ambiguous aggregate approval status. Remaining launch-critical gaps are owner modifier-management UI, full Flutter vendor-context support/behavioral tests, onboarding registration consumption/cleanup, and final separate restaurant/bakery lifecycle proof. Decision remains **NO-GO**.
# 2026-07-25 gap delta

Resolved: explicit multi-vendor selection/propagation, secure restoration and stale recovery, app-resume refresh, onboarding upload consumption/cleanup, cart retry duplication, and dedicated finance authorization/UI coverage.

Still open:

- isolated restaurant lifecycle rehearsal and evidence;
- newly isolated bakery lifecycle rehearsal and evidence;
- transport-injected Flutter simulations for every requested network/error permutation (current additions are executable policy and source-contract regressions).

Validation is green except for the unchanged Flutter analyzer baseline of 21 package/third-party warnings. Decision: **NO-GO**.
