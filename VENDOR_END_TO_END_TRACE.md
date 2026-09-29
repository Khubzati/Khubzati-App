# Khubzati Vendor End-to-End Trace

## Final verified state — 2026-07-25

**Launch decision: GO.** The accepted trace has now been completed by separate isolated restaurant and bakery persisted lifecycle rehearsals plus injected Flutter failure-transport tests. Both vendor types completed approval, selected context, catalog/modifiers, discovery, authenticated cart, authoritative/idempotent checkout, immutable snapshots, owner transitions, driver delivery and final reads; negative ownership/status cases and cleanup passed. `FINAL_VENDOR_LIFECYCLE_EVIDENCE.md` is the final evidence artifact and supersedes earlier NO-GO conclusions retained below as historical checkpoints.

Evidence date: 2026-07-25. This trace is based on registered runtime code, not prior reports. The active server is Express `Khubzati-backend-apis/src/app.js`; it mounts every router under both `/api` and `/v1`. Prisma is the active persistence layer through `src/lib/prisma.js`. The Next `src/app/api/todos` and Sequelize `src/db` trees are legacy/orphaned for vendor flows.

## Active implementation

- Flutter routing now includes `BakeryOwnerShellRoute`, a production role/status boundary around the active shared bakery operations. The legacy bakery presentation prototypes remain unregistered; `bakery_production_regression_test.dart` continues to enforce their exclusion.
- Flutter DI is generated in `lib/core/di/injection.config.dart`. Active consumers use services directly through BLoCs. Duplicate generated registrations at lines 120-132 point at both active and quarantined imports and are technical debt.
- Restaurant owner uses `features/restaurant_owner/**`; the deleted `restaurant_owner.backup.20260422_014957` tree is not active. Removed marketplace/product-detail files are quarantined under `lib/_quarantine`.
- Backend owner routers are `routes/restaurants.js` and `routes/bakery.js`; customer discovery uses `routes/restaurants.js`, `routes/bakeries.js`, and `routes/products.js`; shared ordering uses `routes/orders.js`; delivery uses `routes/driver.js`; admin uses `routes/admin.js`; money uses `routes/payments.js` and `routes/finance.js`.
- Admin pages are App Router pages under `admin/src/app`. `ApiClient.ts` supplies bearer auth; `middleware.ts` checks the session cookie on direct routes. Vendor list/detail/approval/rejection/suspension/reactivation are real. Orders are real. Refund, payout, dispute, commission, and broadcasts pages are largely presentation shells without matching repositories.

## Database shape

Restaurant and Bakery are separate models with duplicated profile/status/owner fields. Product, Category, Order, Review and RecurringOrder contain nullable `bakeryId` and `restaurantId`; business logic must enforce exactly one vendor. `OrderItem` stores price/subtotal but not product name/image/modifier snapshots. No modifier-group or modifier-option model exists. Working hours are JSON/profile fields rather than a normalized model. DeliveryAssignment, PaymentIntent, RefundRequest, PayoutRequest, Notification, AuditLog and UploadAuditLog exist.

