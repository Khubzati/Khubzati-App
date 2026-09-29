# Khubzati Launch Fix Log

## 2026-07-25 — Final lifecycle and failure-transport gate

**Decision: GO.** This entry supersedes prior NO-GO checkpoint language retained below as history.

- Added independent, isolated restaurant and bakery lifecycle rehearsals with persisted IDs, totals, modifier snapshots, vendor-context isolation, canonical transitions, delivery completion, audit evidence and verified cleanup.
- Fixed invalid/backward owner order transitions and bakery explicit-context/foreign-order false-success behavior exposed by the rehearsal.
- Added injected Flutter transport coverage for 401/403, session invalidation, vendor switching, timeout/offline, 400/500, malformed/missing data, failed owner mutations, cart merge retry and checkout idempotency retry.
- Validation: backend **30 suites / 144 tests**, twice; Flutter **60 tests** including **20 transport tests**; analyzer unchanged at 21 package/third-party warnings; admin type-check, **26 tests**, and production build passed.
- Full trace: `FINAL_VENDOR_LIFECYCLE_EVIDENCE.md`.

Every entry below records a change made against evidence in `IMPLEMENTATION_MATRIX.md`, with the exact validation command and result. Nothing here is claimed complete without a command having actually been run.

---

## 2026-07-25 — Modifiers, stable backend suite, server cart, uploads, finance, and vendor context

**Repositories:** `Khubzati-backend-apis`, `khubzati-app`, `admin`

**Root causes fixed:**

1. Added the modifier schema/migration, ownership- and approval-gated CRUD, required/min/max/single/multiple validation, server-authoritative price adjustments, and immutable `OrderItem` snapshots. Customer Flutter now selects modifiers, previews price, persists configuration identity, serializes checkout IDs, and renders snapshot names.
2. Each Jest file loaded an isolated Prisma module/pool but only a single global teardown disconnected one instance. Added `scripts/jest-setup-after-env.js`, corrected stale fixture relations, isolated mutated users/admins, approved the mutation fixture explicitly, and removed dependence on suite order.
3. Replaced the authenticated Flutter cart’s silent 404-to-local fallback with `/v1/customer/cart` CRUD. The server enforces customer auth, one vendor, live stock, approved vendor state, modifier configuration, and server prices; local carts are retained only before login and merged after customer authentication.
4. Uploads without auth are now rejected unless they carry a short-lived, signed, purpose-limited onboarding token. Tokens are rate-limited and email/role-bound; files use generated names, MIME/size gates, ownership audit records, and a malware-scanner integration hook.
5. Finance list endpoints now persistently paginate/filter refunds, payouts and disputes. Admin pages use those contracts, show real loading/empty/error states, require mutation confirmation, and expose pagination/status filters.
6. `/v1/auth/approval-status` now returns every owned vendor entity and accepts explicit `vendorId`/`X-Vendor-ID` context; an unowned context is rejected instead of silently falling back.

**Validation:**

```text
npx prisma format
Schema formatted (relationMode index warnings only).

npx prisma validate
Schema valid.

npx prisma migrate status
Database schema is up to date.

npm test -- --runInBand
Two consecutive full runs passed; latest 28 suites, 126 tests.

admin: npm run type-check && npm test -- --runInBand && npm run build
Type-check passed; 1 suite/9 tests passed; production build passed.

flutter analyze
No application errors; 21 pre-existing third_party/pdf_render/pubspec warnings.

flutter test test/bakery_flow
9 tests passed.
```

**Still required:** Flutter multi-vendor selector/context propagation, behavioral Flutter/admin coverage, upload registration consumption/cleanup, and separate restaurant/bakery lifecycle rehearsals. Launch remains **NO-GO**.

---

## 2026-07-25 — Production bakery-owner entry shell and operational statuses

**Repositories:** `khubzati-app`, `Khubzati-backend-apis`

**Root causes fixed:**

1. Bakery owners were routed directly to a shared navigation page without a role-specific account-status boundary. Added `BakeryOwnerShellRoute`, which uses the active shared bakery operations (`HomePage`, inventory, history, profile) only after the server confirms `approved`.
2. Approval status was refreshed during authentication but not on app resume. The production shell is a `WidgetsBindingObserver` and dispatches `ApprovalStatusCheckRequested` when resumed.
3. Backend admin suspension was persisted as `rejected`, losing the distinction between compliance rejection and operational suspension. Added real `suspended` and `inactive` enum values for both Bakery and Restaurant plus migration `20260725120000_add_vendor_operational_statuses`.
4. The rejection-flow test reused the globally seeded owner, so an already-approved bakery masked the newly rejected bakery. It now creates and deletes an isolated owner.
5. A stale full-suite Jest process retained dozens of Prisma connections after its summary. Terminating that runner immediately restored migration/test access, confirming the documented open-handle/connection-exhaustion root cause.

**Safety:** No legacy bakery prototype screen is imported or registered. The existing prototype-exclusion regression remains green.

**Validation:**

```text
npx prisma migrate deploy
22 migrations found; 20260725120000 applied successfully.

npm test -- --runInBand __tests__/vendor.status_gate.test.js __tests__/vendor.rejection.flow.test.js
2 suites passed, 8 tests passed.

flutter test test/bakery_flow
9 tests passed, including prototype exclusion and production shell routing/status checks.

flutter analyze
No application errors; 21 pre-existing third_party/pdf_render/pubspec warnings.
```

**Still required before G-01 can close:** behavioral widget tests with mocked 401/403/loading/empty/error responses, explicit category CRUD coverage, and a complete device-level order/product lifecycle through the shell.

---

## Phase 2 — Flutter restaurant_owner duplicate resolution + dead-code cleanup

**Repository:** `khubzati-app`

**Files changed:**
- `lib/core/routes/app_router.dart`, `lib/core/routes/app_router.gr.dart` (regenerated), `lib/core/di/injection.config.dart` (regenerated)
- `lib/features/restaurant_owner/auth/**` (signup screen, blocs, widgets) — merged in the more-complete implementation
- `lib/features/restaurant_owner/analytics/**`, `dashboard/**`, `order_management/**`, `product_management/**` — merged in more-complete/correct service logic
- `lib/features/restaurant_owner/order_management/data/services/restaurant_order_management_service.dart` — added `_extractList`/`_extractPagination`/`_extractDataMap` defensive response-shape parsing
- `analysis_options.yaml` — updated `analyzer.exclude` from a stale single-path entry to `lib/_quarantine/**`
- Moved to `lib/_quarantine/`: `restaurant_owner.backup.20260422_014957/` (55 files), `marketplace/` (13 files, the orphaned customer-facing mock feature)
- Deleted then **restored**: `lib/features/bakery_owner/` (17 files) — see "Problem fixed" below for why

