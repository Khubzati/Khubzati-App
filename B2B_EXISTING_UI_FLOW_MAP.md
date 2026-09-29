# Existing B2B UI Flow Map

Runtime environment: iPhone 17 Pro simulator (iOS 26.2), Flutter `dev` flavor via `lib/main_dev.dart`, API `http://localhost:3000/v1`, local PostgreSQL `khubzati`.

| Business action | Existing Flutter screen/route | Existing API | Current result |
| --- | --- | --- | --- |
| Bakery authentication | Existing role picker, login and OTP screens | `POST /auth/login` | PASS |
| Bakery supplier shell | `BakeryOwnerShellScreen` / existing main navigation | `GET /bakery/profile`, `GET /bakery/dashboard` | PASS |
| Create Bakery product | Existing Inventory and Add New Item UI | Bakery product/category APIs | PASS; product `b52c1ac2-2f23-43f0-a6b6-ccbb1d51986d` |
| Restaurant authentication | Existing role picker, login and OTP screens | `POST /auth/login` | PASS |
| Restaurant buyer shell | Existing `RestaurantOwnerHomeRoute` buyer UI | `GET /restaurant/profile`, `GET /bakeries` | PASS |
| Bakery discovery/details | Existing Restaurant Home and vendor-detail screen | `GET /bakeries`, `GET /bakeries/:id`, `GET /products` | PASS |
| Product details | Existing vendor product bottom sheet | `GET /products/:id` | PASS after narrow numeric-contract fix |
| Cart | Existing Restaurant Cart tab/customer cart service | cart APIs with Restaurant token | PASS |
| Checkout | Existing Checkout screen | order, delivery-fee and address APIs | PASS after phone-prefill fix |
| Incoming Bakery order | Existing Bakery Home/Current queue | `GET /bakery/orders` | PASS |
| Preparing | Existing order-card preparation sheet | `PUT /bakery/orders/:id/status` | PASS |
| Ready for pickup | Existing Preparing queue action | same status API | PASS after status-mapping fix |
| Restaurant tracking/receipt | Existing Daily/order screens | order APIs | NOT EXECUTED after ready transition |
| Driver delivery | Existing Driver screens | driver APIs | NOT EXECUTED |

