# Khubzati Refactor Map (Applied)

## Sprint 0/1 Security & Integrity
- `Khubzati-backend-apis/src/middleware/auth.js`
  - JWT rotation-aware verification and stricter payload checks.
- `Khubzati-backend-apis/src/routes/auth.js`
  - Removed fallback authentication paths.
  - Added OTP attempt-capping + structured security event logging.
  - Added real password-reset OTP flow and alias compatibility endpoint.
- `Khubzati-backend-apis/src/routes/upload.js`
  - Enforced auth, ownership validation, upload audit logging.
- `Khubzati-backend-apis/src/routes/users.js`
  - Replaced unsafe upsert on address update.
- `Khubzati-backend-apis/src/routes/admin.js`
  - Removed false-success fallback behavior.

## Sprint 2 Consistency & Reliability
- `Khubzati-backend-apis/src/routes/orders.js`
  - Added idempotency-key support and replay semantics.
  - Added append-only inventory movement writes.
  - Added cancellation restock reconciliation + reason persistence.
  - Added `/orders/create` and `/orders/scheduled` APIs.
- `Khubzati-backend-apis/src/routes/bakery.js`
- `Khubzati-backend-apis/src/routes/restaurants.js`
  - Added cancel->restock reconciliation in vendor status flows.

## Sprint 3 Contract Alignment
- `admin/src/app/disputes/page.tsx`
  - Fixed payload contract for dispute resolution.
- `admin/src/app/commissions/page.tsx`
  - Migrated to `rateBps` contract.
- `khubzati-app/lib/features/marketplace/...`
  - Replaced mock repository default with API-backed implementation.
- `Khubzati-backend-apis/src/routes/contracts.js`
  - Added API contract version + client error event ingestion APIs.

## Sprint 4/5/6 Scale Foundations
- `Khubzati-backend-apis/src/routes/delivery.js`
  - Added slots/zones/shifts/dispatch endpoints.
- `Khubzati-backend-apis/src/routes/finance.js`
  - Added payout account ops, settlement batch APIs, bulk payout actions, reconciliation export.
- `Khubzati-backend-apis/src/services/notificationQueueService.js`
  - Improved claim atomicity + dead-letter persistence.
- `Khubzati-backend-apis/src/routes/notifications.js`
  - Added queue metrics and health endpoints.
- `Khubzati-backend-apis/src/app.js`
  - Added recurring worker advisory lock and worker health route.

## Schema/Migration Layer
- `Khubzati-backend-apis/prisma/schema.prisma`
- `Khubzati-backend-apis/prisma/migrations/20260515090000_add_roadmap_foundation/migration.sql`