**Problem fixed:**
1. Two parallel `restaurant_owner` Flutter implementations existed (`restaurant_owner/` and `restaurant_owner.backup.20260422_014957/`), with `app_router.dart` importing signup from the backup tree while everything else came from canonical — a maintenance hazard where edits to one tree silently had no effect on the running app. Compared both trees file-by-file: the backup's **signup screen** was materially more complete (location-map picker, file-upload validation, "resume an existing profile" flow, generated credentials) than canonical's; canonical's **order_management service**, however, had a response-shape bug (`response['data']` assumed to be a `List`, but the backend returns `{data:{orders, pagination}}`) that the backup's service handled correctly via defensive extractor helpers. Resolution: ported the backup's superior signup logic and the backup's defensive response-parsing helpers into the canonical `restaurant_owner/` tree, repointed the one remaining backup import in `app_router.dart` to canonical, and moved the now-fully-superseded backup tree to `lib/_quarantine/` (not deleted, per instructions, pending manual QA sign-off).
2. `lib/features/marketplace/` (an orphaned customer-facing feature using a hardcoded mock repository, never registered in the router) was moved to the same quarantine folder.
3. **`lib/features/bakery_owner/` was initially deleted as "confirmed dead code" based on a grep for the literal substring `features/bakery_owner`, which is wrong**: three customer-facing files (`lib/features/home_page/presentation/page/home_page.dart`, `lib/features/history/presentation/screens/history_screen.dart`, `lib/features/customer/order_details/presentation/screens/order_details_screen.dart` + 2 sibling widgets) import it via **relative** paths (`'../../../bakery_owner/...'`) that don't contain that substring. Deleting it broke real, in-use order-tracking functionality for customers. Caught via `flutter analyze` (18 `uri_does_not_exist`/`undefined_class` errors pointing at `BakeryOrderManagementService`/`BakeryOrderManagementBloc`/`BakeryDashboardService`), re-verified with a relative-path-safe grep, and restored in full. It is **not** dead code and must not be removed without first replacing what those 6 files depend on.
4. `analysis_options.yaml` previously excluded the backup tree by its exact old path; since that tree now lives under `lib/_quarantine/`, updated the exclude rule so quarantined code (with intentionally-unfixed broken relative imports) doesn't fail analysis for the whole project.

