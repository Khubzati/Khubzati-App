# Final Vendor Lifecycle Evidence

Evidence date: 2026-07-25  
Decision supported: **GO**  
Executable source: `Khubzati-backend-apis/__tests__/isolated.vendor.lifecycle.rehearsal.test.js`  
Flutter transport source: `khubzati-app/test/transport/launch_failure_transport_test.dart` and `khubzati-app/test/transport/modifier_manager_transport_widget_test.dart`

The two lifecycle rehearsals use isolated records and real registered Express routes with Prisma persistence. The detailed IDs below are trace identifiers from a successful full validation run; the final consecutive run produced restaurant vendor/order/assignment IDs `32291e28-3acd-4dbe-983c-a9eebaf77c9d` / `b0648fcd-f4b0-4d24-aff5-03f261f9f214` / `30eda627-6b80-44ca-9009-0dcac1039706` and bakery IDs `4a2c8be0-859c-4dc3-bea4-d40e891d89ab` / `e63e29b6-bc51-499a-bb03-d1bd37f69eb5` / `8272d2ff-5ee8-4b15-b147-71c7fb20af41`. The fixture records were deliberately removed by test cleanup after all persisted assertions completed.

## Exercised request paths and snapshot values

- Shared: `GET /v1/auth/approval-status`, `PUT /v1/admin/vendors/:id/approve`, `GET /v1/products/:id/modifier-groups`, `POST /v1/customer/cart/items`, `GET /v1/customer/cart`, `POST /v1/orders`, `GET /v1/orders/:id`, `GET /v1/admin/orders/:id`, `GET /v1/driver/available-deliveries`, `POST /v1/driver/assignments/:orderId/accept`, and `POST /v1/driver/assignments/:orderId/status`.
- Restaurant owner: `/v1/restaurants`, `/v1/restaurant/categories`, `/v1/restaurant/products`, and `/v1/restaurants/orders/:id/status`.
- Bakery owner: `/v1/bakeries`, `/v1/bakery/categories`, `/v1/bakery/products`, and `/v1/bakery/orders/:id/status`.
- Each isolated test also creates a second approved same-type vendor/product and verifies `POST /v1/customer/cart/items` returns 409 for a mixed-vendor cart.
- Immutable values: product name `<vendor-type> immutable product`, image `/uploads/<vendor-type>-original.png`, selected groups `Required size` and `Optional extras`, selected options `Large` (+2.00) and `Premium topping` (+1.50), vendor ID/type, unit snapshot 13.50, and item-total snapshot 27.00. These remain unchanged after the live name/image/option price is altered and archived.

## Restaurant lifecycle

