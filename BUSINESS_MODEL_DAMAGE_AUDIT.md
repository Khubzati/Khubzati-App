# Business-Model Damage Audit

Date: 2026-07-26  
Decision: **BUSINESS FLOW STILL INCORRECT — NO-GO**

## Executive result

The immediately preceding Flutter validation did change code according to the incorrect symmetric-seller assumption. That limited damage has been restored with targeted patches. It affected six Flutter source files, one newly added test, seven generated documents, and isolated runtime data. It did **not** change backend source, Prisma schema, admin source, migrations, or committed history.

The repository is nevertheless not B2B-correct. Git history proves that the symmetric Customer -> Restaurant/Bakery seller model already existed before the immediately preceding prompt. Historical `HEAD` already contained Restaurant-owned products, Restaurant seller order routes, Customer-owned carts/orders, and owner status transitions for either Bakery or Restaurant. Therefore restoring only the last prompt cannot make the overall business flow correct.

## Evidence

- Root and all three nested repositories have no staged changes and no commit created by the incorrect validation.
- Historical backend `HEAD` already defines `Product.restaurantId`, `Product.bakeryId`, `Cart.userId`, `Order.userId`, `Order.restaurantId`, and `Order.bakeryId`.
- Historical `src/routes/orders.js` accepts either `bakeryId` or `restaurantId`, writes `userId = req.user.id`, notifies vendors of an order “from a customer,” and authorizes Restaurant Owner as a seller.
- Historical `src/routes/restaurants.js` already exposes Restaurant dashboard, seller product CRUD, seller orders, and seller status transitions.
- Runtime on the isolated actor proved `POST /v1/restaurant/products` returned 201 and persisted a Restaurant-owned product. That isolated product was subsequently deleted.
- Tracked Flutter `RestaurantOwnerHomeRoute` is a buyer-oriented screen that browses Bakeries. The incorrect validation temporarily redirected Restaurant owners to `RestaurantOwnerDashboardRoute`, a seller dashboard; that redirect was reverted.
- `__tests__/isolated.vendor.lifecycle.rehearsal.test.js` parameterizes Restaurant and Bakery as symmetric vendors and executes a Customer checkout against each.
- `__tests__/restaurant.products.test.js` explicitly protects Restaurant seller catalog behavior.

## Schema, migration, and data result

- No migration was created or edited during the incorrect validation.
- No Prisma schema edit was made during it.
- Applied migrations `20260725130000_add_modifiers_and_order_snapshots` and `20260726010000_launch_blocker_invariants` predate the validation. The latter enforces exactly one Bakery-or-Restaurant product owner and therefore encodes the pre-existing symmetric vendor model. It is already applied; it must not be silently edited.
- A future B2B correction requires a new forward migration after buyer/supplier cardinality is designed.
- Cleanup removed 2 isolated users, 1 Restaurant, 1 Bakery, 1 Restaurant-owned product, 3 notifications, and 3 audit logs. Remaining isolated-user count: 0.

## Safely preserved

Financial atomicity/idempotency, JWT/session invalidation, authorization hardening, database invariants, driver security, analyzer/build fixes, onboarding uploads, and unrelated admin work were untouched. The active dirty worktree was not reset.

## Restored from the immediately preceding prompt

- Restaurant login/OTP/splash routing was returned to `RestaurantOwnerHomeRoute`.
- The temporary Restaurant seller-dashboard API endpoint rewrites were removed.
- The temporary product-dialog controller workaround was removed.
- The temporary vendor-owner route test was removed.
- Seven documents that described Restaurant and Bakery as parallel sellers were removed.
- All isolated runtime data from that validation was cleaned.

## Still requiring correction

The backend data model, checkout, seller routes, status machine, and tests still support Customer -> Restaurant sales. These pre-existing behaviors conflict with the authoritative Bakery supplier -> Restaurant buyer model. No product rewrite was attempted in this audit.