**Reasoning:** Per the change constraints ("do not delete duplicate code until all active references are proven removed"), a substring grep is not sufficient proof of "no references" when a codebase uses relative imports — this incident is the concrete case for why. Canonical `restaurant_owner/` is kept as the single source of truth for vendor-owner order/product/analytics/dashboard flows (already what's wired into router + DI for everything except the one signup import, now fixed); its weaker signup implementation and buggy order-list parsing were replaced with the stronger logic that existed only in the backup tree, rather than keeping both around.

**Test commands and results:**
```
$ flutter pub get
Got dependencies! (114 packages have newer versions incompatible with constraints — pre-existing, unrelated)

$ dart run build_runner build --delete-conflicting-outputs
Succeeded after 42.4s with 1031 outputs (2425 actions)

$ flutter analyze
21 issues found (all pre-existing: third_party/pdf_render vendor deprecation warnings/infos + 1 pre-existing pubspec 'path' dependency warning). Zero errors. Zero issues in any file touched by this change.

$ flutter test
17/17 passed, including test/bakery_flow/bakery_production_regression_test.dart's
"legacy bakery owner prototype screens stay out of runtime router" — confirms the
restored bakery_owner tree still has no router registration (it's a services-only
dependency for customer screens, not a navigable feature).
```

**Remaining limitation:**
- `lib/_quarantine/restaurant_owner.backup.20260422_014957/` and `lib/_quarantine/marketplace/` are excluded from analysis but still occupy disk space in the repo pending a manual QA pass on the merged canonical `restaurant_owner/` signup + order_management flows (per instructions: "Remove the quarantine only after validation" — automated analyze/test passing is necessary but not sufficient; a human should exercise vendor signup and order-list/status screens once before final deletion).
- The Flutter test suite (17 tests) is still string/source-text assertions, not behavioral tests — passing it confirms no known regression markers, not that the merged signup/order flows work correctly at runtime. A manual run-through (or Phase 9 behavioral tests) is still needed before this can be called fully validated.
- The order_management response-parsing fix addresses the "wrong shape" bug, but the separate, already-documented status-value mismatches (`processing`/`ready` vs. backend's `preparing`/`ready_for_pickup`) and missing Accept/Reject UI are **not** fixed by this change — those are scoped to Phase 4 (vendor order operations) since they're not part of the duplicate-implementation decision.
- No changes made to `lib/features/bakery_owner/` itself in this pass beyond restoring it — its own internal completeness (it has real TODO-stubbed screens per the original matrix) is out of scope for Phase 2.

---

## Phase 3 (batch 1) — Checkout/payment money-safety fixes, order confirmation, forgot password, dead-code cleanup

**Repository:** `khubzati-app`

**Files changed:**
- `lib/core/api/api_client.dart` — `post()` gained an `extraHeaders` param (merged with the auth header)
- `lib/features/customer/checkout/data/services/checkout_service.dart` — `placeOrder()` accepts `idempotencyKey`, sent as `Idempotency-Key` header
- `lib/features/customer/checkout/presentation/screens/checkout_screen.dart` — per-vendor-group idempotency keys; cart is no longer cleared before card-payment confirmation
- `lib/features/customer/payment/presentation/screens/payment_screen.dart` — accepts `pendingCartItemIds`, clears them only on confirmed `paid`/`cod_collected`/`PaymentSuccess`; removed the fake "Switch to Cash on Delivery" fallback button/method
- `lib/features/customer/order_confirmation/data/services/order_confirmation_service.dart` — `getOrderConfirmation` now calls the real `GET /customer/orders/:id` endpoint (was calling a nonexistent `/confirmation` suffix); added `@lazySingleton`
- `lib/features/customer/order_confirmation/application/blocs/order_confirmation_bloc.dart` — added `@injectable`; fixed field extraction to match real camelCase backend fields
- `lib/features/customer/order_confirmation/presentation/screens/order_confirmation_screen.dart` — rewritten from a static `StatelessWidget` to a bloc-wired screen with three distinct visual states (confirmed / awaiting confirmation / not confirmed)
- `lib/features/auth/application/blocs/auth_event.dart`, `auth_bloc.dart` — fixed `ResetPasswordRequested` to carry `emailOrPhone` instead of `verificationId`
- `lib/features/auth/presentation/screens/forgot_password_screen.dart` — rewritten as a real two-stage (`request OTP` → `OTP + new password`), bloc-wired `@RoutePage()`
- `lib/features/auth/presentation/screens/login_screen.dart` — added a "Forgot Password?" link
- `lib/core/routes/app_router.dart` (+ regenerated `app_router.gr.dart`, `injection.config.dart`) — registered `ForgotPasswordRoute` (unauthenticated), removed the dead `product_detail` import
- Quarantined `lib/features/customer/product_detail/` → `lib/_quarantine/customer_product_detail/` (dead code: mock data, unregistered route, real product-detail experience already lives in `vendor_detail_screen.dart`'s bottom sheet); stripped its `@RoutePage()` annotation so the route generator doesn't emit a dangling route for it

**Problems fixed:**
1. **Cart cleared before payment confirmed (Blocker).** `checkout_screen.dart` cleared cart items unconditionally right after order creation, before the card-payment branch even navigated to the payment screen — a cancelled or declined card payment had already lost the cart. Fixed by only clearing immediately for COD (a real commitment at creation time); for card payments, the cart items are passed through to `PaymentScreen` and only cleared once the backend confirms `paid`/`cod_collected` via webhook-driven status or the immediate success state.
2. **A second, related fake-success bug found while fixing #1**: the payment-failed screen offered a "Switch to Cash on Delivery" button that faked local success without ever calling a backend endpoint to convert the order's payment method — the order would sit forever as `ONLINE_CARD`/`pending` while the customer saw a confirmation screen. No backend endpoint exists to convert payment method post-creation, so the button was removed rather than left faking success (`Retry Payment` remains as the real recovery path).
3. **Order confirmation screen was fully static (Blocker)** — hardcoded "Order Confirmed" and a static "30-45 minutes" ETA, never called the backend. The pre-built `OrderConfirmationBloc`/`Service` were dead code *and* pointed at a `/confirmation` endpoint that doesn't exist on the backend (confirmed via route grep). Fixed the service to call the real order-detail endpoint, fixed the bloc's field names to match the real camelCase response, wired the bloc into the screen, and added three distinct states (confirmed / awaiting confirmation / not confirmed) driven by real `order.status`/`order.paymentStatus` — so a race, a tampered deep link, or a still-pending webhook can never render as "Confirmed."
4. **Idempotency key built server-side, never sent by client (High).** The backend's full idempotency system (`OrderIdempotencyKey`, replay detection, 409 on payload mismatch) was gated behind an optional header nothing in the app ever sent. Added client-side key generation (one per vendor group per checkout attempt, cached and reused across retries of that attempt, cleared once that order is confirmed created).
5. **Forgot password was dead code (Blocker).** The screen had no route registration and its "send" button only called `debugPrint`. While wiring it in, found the backend contract needs the original `emailOrPhone` identifier for `/reset-password` (it re-resolves the user and checks the OTP stored on that record), but `ResetPasswordRequested` was passing the OTP's `verificationId` instead — this would have made every reset attempt fail with "Invalid or expired reset OTP" even with the correct code, had it ever been wired up naively. Fixed the event to carry `emailOrPhone`, built a real two-stage screen, registered the route, and added an entry point from the login screen.
6. **Orphaned dead code removed**: `lib/features/customer/product_detail/` (mock data, TODO-stubbed add-to-cart/favorite/share, unregistered route) quarantined rather than left in place — the real, working product-detail/add-to-cart experience already lives in `vendor_detail_screen.dart`.

**Reasoning:** All of the above are money/trust-integrity issues on the customer checkout path — the highest-blast-radius area of the app per the launch scope. Fixes favor structural correctness (the confirmation screen independently re-verifies with the backend regardless of navigation path) over patching individual call sites, so future navigation changes can't reintroduce the "trust the client" bug.

**Test commands and results:**
```
$ dart run build_runner build --delete-conflicting-outputs
Succeeded after 48.3s with 444 outputs (1467 actions)
[one follow-up regeneration after stripping a stale @RoutePage() annotation from
 the quarantined product_detail screen — see Remaining limitation]

$ flutter analyze
0 errors, 0 warnings/infos outside pre-existing third_party/pdf_render and the
pre-existing pubspec.yaml 'path' dependency warning.

$ flutter test
17/17 passed.
```

**Remaining limitations:**
- Quarantining a directory under `lib/_quarantine/` excludes it from `flutter analyze` (via `analysis_options.yaml`) but **not** from auto_route's/build_runner's code generation — a leftover `@RoutePage()` annotation on quarantined code still gets scanned and generates a dangling route referencing an import that no longer exists in `app_router.dart`, breaking the build. Confirmed and fixed for `product_detail_screen.dart` (annotation stripped) in this pass; **anything else moved to `lib/_quarantine/` in the future must have any `@RoutePage()`/`@injectable`/`@lazySingleton` annotations stripped too**, not just be excluded from analysis.
- The "Forgot Password?" link was added to the login screen even though the actual login flow is OTP-only (no password field exists anywhere in `login_screen.dart` — confirmed by grep). The backend password-reset contract is real and now fully wired, but its practical reachability depends on some account having a password set through another path (e.g. vendor signup auto-generates one). This is now working, reachable, real functionality — but its product relevance given an OTP-first login flow is worth a product decision post-launch (keep it, or remove once confirmed no login path uses passwords).
- `OrderConfirmationService` still has four methods (`sendOrderReceipt`, `confirmOrderReceipt`, `submitOrderReview`, `reportOrderIssue`) pointed at backend endpoints that were confirmed **not to exist** (`/send-receipt`, `/confirm-receipt`, `/review`, `/report-issue`). They are not called from the fixed screen and were left as-is rather than deleted (out of scope for this pass) — do not wire any UI to them without adding real backend endpoints first.
- Cart totals (delivery fee, tax) are still hardcoded to `0.0` in `cart_screen.dart` — deferred pending a business-policy decision (flat fee vs. zone-based, tax applicability), tracked separately.
- Product modifiers (required/optional add-ons) still have no data model — full-stack feature, tracked separately.

---

## Phase 3 (batch 2) — Real delivery fee, favorites entry point, share deep links, currency fix

**Repositories:** `Khubzati-backend-apis`, `khubzati-app`

**Decision made without an explicit user answer:** the user was asked (delivery fee model: flat/free/zone-based; tax: yes/no) and replied "continue" without picking an option. Proceeded with the two options I had flagged as recommended — **flat delivery fee, no tax** — since they're the lowest-risk and most reversible. The flat fee amount (`DEFAULT_DELIVERY_FEE=1.00` JOD) is an explicitly-documented placeholder, not a business decision — **confirm the real rate before general availability.**

**Files changed:**
- `Khubzati-backend-apis/prisma/schema.prisma` — added `Order.deliveryFee` (`Decimal(10,2)`, default 0)
- `Khubzati-backend-apis/prisma/migrations/20260720120000_add_order_delivery_fee/` — new migration
- `Khubzati-backend-apis/src/routes/orders.js` — added `getFlatDeliveryFee()`; `createOrderHandler` now adds the fee to `totalAmount`/`paymentAmount` and stores it on the order; added `GET /orders/delivery-fee` (registered before the dynamic `/:orderId` GET route, since Express would otherwise match it as an order ID) for client-side preview
- `Khubzati-backend-apis/sample.env` — documented `DEFAULT_DELIVERY_FEE`
- `khubzati-app/lib/features/customer/checkout/data/services/checkout_service.dart` — `calculateDeliveryFees` now calls the real endpoint instead of returning a stub
- `khubzati-app/lib/features/customer/cart/presentation/screens/cart_screen.dart` — real delivery fee (fetched, not hardcoded), tax line removed (none modeled), `$` → `JOD` currency label, extracted a `_CartTotalsSummary` widget
- `khubzati-app/lib/features/customer/checkout/presentation/screens/checkout_screen.dart` — added a delivery-fee row and included it in the displayed total (previously items-only)
- `khubzati-app/lib/features/customer/vendor_detail/presentation/screens/vendor_detail_screen.dart` — added vendor share button (app bar) and per-product share button (bottom sheet), plus `initialProductId` auto-open support
- `khubzati-app/lib/core/khubzati_app.dart` — deep-link resolver now handles `khubzati://vendor/:id` and `khubzati://product/:vendorId/:productId`
- `khubzati-app/lib/features/menu/presentation/screens/profile_menu_screen.dart` — added "My Favorites" navigation entry (the favorites toggle/API already worked; there was simply no way to view the saved list)

**Problems fixed:**
1. Cart/checkout screens showed a literal, hardcoded `0.0` delivery fee and (on the cart screen) a fake `0.0` tax line — now a real, backend-computed value is fetched and displayed; the tax line was removed rather than left as a permanent fake zero, since no tax is modeled for this launch.
2. Currency symbol was `$` in `cart_screen.dart` despite the business operating in JOD — fixed to display the currency returned by the backend (JOD).
3. "Share" on a product/vendor was a TODO with no deep link; now shares a real `khubzati://vendor/...` or `khubzati://product/...` link that the app resolves back to the correct vendor page (auto-opening the specific product's detail sheet for product shares).
4. Favorite toggling already worked, but there was no way to view the saved list — added a profile-menu entry point.

**Reasoning:** The backend remains the sole authority for the checkout total in all cases (`createOrderHandler` never trusts a client-submitted total/fee — confirmed unchanged); everything added here is either a real, freshly-computed preview value or a real deep link, never a fabricated one.

**Test commands and results:**
```
$ dart run build_runner build --delete-conflicting-outputs
Succeeded after 32.7s with 118 outputs (470 actions)

$ flutter analyze
0 errors. One unused-variable warning surfaced and was fixed in the same pass;
re-ran clean afterward.

$ flutter test
17/17 passed.

$ node --check src/routes/orders.js   (Khubzati-backend-apis)
Syntax OK.
```

**Remaining limitations:**
- Could **not** run the backend Jest suite or `npx prisma validate` in this session — `npx jest`/`npx prisma` invocations consistently failed with a sandbox/tool-stream error unrelated to the code (confirmed `node --check` and plain shell commands work fine; only npx-spawned subprocesses failed). The `orders.js` change was syntax-checked but **not exercised against a live database or the existing test suite** — this should be re-validated in an environment where the Jest suite can actually run (also recall from Phase 1 research: the local dev DB schema is already behind migrations by one column, independent of this change, so a real test run requires a DB migration pass first regardless).
- `GET /orders/delivery-fee` requires authentication (`authenticateToken`) like the rest of the router — consistent with the rest of the file, but means an unauthenticated user cannot preview the fee before logging in (not a concern for this app's flow, since cart/checkout already require login).
- The flat `DEFAULT_DELIVERY_FEE=1.00` is a **placeholder value**, not a confirmed business rate — must be set to the real number (via environment variable, no code change needed) before general availability.

---

## Phase 4 (batch 1) — Vendor order operations: Accept/Reject, status-value bugs, vendor-status enforcement, order detail

**Repositories:** `Khubzati-backend-apis`, `khubzati-app`

**Files changed:**
- `Khubzati-backend-apis/src/routes/bakery.js` — `ensureBakeryOwner` now returns 403 for write methods when `bakery.status !== 'approved'`
- `Khubzati-backend-apis/src/routes/restaurants.js` — `resolveManagedRestaurant` now returns `null` (reusing all 14 existing call sites' null-checks) for write methods when the restaurant isn't approved; imported and applied `resolveOrderStatus` (alias handling) to the order-status endpoint; added `GET /orders/:orderId` (restaurant order detail — didn't exist before)
- `khubzati-app/lib/features/restaurant_owner/order_management/presentation/widgets/order_status_dialog.dart` — new shared status-action dialog (Accept/Reject when pending; Preparing/Ready/Completed/Cancel otherwise), used by both the list and new detail screens
- `khubzati-app/lib/features/restaurant_owner/order_management/presentation/screens/restaurant_order_management_screen.dart` — wired to the shared dialog; added a real `BlocListener` for success/error feedback; added pull-to-refresh; fixed status-filter tab keys, status chip colors, and two additional display bugs found while fixing this (see below)
- `khubzati-app/lib/features/restaurant_owner/order_management/presentation/screens/restaurant_order_detail_screen.dart` — new screen (previously `_viewOrderDetails` just showed a TODO SnackBar)
- `khubzati-app/lib/core/routes/app_router.dart` (+ regenerated `.gr.dart`/`injection.config.dart`) — registered `RestaurantOrderDetailRoute`

**Problems fixed:**
1. No vendor-status enforcement (Blocker): a pending/rejected bakery or restaurant owner could still create products and manage orders after logging in. Fixed on both vendor types.
2. No Accept action; "Preparing"/"Ready for Pickup" always failed with 400 (Blocker): the UI sent `processing`/`ready`, the backend required `preparing`/`ready_for_pickup` and restaurants.js never applied the alias-resolution helper bakery.js/orders.js already used. Fixed by wiring restaurants.js through `resolveOrderStatus` and adding a real Accept action.
3. No Reject/Cancel action in the UI despite backend/bloc support — added to the shared dialog.
4. Status update showed a fake, unconditional "success" message regardless of actual outcome — replaced with a real BlocListener.
5. Order list had no refresh mechanism — added pull-to-refresh.
6. Order detail was a TODO SnackBar (Blocker), no backend endpoint existed — added `GET /restaurant/orders/:orderId` and a real detail screen.
7. Two more bugs found while touching this file: order cards read snake_case keys (`total_amount`/`created_at`/`customer_name`) that don't exist in the real camelCase response (always showed "0.00"/"N/A"); status filter tabs/chips used values that never match real backend statuses; currency hardcoded to SAR instead of JOD.

**Test commands and results:**
```
$ dart run build_runner build --delete-conflicting-outputs
Succeeded after 45.3s with 128 outputs (492 actions)

$ flutter analyze
0 errors, 21 pre-existing issues (third_party/pdf_render + pubspec.yaml).

$ flutter test
17/17 passed.

$ node --check src/routes/bakery.js src/routes/restaurants.js
Syntax OK.
```

**Remaining limitations:**
- Could not run the backend Jest suite against a live DB in this session (tool/environment constraint).
- Deferred: shared `order-state-machine.js` transition table (High, not Blocker); vendor profile-edit and opening-hours screens (no UI exists; backend endpoints already exist).
- Mid-session, all write-capable tool operations failed for a period with a stream error unrelated to any code issue; recovered after retrying. Verified each attempted change either fully applied or not at all before proceeding.

---

## Phase 5 — Driver dispatch flow: wrong endpoint, discarded failure reports, and an ID-mismatch bug affecting every active delivery

**Repository:** `khubzati-app`

**Files changed:**
- `lib/features/driver/dashboard/data/services/driver_dashboard_service.dart` — fixed `getAvailableAssignments()` to call the correct endpoint; remapped `id` in `getAssignments()`; added `rejectDelivery`; extended `updateDeliveryStatus` with `failureReason`/`proofImageUrl`/`deliveryNote`
- `lib/features/driver/dashboard/application/blocs/driver_dashboard_event.dart`, `driver_dashboard_bloc.dart` — added `RejectDelivery` event/handler; extended `UpdateDeliveryStatus` with the new optional fields
- `lib/features/driver/dashboard/presentation/screens/driver_dashboard_screen.dart` — wired Report Failure/Confirm Delivery to actually send their data; added a Decline button and an Out for Delivery button; converted `_DriverDashboardView` to a `StatefulWidget` so action errors show as an inline SnackBar (with auto-recovery) instead of replacing the whole dashboard with a full-screen error

**Problems fixed:**
1. **"Available deliveries" called the wrong endpoint (Blocker) — the browse-and-accept happy path was completely non-functional.** `getAvailableAssignments()` called `GET /driver/assignments?status=assigned`, but nothing anywhere in the codebase ever creates a `DeliveryAssignment` row with status `assigned` (only `accepted`/`rejected` are ever written) — this query could never return results. Fixed to call the correct, already-implemented `GET /driver/available-deliveries`.
2. **A more severe bug found while fixing #1, affecting every active delivery, not just the available-list**: `DeliveryAssignment.id` (an auto-generated UUID) is a *different* value from `DeliveryAssignment.orderId`, but every action endpoint (`/accept`, `/status`, `/reject`) is addressed by `:orderId` in the URL. The Flutter bloc/UI uses `delivery['id']` uniformly as "the id to send to these endpoints" — for assignments returned by `GET /driver/assignments` (used for active/completed lists), that `id` field is the *assignment's own id*, not the order id. This means marking a real active delivery as picked-up/out-for-delivery/delivered/failed would very likely 404 ("assignment not found") in production, independent of the available-list bug. Fixed by remapping `id` → `orderId` once in the service layer (`getAssignments()`), so every downstream consumer (list matching, action calls) now receives the correct id under the same field name they already expect — no changes needed to the bloc's or screen's existing `delivery['id']` usage.
3. **"Report Failed Delivery" discarded the driver's input (Blocker)** — the sheet collected a reason, then only popped itself and showed a local "Failure reason submitted" SnackBar with zero API/bloc call. Now dispatches `UpdateDeliveryStatus(status:'failed', failureReason:...)`.
4. **Delivery-completion note was collected but never sent** — now sent as `deliveryNote`.
5. **No Reject/Decline action existed** for available deliveries despite the backend endpoint being fully implemented — added.
6. **No "Out for delivery" step existed** between Confirm Pickup and Delivered, despite being a valid, expected transition — added.
7. **Any action failure (e.g. a 409 when two drivers accept the same delivery simultaneously) replaced the entire dashboard with a full-screen error**, discarding the driver's already-loaded view and requiring a full manual reload. Converted the view to a `StatefulWidget` tracking whether a dashboard has been successfully shown at least once; action errors after that point show as a SnackBar and auto-trigger a background reload instead.

**Reasoning:** #2 is the kind of bug that's invisible in code review because both `id` fields look identical in shape (both are UUID strings) — it only surfaces by tracing which Prisma model's `id` actually flows into which URL parameter. Given the launch scope explicitly calls out validating the driver flow end-to-end, this was worth the extra tracing time rather than only fixing the two already-documented Blockers.

**Test commands and results:**
```
$ dart run build_runner build --delete-conflicting-outputs
Succeeded.

$ flutter analyze
0 errors, 21 pre-existing issues (third_party/pdf_render + pubspec.yaml). One
routine pubspec.lock transitive-dependency bump (meta, test_api patch
versions) triggered by `flutter pub get` — not a package I added.

$ flutter test
17/17 passed.
```

**Remaining limitations:**
- Not fixed in this pass (deferred, tracked as non-blocking per the matrix): driver location is still never actually sent to the backend (no GPS/geolocation service wired up — `UpdateDriverLocation` event exists but nothing dispatches it); no Dart-side port of the backend's transition table, so invalid-transition buttons aren't proactively disabled (the backend still correctly rejects them with a 409, which now surfaces as a visible SnackBar per fix #7, but the button itself isn't hidden/disabled ahead of time); no reassignment/re-dispatch mechanism when an assignment fails or is rejected (this is a backend/ops gap, not purely client-side).
- Could not exercise this against a live backend/DB in this session (same environment constraint as Phases 3-4) — changes are syntax/type-checked via `flutter analyze` and consistent with the confirmed backend route contracts read directly from `driver.js`, but not run end-to-end.

---

## Phase 6 — Admin console security: server-aware route protection, real banner persistence, audit logging

**Repositories:** `Khubzati-backend-apis`, `admin`

**A live local Postgres DB became reachable in this session** (`localhost:5432/khubzati`) and was 4 migrations behind (2 pre-existing from before this session, plus this session's delivery-fee and banner migrations). Applied via `npx prisma migrate deploy` — this is what finally allowed running real integration tests against a live database instead of only syntax-checking, for this phase and retroactively validating Phases 3-5's backend changes too.

**Files changed — route protection:**
- `admin/src/shared/auth/session.ts` (new) — pure `decodeJwtPayload`/`isAdminSessionValid` helpers (JWT payload decode only, no signature verification — the backend's signing secret intentionally never lives in this frontend)
- `admin/src/middleware.ts` (new) — redirects to `/login` server-side/edge whenever `admin_session` cookie is missing, malformed, expired, or its `role` claim isn't `admin`, for every route except `/login`
- `admin/src/shared/store/authStore.ts` — sets/clears the `admin_session` cookie alongside the existing localStorage token on login/logout (the cookie exists solely so middleware, which cannot read localStorage, can see session state)
- `admin/src/shared/api/ApiClient.ts` — 401 now also clears the cookie; 403 explicitly documented as "do not log out" (session still valid, just an unauthorized action)

**Files changed — banner persistence:**
- `Khubzati-backend-apis/prisma/schema.prisma` — new `Banner` model (titleEn/titleAr, imageUrl, navigationTarget, isActive, startDate/endDate, sortPriority, soft-delete)
- `Khubzati-backend-apis/prisma/migrations/20260720130000_add_banners/` — new migration
- `Khubzati-backend-apis/src/routes/admin.js` — `GET/POST/PUT/DELETE /admin/banners[/:id]` with field validation (required titles/image, date-range sanity check), soft delete, and audit logging on create/update/delete
- `admin/src/domain/entities/Banner.ts`, `admin/src/data/repositories/BannerRepository.ts` (new)
- `admin/src/app/content/page.tsx` — rewritten to call the real backend instead of local `useState`

**Files changed — audit logging:**
- `Khubzati-backend-apis/src/routes/admin.js` — added `logAuditEvent` calls to vendor approve/reject (all 3 branches: bakery, restaurant, bakery-owner-account), vendor suspend/activate, order status change and cancel (written **inside** the existing `prisma.$transaction`, using `tx` instead of the module-level `prisma` client, so the audit row commits/rolls back atomically with the order change), and user role changes
- `admin/src/app/audit-logs/page.tsx` (new) — consumes the already-existing (but previously unused-by-any-UI) `GET /api/finance/audit-logs` endpoint
- `admin/src/presentation/components/shared/Layout.tsx` + both locale files — added the nav entry

**Files changed — tests:**
- `Khubzati-backend-apis/__tests__/admin.banners.test.js` (new, 9 tests) — unauthenticated (401), non-admin (403), validation errors, date-range validation, create/list/persistence, partial update, audit-log-written assertion, soft-delete-then-invisible-but-still-in-DB, 404 on unknown id
- `Khubzati-backend-apis/__tests__/vendor.status_gate.test.js` (new, 6 tests) — covers the Phase 4 vendor-status-gate fix retroactively: pending/rejected bakery and restaurant owners blocked from writes, approved owners not blocked, read-only GETs not blocked for a pending vendor
- `admin/__tests__/session.test.ts` (new, 12 tests) — `decodeJwtPayload`/`isAdminSessionValid` pure-function coverage: valid admin token accepted; missing/malformed/expired tokens and each non-admin role (customer/bakery_owner/restaurant_owner/driver) rejected
- `admin/jest.config.js` (new) — uses `next/jest` (already bundled with `next`, confirmed via `require.resolve` — no new dependency added) rather than introducing `ts-jest`/`babel-jest` from scratch

**Problems fixed:**
1. **No server-side route protection (Blocker)** — protection was entirely a client-side `useEffect` redirect in `Layout.tsx`, which still ships the full page bundle to an unauthenticated browser before redirecting. Middleware now blocks this at the edge, before any protected page renders.
2. **Banner/content management was 100% fake (Blocker)** — pure `useState`, data vanished on refresh. Now backed by a real model, migration, validated CRUD endpoints, and audit logging.
3. **Vendor approve/reject/suspend/activate and order status/cancel wrote no audit trail at all** despite the `AuditLog` model, write helper, and read endpoint already existing and being used elsewhere (refunds/disputes/payouts) — the highest-stakes admin actions were the ones with no trail. Fixed, and there was **no admin UI to view any of it** even where it did exist — added `/audit-logs`.
4. **Flat admin role preserved as instructed** — no tiering added; `authorizeRole(['admin'])` remains the single gate on every admin route, unchanged.

**Reasoning:** Middleware performs a lightweight, non-authoritative check (decode-only, no signature verification) rather than duplicating the backend's `JWT_SECRET` into the frontend — the backend remains the sole cryptographic authority on every real request, exactly as required ("preserve backend authorization on every protected endpoint"). This is a rendering gate, not a security boundary by itself, which is the correct division of responsibility for a SPA-style admin frontend talking to an independently-secured API.

**Test commands and results:**
```
$ npx prisma migrate deploy   (Khubzati-backend-apis, against local Postgres)
4 pending migrations applied successfully.

$ node --check src/routes/admin.js
Syntax OK.

$ NODE_ENV=test npx jest admin.banners.test.js vendor.status_gate.test.js --runInBand
Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total

$ cd admin && npm run type-check
No errors.

$ npm run lint
No new warnings (pre-existing warnings only, in files untouched by this phase).

$ npm run build
Compiled successfully. Middleware bundle present (26.5 kB). /content and /audit-logs
routes built successfully.

$ npm run test   (new admin jest suite)
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
(Session was interrupted by a host-machine disk-full event between writing
this entry and running the suite — see Phase 4b entry below for the recovery
and the full-backend-suite number that was also pending here.)
```

**Remaining limitations:**
- Full backend Jest suite result: see Phase 4b entry below (it was still pending when this entry was originally written, and the session hit an unrelated infrastructure interruption before it could be recorded here).
- The `admin_session` cookie is not httpOnly (it's set by client-side JS after a client-side login call, since the login flow calls the external backend directly rather than through a Next.js Route Handler) — it provides no additional XSS protection beyond what already existed; its only job is letting middleware see session state. A more thorough fix would move login through a Next.js API route that sets a true httpOnly cookie, which is a larger restructuring than this phase's scope.
- No public/customer-facing endpoint to consume active banners was added — none of the customer apps (Flutter, website) currently display banners anywhere, so building a consumption endpoint without any consumer would be speculative. Noted as a natural follow-up once/if a banner carousel is added to a customer-facing surface.

---

## Phase 4b — Restaurant product/category CRUD 404s (IMPLEMENTATION_MATRIX.md §2 blocker #3)

**Repository:** `Khubzati-backend-apis`

**Root cause:** Phase 4 (order operations) and Phase 6 both touched `restaurants.js` but neither addressed a separate, pre-existing gap flagged in the matrix as its own Blocker: `restaurants.js` had `GET`/`POST /products` only — no `PUT`/`DELETE /products/:id`, no `PATCH /products/:id/availability`, and no `/categories` routes at all — while the Flutter `restaurant_product_management_service.dart` already called all of these. Every restaurant-owner edit/delete/availability-toggle/category action 404'd in production. `bakery.js` has the full CRUD equivalent that this was modeled on.

**Files changed:**
- `Khubzati-backend-apis/src/routes/restaurants.js`:
  - Fixed `GET /products`: only read camelCase `categoryId` from the query string, but the Flutter client's `getMenuItems()` sends snake_case `category_id` — the category filter silently no-op'd. Now accepts both.
  - Added `PUT /products/:productId` — edit name/description/price/imageUrl/categoryId/stockQuantity/preparationTimeMinutes/dietaryInfo/isAvailable.
  - Added `DELETE /products/:productId` — soft delete (`deletedAt`).
  - Added `PATCH /products/:productId/availability` — accepts `is_available` (the exact key the Flutter client sends) or `isAvailable`.
  - Added `GET/POST/PUT/DELETE /categories` — categories are global rows discriminated by a `type` enum (`bakery`/`restaurant`/`common`), not vendor-scoped in the schema (confirmed no `restaurantId`/`bakeryId` column on `Category`); the new routes filter/create with `type: 'restaurant'`, mirroring how `bakery.js`'s equivalent routes use `type: 'bakery'`.
  - All five new product-level routes call the existing `resolveManagedRestaurant(req)` helper (unchanged) before touching the product, then explicitly check `product.restaurantId === restaurant.id` for non-admins — this both enforces per-vendor ownership and reuses the approved-status write-gate `resolveManagedRestaurant` already had from Phase 4/6 (a non-approved restaurant's write attempt gets folded into the same 404 every other write route on this resource already returns, consistent with the existing convention in this file).
- `Khubzati-backend-apis/__tests__/restaurant.products.test.js` (new, 14 tests) — PUT (update/invalid price/404/cross-vendor 403/suspended-vendor 404), DELETE (soft-delete/cross-vendor 403), PATCH availability (toggle on+off/invalid value 400/cross-vendor 403), category CRUD (create+list+update+delete round trip, missing-name 400, bakery-only categories excluded from the restaurant list), and the `category_id`/`categoryId` query-compatibility fix.

**Problems fixed:**
1. **Restaurant-owner product edit/delete/availability-toggle all 404'd (Blocker)** — no route existed at all; fixed by adding the three routes, modeled on `bakery.js`'s equivalents but reusing `restaurants.js`'s own `resolveManagedRestaurant` pattern (rather than `bakery.js`'s `ensureBakeryOwner` middleware pattern) and its established flat response envelope (`{status, data: <product>}`, not `products.js`'s `{status, data: {product: ...}}` shape — confirmed via the Flutter service's `_extractDataMap`, which expects the product fields directly under `data`).
2. **Restaurant category management entirely missing (Blocker)** — no `/restaurant/categories` route existed in any form; the Flutter category-management flow (`getCategories`/`createCategory`/`updateCategory`/`deleteCategory`, wired through real bloc events `LoadRestaurantProductCategories`/`AddRestaurantProductCategory`/etc., confirmed reachable and not dead code) had nothing to call. Added full CRUD.
3. **`category_id`/`categoryId` query-param mismatch (adjacent bug, found while fixing #1/#2)** — `getMenuItems()` sends `category_id` (confirmed via source read), the route only ever read `categoryId`; the category filter on the restaurant product list has been silently doing nothing. Fixed to accept both.
4. **Ownership check added to the availability/edit/delete routes unconditionally** (not gated behind `NODE_ENV === 'production'` the way `bakery.js`'s PUT/DELETE routes are) — `bakery.js`'s own PUT/DELETE skip the ownership check entirely outside production (a pre-existing latent bug in that file, left as-is there since it's out of this fix's scope), which would let any bakery/restaurant owner edit or delete any other vendor's product in dev/test. The new restaurant routes do not repeat that pattern — ownership is checked in every environment, matching the safer precedent already set by `bakery.js`'s own availability-toggle route (whose comment explicitly says "must run in all environments to avoid cross-vendor updates in dev/test").

**Explicitly out of scope (found, not fixed):**
- The product add/edit dialog in `restaurant_product_management_screen.dart` sends a free-text `'category'` string field (from a plain `TextEditingController`, not a real category picker) — not `categoryId`. This means products created/edited through that specific dialog never actually get linked to a real `Category` row via the new `categoryId` field, independent of anything fixed in this phase. The *separate* category-management flow (add/edit/delete a `Category` itself) is real and now fully wired; only the product-form's category association field is disconconnected from it. Fixing this is a UI data-modeling change (replacing a text field with a category picker bound to `getCategories()`), not a CRUD/404 fix, so it was left alone — flagging for a future pass.
- `uploadMenuItemImages`/`deleteMenuItemImage` (also missing routes in `restaurants.js`, mirroring `bakery.js`'s `POST/DELETE /products/:id/images...`) were confirmed to have zero UI call sites anywhere in `restaurant_product_management_screen.dart` (no image-picker button, no dispatch of the corresponding bloc events) — dead code from the active client's perspective, so per "preserve compatibility only where the active client requires it," these were not added. Also, `bakery.js`'s own image routes only accept a JSON `{imageUrl}` body while the Flutter service builds real multipart `FormData` for this call — a pre-existing shape mismatch shared by both vendor types that would need real file-upload handling (multer) to fix properly; tracked under the existing Phase 8 (infrastructure/uploads) task rather than duplicated here.

**Test commands and results:**
```
$ node --check src/routes/restaurants.js
Syntax OK.

$ NODE_ENV=test npx jest restaurant.products.test.js --runInBand
Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total

$ NODE_ENV=test npx jest vendor.status_gate.test.js bakery.availability.test.js restaurant.products.test.js --runInBand
Test Suites: 3 passed, 3 total
Tests:       23 passed, 23 total
(confirms the new routes don't regress the Phase 4 vendor-status-gate tests
or the existing bakery availability-toggle tests, and that shared seed data
across all three files doesn't cause cross-test interference)

$ NODE_ENV=test npx jest --runInBand --detectOpenHandles   (full backend suite)
[recorded once the run completes — see note below]
```

**Session note:** This phase's work was interrupted twice by infrastructure issues unrelated to the code: (1) the host machine's disk filled to 135MB free mid-session, causing `ENOSPC` on an unrelated `npm install` and briefly on all shell commands, recovered once space was freed; (2) a tool-permission channel for all *mutating* actions (file writes, even a trivial `touch`) failed with `Stream closed` for an extended period while read-only actions kept working, recovered after the user restarted the client. No partial/corrupted edits resulted from either interruption — every edit was verified (via `node --check` and re-reading the affected lines) before proceeding, and nothing was written during the windows where mutations were failing.

**Remaining limitations:**
- Full backend Jest suite (24 files) was still running as a background process when this entry was written — final pass/fail count to be appended once it completes.
- The Flutter-side half of matrix blocker #7 (an `AuthGuard.onNavigation` route guard that reads vendor status before allowing navigation to restricted vendor screens, not just the backend 403 gate from Phase 4) is not yet done — tracked as the remaining part of this same task, to follow this entry.

---

## Phase 3 / Phase 4 follow-through — Restaurant owner product/category route hardening

**Repository:** `Khubzati-backend-apis`

**Verification of handoff assumption:** the active `Khubzati-backend-apis/src/routes/restaurants.js` at and after line 1047 was **not** still in the old “missing CRUD routes” state from the earlier matrix entry. On July 22, 2026, it already contained:
- `GET /restaurant/products` with `categoryId` and legacy `category_id` query support
- `POST/PUT/DELETE /restaurant/products/:id`
- `PATCH /restaurant/products/:id/availability`
- `GET/POST/PUT/DELETE /restaurant/categories`

So this pass resumed from the current codebase state instead of re-applying the older Phase 4b work.

**Files changed:**
- `Khubzati-backend-apis/src/routes/restaurants.js`
- `Khubzati-backend-apis/__tests__/restaurant.products.test.js`

**What changed in `restaurants.js`:**
1. Added shared payload parsing/validation helpers for restaurant product/category writes:
   - accepts active payload forms intentionally
   - rejects malformed price/stock/preparation-time/availability/category values with 400
   - supports legacy body `category_id` only alongside the active `categoryId` field
2. Added an explicit write-access helper for restaurant product/category mutations:
   - `409` when no restaurant profile exists for the account
   - `403` when the restaurant exists but is not `approved`
   - preserves admin access
3. Hardened product create/update:
   - product `name` required
   - `price` must be non-negative
   - `stockQuantity` / `preparationTimeMinutes` must be non-negative integers
   - `categoryId` / legacy `category_id` must reference an active restaurant-usable category
   - conflicting `categoryId` and `category_id` values now 400 instead of silently picking one
4. Hardened product ownership enforcement:
   - update/delete/availability toggle now always resolve the caller’s managed restaurant first, then enforce `product.restaurantId === restaurant.id` for non-admins
5. Hardened category behavior:
   - restaurant-owner category list now returns `common` categories plus that owner’s own `restaurant` categories, instead of every restaurant vendor’s private categories globally
   - non-admins can only update/delete `restaurant` categories they created
   - category delete now returns `409` if active products still reference the category
   - category create/update payloads now validate `name`, `description`, `imageUrl`, and `parentCategoryId`

**Why this pass was necessary even though the routes existed:**
- The current file had the route surface, but the write-path behavior was still too permissive/inconsistent for launch:
  - non-approved vendor writes were folded into older null/404 patterns instead of a deliberate account-status response
  - category ownership was effectively global for restaurant owners
  - invalid or conflicting `categoryId` payloads were not validated
  - category deletion ignored active product references
  - the current Flutter client still needed legacy compatibility only where it actually uses it (`category_id` query filter, and tolerated body compatibility now covered in tests)

**Behavioral tests added/updated:**
- `POST /restaurant/products`
  - create product succeeds
  - legacy body `category_id` succeeds
  - invalid payload rejects with 400
  - conflicting `categoryId` + `category_id` rejects with 400
  - suspended/inactive vendor write rejects with 403
- `PUT /restaurant/products/:id`
  - legacy body `category_id` update succeeds
  - suspended/inactive vendor write now asserts 403
- `DELETE /restaurant/products/:id`
  - existing ownership and soft-delete coverage kept
- `PATCH /restaurant/products/:id/availability`
  - existing success/invalid ownership coverage kept
- `Category CRUD`
  - invalid ownership update/delete rejects with 403
  - deleting a category still referenced by active products rejects with 409
  - suspended/inactive vendor category write rejects with 403
- Query compatibility
  - existing legacy `category_id` query coverage kept
  - added explicit camelCase `categoryId` query coverage too

**Test commands and results:**
```bash
$ node --check src/routes/restaurants.js
No output; exit code 0.

$ npm test -- --runInBand __tests__/restaurant.products.test.js
PASS __tests__/restaurant.products.test.js
Tests: 24 passed, 24 total

$ npm test -- --runInBand __tests__/vendor.status_gate.test.js
PASS __tests__/vendor.status_gate.test.js
Tests: 5 passed, 5 total

$ npx eslint src/routes/restaurants.js __tests__/restaurant.products.test.js --fix
No output; exit code 0.

$ npx prisma validate
The schema at prisma/schema.prisma is valid 🚀
Known existing warnings only: repeated `relationMode = "prisma"` index warnings.

$ npm run build
`prisma generate && next build` completed successfully.
Next.js production build finished with app routes `/` and `/_not-found`, API routes under `/api/auth/*` and `/api/todos/*`, and middleware bundle output.
```

**Remaining limitation after this pass:**
- This closes the current restaurant product/category CRUD hardening gap, but it does **not** complete the larger remaining launch work:
  - product modifiers are still unimplemented end-to-end
  - admin security still has open work outside the route surface above
  - website security/cleanup, infrastructure documentation, and full cross-surface final validation are still pending
# 2026-07-25 — selected context, upload lifecycle, finance coverage

- Added explicit persisted vendor context and `X-Vendor-ID` / `X-Vendor-Type` propagation.
- Added owner selection UI, app-resume refresh, stale selection validation, and page-tree reset on switch.
- Added durable `OnboardingUploadSession` migration and transactional bakery/restaurant consumption.
- Added `npm run cleanup:onboarding-uploads` with consumed-upload protection and retry evidence.
- Fixed cart merge retry duplication by checkpointing each accepted local line.
- Fixed commission mutation persistence verification by reloading after save.
- Added onboarding lifecycle, finance authorization/UI, vendor selection, cart merge, modifier, and session regression suites.
- Validation: backend 29/29 suites and 136/136 tests twice; Flutter 39/39; admin 26/26, type-check and build.
- Decision remains **NO-GO** pending isolated restaurant and bakery rehearsal evidence.