| Step | Actor | Request or Flutter Action | Expected Result | Actual Result | Persisted Evidence | Test Reference | Status |
|---|---|---|---|---|---|---|---|
| 1 | Restaurant owner | Register isolated owner/vendor | Pending vendor is created | Vendor `8ba97c2b-a9be-4326-9b00-cc8b4938de68` created pending | Owner `2f5af3bf-5859-4149-9130-6c577fc9561e` owns vendor | lifecycle: registration | Pass |
| 2 | Admin | Approve vendor | Vendor becomes approved and audit is written | Approval succeeded | Audit `fab2920f-3e3e-4633-a056-c517f55e1e08` | lifecycle: approval | Pass |
| 3 | Owner | Refresh approval status with explicit vendor context | Selected context is the approved restaurant | Context returned restaurant/vendor ID exactly | Selected context persisted/resolved to trace vendor | lifecycle: selected context | Pass |
| 4 | Owner | Create category, product, required and optional modifier groups/options | All catalog records are vendor-scoped | Catalog and modifiers created | Category `69eab577-b6f3-4bac-9a95-5fde2abf43d5`; product `a263aa02-d020-412f-90a4-a253039f1547`; groups `7572a81f-a9ef-49cf-a005-8cefcabfbc71`, `af2e77e3-87f0-4c39-8852-96038ebe7344`; options `ef73aefc-c81b-4d6f-b43a-e3bf3613d847`, `9bd4ba95-46e4-4c7c-8bec-e097a995995d` | lifecycle: catalog/modifiers | Pass |
| 5 | Customer | Discover vendor/product | Only approved live catalog is returned | Vendor/product discoverable | Returned IDs matched created records | lifecycle: discovery | Pass |
| 6 | Customer | Add configured item to authenticated cart | Server validates modifiers and prices | Valid configuration accepted; missing required option rejected | Cart retained server-calculated configuration | lifecycle: cart validation | Pass |
| 7 | Customer | Create order twice with one idempotency key and forged client price | One order; authoritative total | One order created and replay returned same order | Order `9458fdb8-6906-4de2-9b4e-dcdfe831d5da`; base 10.00 + modifiers 3.50 = 13.50 × 2 = 27.00 + delivery 1.00 = **28.00** | lifecycle: checkout/idempotency | Pass |
| 8 | System | Persist immutable item snapshot | Historical identity/modifiers survive live edits | Snapshot stored before mutations | Product and option names/prices captured on OrderItem | lifecycle: snapshot | Pass |
| 9 | Owner/security actors | Read/mutate using correct, wrong, foreign and cross-role contexts | Only matching owner/context succeeds | Wrong context, other owner and cross-role mutations rejected | Ownership checks resolved against persisted vendor/product | lifecycle: isolation negatives | Pass |
| 10 | Owner | Advance order | Only forward canonical transitions accepted | `confirmed → preparing → ready_for_pickup`; invalid/backward transition rejected | Order status persisted after each transition | lifecycle: owner transitions | Pass |
| 11 | Driver | List, accept and deliver | Eligible order assigned only once and reaches delivered | Accepted assignment and advanced `picked_up → out_for_delivery → delivered` | Assignment `668a22e3-04ae-4bc8-886c-422b36b09908`; final order delivered | lifecycle: driver delivery | Pass |
| 12 | Customer/admin | Read final order | Both see delivered state and same totals/snapshots | Final reads matched | Persisted order, assignment, totals and snapshots matched | lifecycle: final visibility | Pass |
| 13 | Owner | Mutate live product and option | Historical order remains unchanged | Snapshot remained intact | `snapshotPreserved: true` | lifecycle: historical immutability | Pass |
| 14 | Admin/owner | Suspend vendor, then attempt mutation | Suspended vendor mutation is rejected | Mutation rejected by status gate | Suspended account state persisted during assertion | lifecycle: suspension | Pass |
| 15 | Test harness | Cleanup isolated records | No rehearsal fixtures remain | Cleanup completed | `cleanupRunsInAfterAll: true` | lifecycle: cleanup | Pass |

## Bakery lifecycle

