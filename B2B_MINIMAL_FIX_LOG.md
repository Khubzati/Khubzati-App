# B2B Minimal Fix Log

Only runtime-reproduced blockers were changed:

1. `vendor_detail_screen.dart`: parse product prices as either `num` or numeric string in product detail and cart paths.
2. `checkout_screen.dart`: normalize stored Jordanian `962…`, `00962…`, or `0…` phone values to the existing nine-digit local input format.
3. `home_page.dart`: map Bakery `preparing` to the backend-supported `ready_for_pickup` transition and display the existing localized ready label.
4. Existing purchase-history wiring: parse live pagination, provide its Bloc, add the route, and expose the existing screen from Restaurant Profile.
5. `order_details_screen.dart`: use the buyer-scoped order endpoint for Restaurant purchases, retain Bakery identity, show `ready_for_pickup`, and map `completed` to the terminal delivery timeline.
6. `driver_dashboard_service.dart`: retain `picked_up` and `out_for_delivery` assignments in the active list.
7. Existing order-details actions: show localized Confirm Receipt only for a delivered Restaurant purchase and refresh details after success.
8. Backend order status authorization: permit only the purchasing Restaurant user to perform `delivered -> completed`; other Restaurants remain denied.

No new screen, schema change, state-machine change, redesign, or unrelated refactor was introduced. Focused regressions were added for Driver active-state retention, receipt-action eligibility, and backend receipt authorization.

Validation:

- `flutter analyze`: PASS, no issues.
- `flutter test`: PASS, 67 tests.
- Backend affected suites: PASS, 4 suites / 14 tests (`driver.delivery`, `bakery.availability`, `modifiers.order-snapshots`, `order.receipt-authorization`).
