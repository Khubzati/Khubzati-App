# B2B Runtime Failures

## R1 — Product bottom sheet numeric cast

- Actor/screen: Restaurant, Bakery product card on existing vendor-detail screen.
- Action: tap `Fresh QA bread`.
- API: `GET /products/b52c1ac2-2f23-43f0-a6b6-ccbb1d51986d` returned 200.
- Actual: `type 'String' is not a subtype of type 'num?'` at `vendor_detail_screen.dart:202`; bottom sheet did not open. The same unsafe cast then reproduced at line 96 on Add to Cart.
- Expected: product details and cart action open.
- Root cause/classification: API-contract issue; price may arrive as a numeric string.
- Resolution: fixed and rerun; details and cart both passed.

## R2 — Checkout phone prefill

- Actor/screen: Restaurant, existing Checkout screen.
- Action: submit with profile-populated phone.
- Actual: profile value `962791112233` was inserted into a nine-digit local-number widget; UI returned `Invalid Mobile Number` before order creation.
- Expected: local field displays `791112233`.
- Root cause/classification: UI state/API-contract normalization issue.
- Resolution: fixed and rerun; order creation passed.

## R3 — Invalid Bakery fulfillment transition

- Actor/screen: Bakery, Preparing queue.
- Action: tap `Complete Order`.
- API: `PUT /bakery/orders/3557da9c-1798-4b8b-9bb7-fe43a2af1321/status`, body `{status: completed}`.
- Response: HTTP 409, `Cannot transition order from preparing to completed`.
- Database: remained `preparing`.
- Expected: Bakery hands the delivery order to pickup using the production state machine.
- Root cause/classification: incorrect order status.
- Resolution: existing action now sends `ready_for_pickup`, is labelled `Ready for pickup`, and returns to Current. Rerun passed; DB persisted `ready_for_pickup`.

## R4 — Restaurant post-ready purchase history was unreachable/incompatible

- Reproduction: the Restaurant `Daily` tab contained recurring orders only; the existing purchase-history screen was not routed, and its parser expected the obsolete flat response instead of live `{data: {orders, pagination}}`.
- Runtime effect: order `3557da9c-1798-4b8b-9bb7-fe43a2af1321` could not be opened from the buyer shell after `ready_for_pickup`.
- Resolution: wired the existing screen into Profile, mapped the live response, and routed Details to the existing `OrderDetailsRoute`. Rerun through Flutter showed the exact order, Bakery, product, quantity, JOD 2.50 item price, JOD 3.50 total, address, and localized status.

## R5 — Restaurant buyer details used the seller endpoint

- Reproduction: opening the B2B purchase attempted `GET /restaurant/orders/:id`, which is the Restaurant seller path, and failed for this Bakery-supplied order.
- Resolution: Restaurant buyers now load the order with `GET /customer/orders/:id`. Rerun returned HTTP 200 and rendered the correct details.

## R6 — Picked-up assignment disappeared from Driver dashboard

- Reproduction: after `POST /driver/deliveries/:id/pickup` succeeded, dashboard reload requested only `accepted` assignments, so the `picked_up` assignment disappeared and the next Driver action was unreachable.
- Resolution: the active-assignment filter now retains `accepted`, `picked_up`, and `out_for_delivery`. After hot restart the same job returned as Active Now; Driver then executed out-for-delivery and delivered successfully.

## R7 — No executable Restaurant receipt confirmation

- Reproduction: after Driver delivery, the real order-details screen exposed only `Print Receipt`; the order remained `delivered`. The first added confirmation call returned HTTP 403 because B2B purchases identify the Restaurant buyer by `orders.user_id` while the authorization path checked only `restaurant_id`.
- Resolution: added a localized Confirm Receipt action to the existing details screen and narrowly authorized only `restaurant_owner + order.user_id match + next status completed`. Rerun returned HTTP 200, refreshed the screen, emitted the completed notification, and PostgreSQL persisted `completed` with the Restaurant user as `updated_by`.

## Observations not fixed

- Bakery logout cleared credentials; hot restart returned to account-type selection. The first observed delayed redirect was not a persistence/access failure.
- Device Preview produced RenderFlex overflow diagnostics. They did not prevent the proven B2B actions and were not changed because this task forbids unrelated aesthetic work.
- Address creation was seeded through the authenticated real address API after simulator text automation proved unreliable; address selection and checkout were then completed through Flutter UI.
- A Driver attempt to skip directly from `picked_up` to `delivered` returned HTTP 409 as designed; executing the supported intermediate out-for-delivery action succeeded.
