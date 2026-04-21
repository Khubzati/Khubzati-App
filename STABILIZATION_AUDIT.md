# Stabilization Audit (WIP)

## Architecture Summary
- **Backend**: Express server (`Khubzati-backend-apis/src/app.js`) with Prisma/PostgreSQL ORM and JWT/OTP auth. Routes split by domain: auth, users, bakery (owner vs customer views), restaurants, products, orders, reviews, notifications, admin, upload. Stubs can be enabled via `ENABLE_STUB_RESPONSES` and numerous non-prod shortcuts exist in route handlers.
- **Data model**: Prisma schema (`Khubzati-backend-apis/prisma/schema.prisma`) models users, addresses, bakeries, restaurants, products, carts/orders/reviews/notifications. User roles enumerated as `customer | bakery_owner | restaurant_owner | admin`; **driver role absent**. Order status lifecycle: pending → confirmed → preparing → ready_for_pickup → out_for_delivery → delivered → completed/cancelled. Payment status: pending/paid/failed/refunded.
- **Auth/session**: OTP-first flow in `src/routes/auth.js`; passwords hashed on register but not used on login. JWT issued (24h) with `{id, role}`; middleware in `src/middleware/auth.js`. OTP sent via Twilio helper (`services/smsService`), no rate limiting.
- **Orders**: `src/routes/orders.js` handles create/read/update/cancel; creates notifications on place/status changes. Non-prod fallbacks inject test IDs and bypass validation; no driver assignment or payment capture.
- **Notifications**: Stored in DB only (`notifications` table); created on order events; no push integration wiring observed.
- **Admin panel**: Next.js 14 app (`admin/`) with clean-architecture layering (domain/data/presentation), Zustand stores, next-i18next for EN/AR. Talks to backend at `NEXT_PUBLIC_API_URL` (expected `/v1/admin/*`).
- **Mobile app**: Flutter app (`khubzati-app/`) using AutoRoute (`lib/core/routes/app_router.dart`), dependency injection via `getIt`, Firebase config per flavor, base API URL `/v1`. Screens exist for customer, owner, driver, but backend driver APIs missing. Deep links handled via AutoRoute; localization assets not yet reviewed.
- **Env/config**: Sample env in backend (`sample.env`); Firebase and Twilio keys expected; ADMIN credentials env-based. Flutter config selects base URL per flavor; admin uses `.env.local`.

## Flow-by-Flow Audit Snapshot (initial pass)
- **Customer**: Auth OTP present; browse/search/vendor/product/cart/order/review endpoints exist; checkout/payment use placeholders; tracking limited to order status; deep links/localization not yet validated. Status: *Partially implemented, needs verification*.
- **Owner**: Bakery/restaurant CRUD & order status endpoints exist; approval workflow via admin routes; image upload stub via `upload.js`. Status: *Partially implemented*.
- **Driver**: Mobile UI has driver dashboard, but **no backend driver model/endpoints**; no assignment logic. Status: *Missing (critical)*.
- **Admin**: Admin routes exist for vendor/user/order actions; panel structure in place; integration not yet validated. Status: *Partially implemented*.
- **Platform**: OTP/JWT implemented; payments not integrated; notifications DB-only; migrations present but coherence not yet validated; stubs enabled by default in dev masking failures. Status: *Needs validation*.

## Issues by Severity (current findings)
### Critical
- Driver role/entity completely absent from Prisma schema and backend routes, blocking any driver delivery lifecycle despite driver screens in Flutter (`prisma/schema.prisma`, `src/routes/*`).
- Order creation defaults to test IDs and returns success in non-production even when validation fails, leading to orphaned data and masking real issues (`src/routes/orders.js`).
- `sample.env` contains a Twilio AUTH token-like string checked into repo (potential secret leakage); must rotate/remove and validate secret handling (`Khubzati-backend-apis/sample.env`).

### High
- Dev stub mode (`ENABLE_STUB_RESPONSES` default true in dev) intercepts many endpoints and forces success responses, preventing reliable QA and hiding backend gaps (`src/app.js`).
- Login flow ignores stored password; only OTP path available; no brute-force/OTP rate limiting, raising security risk (`src/routes/auth.js`).
- Payment flow is placeholder; `paymentStatus` never transitions beyond pending and no gateway/webhook logic exists (`src/routes/orders.js`).

### Medium
- Role auth limited to four roles; driver and fine-grained permissions missing (middleware/auth.js plus schema). 
- File upload route and image URL fields lack validation/size/type checks (upload route not yet reviewed). 
- Notification flow is DB-only; push/FCM not wired, so mobile users won’t receive realtime updates.
- Prisma schema lacks soft-delete filters on many queries; several routes do not filter `deletedAt`, risking surfacing deleted entities.

### Low / Observations
- Extensive debug logging and try-everything phone normalization in auth may affect performance; needs tightening before prod.
- Order number generation not collision-safe (timestamp + random up to 999).
- Tests rely on stub IDs (`test-bakery-product-id`, `test-order-id`), should be gated behind explicit flag.

## Completed Fixes
- Disabled default stub responses; stubs now opt-in via `ENABLE_STUB_RESPONSES=true` so QA sees real behavior.
- Added driver domain: Prisma models `DriverProfile`, `DeliveryAssignment`; new driver routes `/api/driver/*` for availability and assignment lifecycle; user role enum now includes `driver`; Prisma migration applied (`add_driver_domain`) and client regenerated.
- Hardened order creation: removed test fallbacks, validated items/address, safer order numbers; added allowed status transition guard; payments now Stripe-ready with PaymentIntent initiation + webhook (Stripe signature) and sandbox/live gating via `PAYMENT_MODE`, storing `paymentErrorMessage`.
- Auth hardening: OTP rate limiting with Redis support (via `REDIS_URL`, falls back to memory), optional password login path, phone normalization on registration.
- Admin SSR RTL: `layout.tsx` now sets `lang/dir` server-side from `NEXT_LOCALE` cookie to avoid LTR flash for Arabic.
- Flutter driver client aligned to new endpoints (`/driver/availability`, `/driver/assignments/...`), updated service and bloc wiring.
- Removed leaked Twilio token from sample env.
- Vendor currency: bakeries/restaurants now have `currency` (default JOD); admin vendors table allows inline currency select, backend route `/api/admin/vendors/:id/currency` updates it; existing data backfilled to JOD.

## Remaining Gaps / Next Steps (shortlist)
- Add driver domain (schema + routes + assignment workflow) and align mobile driver dashboard to new APIs.
- Remove/guard stub fallbacks; enforce strict validation in non-test envs.
- Secure secrets: purge sample token, document env handling, ensure `.env` not committed.
- Implement proper payment status transitions or feature-flag payment placeholder to avoid misleading states.
- Add rate limiting & password-based auth (or explicitly drop password storage) and tighten OTP expiry/attempt limits.
- Validate migrations/seed data and align mobile/admin models with backend responses.

## Setup / Run Notes
- Backend: `cp sample.env .env`, set DB + JWT + Twilio/Firebase, then `npm install && npx prisma generate && npm run start:dev` inside `Khubzati-backend-apis`.
- Admin: `cd admin && npm install && NEXT_PUBLIC_API_URL=http://localhost:3000/v1 npm run dev`.
- Mobile: `cd khubzati-app && flutter pub get && flutter run` (uses `/v1` base URL; Android emu uses 10.0.2.2:3000).

## Assumptions
- API base path `/v1` should remain the canonical client target.
- Payment integration is intentionally stubbed; will be replaced or feature-flagged.
- Firebase handles push for mobile; backend currently only stores notifications.
