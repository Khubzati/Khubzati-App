# Vendor API Contract Matrix

## Final contract gate — 2026-07-25

**Launch decision: GO.** Backend contract behavior is proven by the isolated restaurant and bakery rehearsals, including explicit vendor context, ownership/status rejection, modifier validation, server-authoritative totals, idempotency, immutable snapshots and legal order transitions. Injected Flutter transport tests prove failure semantics without false-success UI. See `FINAL_VENDOR_LIFECYCLE_EVIDENCE.md`. Earlier conditional/NO-GO rows below are retained as the original audit snapshot and are superseded by this gate.

All paths below are active under `/v1`; `src/app.js:162-199` also mounts `/api` aliases. JSON responses normally use `{status,data,message}`. IDs are UUID strings; API JSON uses camelCase while Prisma maps columns to snake_case.

| Actor | Feature | Method | Path | Request Fields | Response Fields | Auth | Role | Ownership | Flutter Consumer | Admin Consumer | Tests | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Vendor | register | POST | `/auth/register` | username/email/phone/password/role; restaurant profile fields | user, verificationId, otp(test) | no | vendor role | n/a | auth/restaurant signup | no | rejection/status suites | Wired |
| Vendor | verify OTP | POST | `/auth/verify-otp` | identifier, otp, purpose | token,user,vendorStatus | no | any | own identifier | AuthBloc | no | security/E2E | Wired |
| Vendor | status refresh | GET | `/auth/approval-status` | none | role,isVerified,requiresApproval,vendorStatus including accountStatus | bearer | vendor | ownerId/createdBy | AuthBloc + bakery shell resume refresh | no | rejection/status gate | Operational statuses wired; multi-vendor still ambiguous |
| Customer | list bakeries | GET | `/bakeries` | query filters | bakeries | optional | any | public approved filter | VendorListingService | VendorRepository | E2E | Wired |
| Customer | list restaurants | GET | `/restaurants` | query filters | restaurants | optional | any | public approved filter | VendorListingService | VendorRepository | product tests | Wired |
| Bakery owner | create profile | POST | `/bakeries` | profile fields | bakery | bearer | bakery_owner | owner assigned from token | signup/shared flow | VendorRepository | E2E | Wired/pending |
| Bakery owner | edit profile | PUT | `/bakeries/:id` | mutable profile/docs | bakery | bearer | owner/admin | ownerId | no reachable owner route | Vendor detail | rejection flow | Wired |
| Restaurant owner | dashboard | GET | `/restaurant/dashboard` | none | metrics | bearer | restaurant_owner | token owner | dashboard service | dashboard | indirect | Wired |
| Bakery owner | dashboard | GET | `/bakery/dashboard` | none | metrics | bearer | bakery_owner | token owner | unreachable dashboard service | dashboard | indirect | Backend only |
| Restaurant owner | products | GET/POST | `/restaurant/products` | create: name,description,price,stockQuantity,categoryId,imageUrl | product(s) | bearer | restaurant_owner | owned active restaurant | restaurant product service | vendor detail | restaurant.products | Pass |
| Restaurant owner | product | PUT/DELETE | `/restaurant/products/:id` | mutable fields | product/message | bearer | restaurant_owner | product.restaurant owner | same | vendor detail | restaurant.products | Pass |
| Restaurant owner | availability | PATCH | `/restaurant/products/:id/availability` | isAvailable | product | bearer | restaurant_owner | product.restaurant owner | same | no | restaurant.products | Pass |
| Bakery owner | products | GET/POST | `/bakery/products` | same core fields | product(s) | bearer | bakery_owner | owned active bakery | bakery product service | vendor detail | availability/E2E | Status gate works; UI unreachable |
| Bakery owner | product | GET/PUT/DELETE | `/bakery/products/:id` | mutable fields | product/message | bearer | bakery_owner | product.bakery owner | same | vendor detail | availability | Wired |
| Bakery owner | availability | PATCH | `/bakery/products/:id/availability` | isAvailable | product | bearer | bakery_owner | product.bakery owner | same | no | availability | Wired |
| Vendor | categories | CRUD | `/restaurant/categories*`, `/bakery/categories*` | name/description | category | bearer | matching owner | vendor-scoped | product services | none | limited | Untested/admin missing |
| Customer | product list/detail | GET | `/products`, `/products/:id` | vendor/category filters | product(s) | no | any | public available/active | vendor detail | vendor detail | E2E | Wired |
| Customer | upload | POST | `/upload/document(s)` | multipart file,ownerType,ownerId | fileUrl metadata | optional | any | checked only when authenticated | signup/product pickers | banner/docs | upload tests | Pre-auth exposure |
| Customer | create order | POST | `/orders` | addressId,paymentMethod,items,orderType | order/totals | bearer + idempotency header | customer | token user; one vendor | CheckoutService | OrderRepository | stress/E2E | Server-authoritative; E2E setup failing |
| Customer | order list/detail | GET | `/orders`, `/orders/:id` | filters | orders/order | bearer | customer/admin | customerId or admin | history/detail services | orders | E2E | Wired |
| Restaurant owner | orders | GET | `/restaurant/orders*` | filters | orders/stats | bearer | restaurant_owner | restaurant owner | restaurant order service | orders | status gate | Wired |
| Bakery owner | orders | GET | `/bakery/orders*` | filters | orders/stats | bearer | bakery_owner | bakery owner | bakery order service | orders | E2E | Backend only |
| Vendor | change order status | PUT | owner `/orders/:id/status` | status,reason | order | bearer | matching owner | order vendor owner | owner order services | orders | driver/E2E | State validated |
| Driver | available deliveries | GET | `/driver/deliveries/available` | none | bare Orders | bearer | driver | unassigned eligible | DriverDashboardService | drivers/orders | driver.delivery | Pass |
| Driver | accept | POST | `/driver/deliveries/:orderId/accept` | none | assignment/order | bearer | driver | unassigned order | driver dashboard | orders | driver/stress | Pass |
| Driver | status | POST | `/driver/deliveries/:orderId/status` | status,location | assignment/order | bearer | assigned driver | assignment.driverId | driver dashboard | orders | driver state machine | Pass |
| Customer | payment intent | POST | `/payments/intents` | orderId,provider | client/payment metadata | bearer | customer | order customer | PaymentService | orders | payments | Suite affected by DB exhaustion |
| Admin | list/detail vendors | GET | `/admin/vendors`, `/admin/vendors/:id` | type/status filters | vendors/vendor | bearer | admin | n/a | no | VendorRepository/pages | vendor/admin tests | Wired |
| Admin | approve/reject | PUT | `/admin/vendors/:id/approve|reject` | reject reason | vendor | bearer | admin | entity lookup in both types | status refresh sees it | vendor pages | rejection/status | Wired/audited |
| Admin | suspend/activate | PUT | `/admin/vendors/:id/suspend|activate` | reason optional | vendor | bearer | admin | entity lookup | backend gate impact | vendor pages | status gate | Wired/audited |
| Admin | orders/status/cancel | GET/PUT | `/admin/orders*` | status/reason | order(s) | bearer | admin | n/a | customer/vendor refresh | OrderRepository/page | E2E | Wired |
| Admin/vendor | refunds | POST/PUT | `/finance/refunds*` | orderId,amount,reason,status | refund | bearer | scoped/admin | customer/vendor order relation | none | shell page | finance | Backend only |
| Vendor/admin | payouts | GET/POST/PUT | `/finance/payouts*` | vendorType,vendorId,amount,status | payout | bearer | scoped/admin | vendor owner enforced | none | shell page | finance | Backend only |
| Admin | audit logs | GET | `/admin/audit-logs` | filters | logs | bearer | admin | n/a | none | audit page | admin tests limited | Wired |
## Implementation checkpoint — 2026-07-25

Added active contracts for `/v1/products/:productId/modifier-groups*`, `/v1/customer/cart*`, `/v1/upload/onboarding-token`, purpose-token uploads, paginated/filterable `/v1/finance/{refunds,disputes,payouts}`, and multi-entity `/v1/auth/approval-status` with explicit vendor context. Backend contract tests pass. Client owner modifier CRUD and selected-vendor propagation remain open.
# 2026-07-25 contract update

- Owner clients persist an explicit selected vendor and send `X-Vendor-ID` and `X-Vendor-Type` on authenticated operations.
- Approval status is fetched in aggregate, then refetched with explicit `vendorId` for the selected entity.
- Backend owner resolvers scope bakery, restaurant, product modifier, and finance operations to explicit context while retaining token ownership checks.
- Onboarding upload records are single-use and are consumed inside vendor-registration transactions.
- Full backend contract suite passed twice: **29 suites / 136 tests**.
- Launch remains **NO-GO** until isolated restaurant and bakery lifecycle rehearsals are recorded.
