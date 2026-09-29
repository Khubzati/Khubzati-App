# Wrong-Model Change Matrix

## Changes introduced by the immediately preceding incorrect validation

| File | Change summary | Wrong model? | Keep / Revert / Rewrite | Reason |
|---|---|---:|---|---|
| `khubzati-app/lib/core/routes/auth_route_resolver.dart` | Restaurant was redirected from bakery-browsing home to seller dashboard | Yes | Revert — done | Restaurant is the buyer |
| `khubzati-app/lib/features/auth/presentation/screens/otp_verification_screen.dart` | OTP success redirected Restaurant to seller dashboard | Yes | Revert — done | Restored buyer shell |
| `khubzati-app/lib/features/auth/presentation/screens/login_screen.dart` | Login success redirected Restaurant to seller dashboard | Yes | Revert — done | Restored buyer shell |
| `khubzati-app/lib/core/splash.dart` | Session restoration redirected Restaurant to seller dashboard | Yes | Revert — done | Restored buyer shell |
| `khubzati-app/lib/features/restaurant_owner/dashboard/data/services/restaurant_dashboard_service.dart` | Connected seller metrics/orders endpoints | Yes | Revert — done | Seller dashboard is not Restaurant core flow |
| `khubzati-app/lib/features/restaurant_owner/product_management/presentation/screens/restaurant_product_management_screen.dart` | Patched seller product dialog lifecycle | Yes | Revert — done | Fix was only for an invalid Restaurant seller journey |
| `khubzati-app/test/auth/vendor_owner_route_resolver_test.dart` | Required Restaurant seller dashboard | Yes | Revert — done | Asserted wrong destination |
| `RESTAURANT_END_TO_END_EVIDENCE.md` | Described Restaurant seller lifecycle | Yes | Revert — done | Incorrect audit evidence |
| `BAKERY_END_TO_END_EVIDENCE.md` | Presented Bakery as parallel to Restaurant seller | Yes | Revert — done | Incorrect comparison frame |
| `RESTAURANT_BAKERY_API_CONTRACT_MATRIX.md` | Declared symmetric seller contracts | Yes | Revert — done | Incorrect actor relationship |
| `RESTAURANT_BAKERY_STATE_MACHINE.md` | Shared vendor seller state machine | Yes | Revert — done | Buyer and supplier responsibilities differ |
| `RESTAURANT_BAKERY_AUTHORIZATION_MATRIX.md` | Symmetric vendor authorization | Yes | Revert — done | Wrong ownership model |
| `RESTAURANT_BAKERY_GAP_REPORT.md` | Evaluated parallel seller gaps | Yes | Revert — done | Wrong target architecture |
| `FINAL_VENDOR_FLOW_DECISION.md` | Issued decision for parallel sellers | Yes | Revert/rewrite — done | Replaced by this B2B audit set |

## Pre-existing changed/worktree areas classified by domain

| Files/domain | Change summary | Related to wrong model? | Keep / Revert / Rewrite | Reason |
|---|---|---:|---|---|
| Backend finance routes/services/tests and payment migrations | Atomic finance, payout, refund, payment work | No | KEEP | Business-model independent |
| Auth middleware/routes, revocation tests, Flutter interceptor/session service | Session and role revocation | No | KEEP | Security invariant |
| Launch-blocker invariant migration: cart uniqueness/idempotency columns | One active cart and financial keys | Partly | KEEP infrastructure; REWRITE ownership later | Valid invariants, wrong cart actor remains |
| Launch-blocker invariant migration: product Bakery-or-Restaurant owner check | Symmetric seller ownership | Yes | REWRITE via new migration | Already applied; do not edit history |
| `prisma/schema.prisma` Product/Cart/Order relations | Restaurant or Bakery seller; generic User buyer | Yes | REWRITE | Needs explicit Restaurant buyer/Bakery supplier semantics |
| `src/routes/restaurants.js` seller products/categories/orders/dashboard | Restaurant seller APIs | Yes | REVERT/REWRITE after product design | Conflicts with B2B core |
| `src/routes/orders.js`, cart and checkout routes | Customer-owned order to either vendor | Yes | REWRITE | Must become Restaurant purchase from Bakery |
| Bakery catalog/order routes | Supplier catalog and fulfillment | Mostly no | KEEP then adapt order buyer checks | Matches supplier role |
| Driver assignment/delivery security | Delivery state and assigned-driver authorization | Partly | KEEP infrastructure; REWRITE pickup/destination | Must explicitly use Bakery pickup and Restaurant destination |
| Flutter Restaurant marketplace/home/favorites | Restaurant browses Bakeries/products | No | KEEP | Matches intended buyer experience |
| Flutter Restaurant dashboard/product/order management | Restaurant seller tools | Yes | REVERT/REWRITE | Not part of B2B buyer core |
| Flutter Bakery owner shell/catalog/orders | Supplier operations | No | KEEP | Matches intended supplier role |
| Flutter Customer cart/checkout screens used by Restaurant home | Actor naming/ownership ambiguity | Yes | REWRITE | Purchasing UI can be reused under Restaurant role |
| Admin Bakery/Restaurant approval | Approves both business actors | No | KEEP | Both roles require approval |
| Admin seller controls/labels treating both as vendors | Symmetric seller presentation | Yes | REWRITE | Must display supplier vs buyer |
| `__tests__/restaurant.products.test.js` | Protects Restaurant seller catalog | Yes | REVERT/REWRITE | Encodes prohibited behavior |
| `__tests__/isolated.vendor.lifecycle.rehearsal.test.js` | Customer orders from Restaurant and Bakery symmetrically | Yes | REWRITE | Wrong end-to-end contract |
| Modifier/snapshot tests and migration | Immutable order item pricing/snapshots | Partly | KEEP infrastructure | Rebind snapshots to Bakery supplier products |
| `.next/**` build outputs | Generated local artifacts | No conclusion | KEEP untouched | Pre-existing dirty output; unrelated |
| Existing security/finance/release documentation | Audit evidence | No | KEEP | Previously validated work |
| Existing vendor lifecycle/matrix documentation | Often describes symmetric sellers | Yes | REWRITE | Documentation damage predates last prompt |

No staged file or recent commit was attributable to the incorrect validation.