| Feature | Vendor Type | Flutter Entry | Repository/API | Backend Route | Prisma Model | Admin Visibility | Status | Evidence | Blocker |
|---|---|---|---|---|---|---|---|---|---|
| Register/login/OTP | Restaurant | signup → OTP → confirmation | `RestaurantAuthService` | `/v1/auth/register`, `/verify-otp`, `/login` | User, Restaurant | pending vendor list/detail | Wired but contract complexity | `auth.js:1390-1657,1920-2267` | No |
| Register/login/OTP | Bakery | shared auth role flow | shared auth client | same auth routes; profile created through `/bakeries` | User, Bakery | pending vendor list/detail | Partially implemented | `auth.js`, `bakeries.js` | Bakery owner router missing |
| Approval refresh | Both | auth BLoC login/profile refresh | `/v1/auth/approval-status` | authenticated status resolver | Restaurant/Bakery | approve/reject actions | Wired, ambiguous for multiple owned vendors | `auth.js:1082-1208,2269-2310` | Conditional |
| Backend vendor gate | Both | UI also hides actions | owner services | middleware/helpers in owner routers | status fields | suspend/activate | Fully wired for tested mutations | `vendor.status_gate.test.js` passes | No |
| Dashboard | Restaurant | `RestaurantOwnerDashboardRoute` | dashboard service | `/v1/restaurant/dashboard*` | Order/Product | analytics summary | Wired | router + service imports | No |
| Dashboard | Bakery | `BakeryOwnerShellRoute` → shared HomePage | bakery dashboard service | `/v1/bakery/dashboard*` | Order/Product | vendor detail only | Production entry wired; lifecycle validation pending | shell route + bakery tests | Conditional |
| Product CRUD/availability | Restaurant | product-management route/BLoC | restaurant product service | `/v1/restaurant/products*` | Product, Category | detail product tab | Fully wired and tested | `restaurant.products.test.js` passes | No |
| Product CRUD/availability | Bakery | legacy prototype only | bakery product service | `/v1/bakery/products*` | Product, Category | detail product tab | Backend wired; production frontend missing | `bakery.js`; prototype exclusion test | Yes |
| Categories | Both | embedded in product screens | owner product services | owner `/categories*` | Category | no category moderation UI | Partially implemented | route declarations and service calls | No admin visibility |
| Modifiers | Both | no proven selector/editor | none | none | none | none | Missing database/backend/frontend | schema has no modifier models | Yes for modifier launch scope |
| Images/documents | Both | signup/product pickers | `/v1/upload/document(s)` | optional auth + ownership resolver | UploadAuditLog, URL fields | document URLs on detail | Wired with security compromise | `upload.js:308,438` | Public pre-registration upload abuse risk |
| Customer discovery | Both | vendor listing/detail | listing/detail services | `/v1/bakeries`, `/v1/restaurants`, `/v1/products` | vendor/Product/Category | vendor/product detail | Wired | active routes and router entries | No |
| Cart | Both | cart BLoC/screen | cart service | service attempts `/v1/customer/cart*` then local fallback | Cart/CartItem models | none | Partially implemented/degraded | `cart_service.dart:234` fallback; no cart route mounted | Yes for server cart |
| Checkout/order creation | Both | checkout → payment/confirmation | checkout/payment services | `/v1/orders`, `/v1/payments*` | Order, OrderItem, PaymentIntent, idempotency key | orders page | Wired; behavioral suite currently fails setup | server recalculates in `orders.js`; stress test passes | Conditional |
| Historical item snapshots | Both | order detail | order response parser | order creation | OrderItem | order detail | Partial | only price/subtotal/product FK | Product name/image/modifiers not snapshotted |
| Vendor order operations | Restaurant | order list/detail | restaurant order service | `/v1/restaurant/orders*` | Order, AuditLog | admin orders | Wired | active route + new detail route | No |
| Vendor order operations | Bakery | TODO/mock prototype | bakery order service | `/v1/bakery/orders*` | Order, AuditLog | admin orders | Backend wired; production UI missing | screen contains explicit TODOs; exclusion test | Yes |
| Driver assignment/lifecycle | Both | driver dashboard | driver service | `/v1/driver/deliveries*` | DeliveryAssignment, Order | admin orders/drivers | Shared and tested | `driver.delivery.test.js` passes | No |
| Notifications | Both | shared notification feature | `/v1/notifications` | notification router/queue | Notification/Job | broadcasts shell | Partially verified | queue suite hit DB connection exhaustion | Conditional |
| Refund/dispute/payout | Both | no owner UI proven | none | `/v1/finance/*` | Refund/Dispute/Payout/FinancialTransaction | pages exist, mostly shells | Missing vendor/admin wiring | finance backend tests pass | Yes if launch scope |
| Audit logs | Both | none | none | admin mutations call audit service | AuditLog | `/audit-logs` page | Backend present; admin visibility added | `auditLogService.js`, admin page | No |

## Lifecycle conclusions

### Restaurant owner

Registration creates User plus Restaurant pending approval. Login is allowed while pending and returns vendor metadata. Admin status changes persist and are enforced server-side on owner mutations. The active router exposes dashboard, products, analytics and orders. Customer orders point to `restaurantId`; shared order creation recalculates product prices and inventory in a transaction. Driver assignment is vendor-neutral.

### Bakery owner

Registration and the bakery owner backend are materially implemented, including catalog, orders and dashboard. The decisive missing link is navigation: bakery owner screens do not appear in the active AutoRoute list. Therefore backend capability does not equal a usable bakery-owner system.

### Shared customer, admin and driver behavior

Customers browse both separate vendor collections and create a shared Order with one nullable vendor key. Mixed-vendor protection is implemented in server order validation, not only the UI. Admin vendor lookup searches both entity types. Driver delivery endpoints consume Order/DeliveryAssignment and work for either vendor type. Admin financial pages do not yet prove mutations through repositories.

## Validation evidence

Baseline backend full run: 17 suites passed, 7 failed; 98 tests passed, 14 failed. Passing vendor-relevant suites include restaurant products, vendor status gate, driver delivery, finance, security abuse, stress/idempotency, banners and admin KPI permission tests. Failures are detailed in `VENDOR_GAP_REPORT.md`.
## Implementation checkpoint — 2026-07-25

The accepted trace remains the source of truth. Production bakery entry/status gating, modifiers and immutable snapshots, authenticated server cart, secured onboarding uploads, persisted admin finance, and explicit multi-vendor approval context have been implemented. Backend validation is green at 28/28 suites and 123/123 tests. Owner modifier-management UI, Flutter vendor selection/context propagation, behavioral client coverage, and both final lifecycle rehearsals remain; launch is **NO-GO**.
# 2026-07-25 continuation note

The accepted trace remains the source of truth. Selected-vendor context and onboarding upload lifecycle gaps described by the prior checkpoint are now implemented and covered. The existing bakery marketplace integration flow remains green in both complete backend runs.

The required newly isolated restaurant and bakery rehearsal records (fixture IDs, calls, transitions, totals, modifier snapshots, selected context, and audit events) are not yet complete. Therefore this trace does **not** authorize launch and the decision remains **NO-GO**.
