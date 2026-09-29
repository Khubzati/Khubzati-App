# B2B Flutter Runtime Evidence

## Isolated actors

- Restaurant user `5d7ea6cc-74a0-440a-ad4b-f1a4fef76f45`; Restaurant vendor `e382d590-6ce2-438e-846f-251dcfa983cd`.
- Bakery user `8329e038-ca13-4876-acc7-4240079b4798`; Bakery vendor `8593a2d9-fdab-49c0-9bdd-324cf4cabebd`.

## Executed evidence

- Bakery OTP login reached supplier shell (Home, Inventory, Order History, Profile).
- Bakery created available `Fresh QA bread`, price JOD 2.50, stock 20. DB product `b52c1ac2-2f23-43f0-a6b6-ccbb1d51986d` has Bakery ID, null Restaurant ID, and `is_available=true`.
- Restaurant OTP login reached buyer shell (Bakery search, Cart, Daily, Favorites, Profile), not supplier inventory UI.
- Restaurant searched the isolated Bakery, opened its product, added quantity 1, and opened cart.
- Checkout grouped the line under `b2b_ui_1785021644290 bakery`; COD total was JOD 3.50.
- Flutter confirmation showed order `3557da9c-1798-4b8b-9bb7-fe43a2af1321` and the isolated Bakery.
- PostgreSQL proves `user_id` is the Restaurant owner, `bakery_id` is the isolated Bakery, `restaurant_id` is null, total is 3.50, and delivery address is isolated address `a38b438e-a5cc-4006-a896-1a28526e0fd9`.
- Bakery OTP login showed the same order in Current with Restaurant delivery address and quantity 1.
- Bakery UI moved it to `preparing`, then after the narrow fix to `ready_for_pickup`; PostgreSQL records Bakery owner as `updated_by`.

## Post-ready Restaurant evidence

- Entry: Profile → Order History → Details (`OrderHistoryRoute` → `OrderDetailsRoute`).
- Requests: `GET /v1/customer/orders?page=1&limit=10` and `GET /v1/customer/orders/3557da9c-1798-4b8b-9bb7-fe43a2af1321`, both HTTP 200.
- At ready state, Flutter showed the exact ID, Bakery `b2b_ui_1785021644290 bakery`, `Fresh QA bread`, quantity 1, JOD 2.50, JOD 3.50, `B2B Test Street 1, Amman, Jordan`, and localized Ready for pickup.
- Refresh, close/reopen, and hot-restart restoration retained the same order.

## Driver execution

- Driver user `8e0c8e6c-3fec-4bbb-8d2d-4ad60080a155`; driver profile `4ebad0ae-08c7-4abc-926e-9003c17e99ce`.
- OTP login reached the Driver dashboard, not a customer or vendor shell.
- Available delivery displayed pickup `B2B Runtime Street` (persisted Bakery address) and destination `B2B Test Street 1` (order delivery-address ID `a38b438e-a5cc-4006-a896-1a28526e0fd9`).
- Accept persisted assignment `accepted`; Confirm Pickup persisted order `out_for_delivery`, assignment `picked_up`, and `picked_up_at=2026-07-26 00:08:45.911`.
- After the active-filter fix, hot restart restored the picked-up job. Out for Delivery persisted assignment `out_for_delivery`; Confirm Delivery persisted order/assignment `delivered` and `delivered_at=2026-07-26 00:12:09.436`.

## Receipt, final history, and cold start

- Restaurant reopened the same order and Flutter visibly showed Delivered with the unchanged fields.
- Confirm Receipt called `PUT /v1/customer/orders/3557da9c-1798-4b8b-9bb7-fe43a2af1321/status`, body `{status: completed}`. Post-fix response was HTTP 200.
- PostgreSQL persisted `completed`, buyer `user_id=5d7ea6cc-74a0-440a-ad4b-f1a4fef76f45`, Bakery `8593a2d9-fdab-49c0-9bdd-324cf4cabebd`, snapshot `Fresh QA bread`, quantity 1, price/subtotal 2.50, total 3.50.
- A full Flutter process restart restored the Restaurant session and Order History visibly showed `Status: Completed` for the exact order.
- Bakery OTP login showed no current orders, `Completed Orders 1 / 1`, and Previous contained the exact completed order, JOD 3.50, and the Restaurant address. Details retained the buyer name, product, quantity, item price, and total.

## Authorization isolation responses

| Negative request | Result |
| --- | --- |
| Other Restaurant reads target order | HTTP 404, `Order not found` |
| Other Restaurant completes target order | HTTP 403, `You do not have permission to update this order` |
| Restaurant reads Bakery inventory-management product | HTTP 403, `You do not have permission to perform this action` |
| Other Bakery reads target order | HTTP 404, `Order not found` |
| Other Bakery updates target order | HTTP 404, `Order not found` |
| Other Bakery modifies target product | HTTP 403, `You do not have permission to update this product` |

The negative mutation attempts left the product name, stock 19, order snapshot, and total unchanged.

## Runtime environment

- Simulator: iPhone 17 Pro, iOS 26.2.
- Flutter: dev flavor, `lib/main_dev.dart`, API define `http://localhost:3000/v1`.
- Backend/database: local Node API on port 3000 and local PostgreSQL `khubzati`.