| Step | Actor | Request or Flutter Action | Expected Result | Actual Result | Persisted Evidence | Test Reference | Status |
|---|---|---|---|---|---|---|---|
| 1 | Bakery owner | Register isolated owner/vendor | Pending vendor is created | Vendor `62b39a5a-4d2c-49d1-977d-b0a2916c4f2d` created pending | Owner `a3ac7553-ec9c-41c9-98ce-053f17d3e45c` owns vendor | lifecycle: registration | Pass |
| 2 | Admin | Approve vendor | Vendor becomes approved and audit is written | Approval succeeded | Audit `1433b537-ba3a-4c55-a490-1829a4bd2372` | lifecycle: approval | Pass |
| 3 | Owner | Refresh approval status with explicit vendor context | Selected context is the approved bakery | Context returned bakery/vendor ID exactly | Selected context persisted/resolved to trace vendor | lifecycle: selected context | Pass |
| 4 | Owner | Create category, product, required and optional modifier groups/options | All catalog records are vendor-scoped | Catalog and modifiers created | Category `da7d9e78-122f-4c3c-882c-0b53818b8519`; product `01ef337b-5235-480c-b3b5-bb911f44f5fc`; groups `4068e5fc-63d8-4799-8b31-c2e899cefa50`, `774bd70b-4ad0-4c1d-922d-818200269fb1`; options `9fecb9a2-5f62-445b-9f90-f2d79d36174f`, `68a445d5-7327-471e-836f-787272ae3382` | lifecycle: catalog/modifiers | Pass |
| 5 | Customer | Discover vendor/product | Only approved live catalog is returned | Vendor/product discoverable | Returned IDs matched created records | lifecycle: discovery | Pass |
| 6 | Customer | Add configured item to authenticated cart | Server validates modifiers and prices | Valid configuration accepted; missing required option rejected | Cart retained server-calculated configuration | lifecycle: cart validation | Pass |
| 7 | Customer | Create order twice with one idempotency key and forged client price | One order; authoritative total | One order created and replay returned same order | Order `09e904c1-aa9a-4c48-a2a5-63b4e0b0a394`; base 10.00 + modifiers 3.50 = 13.50 × 2 = 27.00 + delivery 1.00 = **28.00** | lifecycle: checkout/idempotency | Pass |
| 8 | System | Persist immutable item snapshot | Historical identity/modifiers survive live edits | Snapshot stored before mutations | Product and option names/prices captured on OrderItem | lifecycle: snapshot | Pass |
| 9 | Owner/security actors | Read/mutate using correct, wrong, foreign and cross-role contexts | Only matching owner/context succeeds | Wrong context, other owner and cross-role mutations rejected; foreign order read returns 404 | Ownership checks resolved against persisted bakery/product | lifecycle: isolation negatives | Pass |
| 10 | Owner | Advance order | Only forward canonical transitions accepted | `confirmed → preparing → ready_for_pickup`; invalid/backward transition rejected | Order status persisted after each transition | lifecycle: owner transitions | Pass |
| 11 | Driver | List, accept and deliver | Eligible order assigned only once and reaches delivered | Accepted assignment and advanced `picked_up → out_for_delivery → delivered` | Assignment `89c0c2ea-c5e6-4d6c-95ed-ff6d3264b615`; final order delivered | lifecycle: driver delivery | Pass |
| 12 | Customer/admin | Read final order | Both see delivered state and same totals/snapshots | Final reads matched | Persisted order, assignment, totals and snapshots matched | lifecycle: final visibility | Pass |
| 13 | Owner | Mutate live product and option | Historical order remains unchanged | Snapshot remained intact | `snapshotPreserved: true` | lifecycle: historical immutability | Pass |
| 14 | Admin/owner | Suspend vendor, then attempt mutation | Suspended vendor mutation is rejected | Mutation rejected by status gate | Suspended account state persisted during assertion | lifecycle: suspension | Pass |
| 15 | Test harness | Cleanup isolated records | No rehearsal fixtures remain | Cleanup completed | `cleanupRunsInAfterAll: true` | lifecycle: cleanup | Pass |

## Flutter failure-transport evidence

The Flutter tests use an injected Dio `HttpClientAdapter`, real services/BLoCs, secure-storage state and widgets. They prove 401 session invalidation and credential/vendor-context clearing; 403 wrong-context, suspended and cross-role denial without false success; timeout/offline, 400/500, malformed JSON and missing-data recovery; cancellation of a late old-vendor response after switching context; failed product/availability/modifier mutations with visible recoverable UI; retry-safe cart merge; and checkout retry with the same idempotency key and retained cart.

## Final validation

- Backend full suite, consecutive runs: **30 suites / 144 tests passed** each.
- Isolated lifecycle rehearsal: **8 tests passed**, restaurant and bakery evidence emitted and cleanup completed.
- Flutter full suite: **60 tests passed**, including **20 injected-transport tests**.
- Flutter analyzer: accepted unchanged baseline of **21 package/third-party warnings**, with no new application-code findings.
- Admin: type-check passed, **26 tests passed**, production build passed.
- Backend lint/build and Dart formatting passed.

Both independent gates—isolated persisted lifecycle proof and injected Flutter failure-transport proof—are satisfied. Final launch decision: **GO**.
