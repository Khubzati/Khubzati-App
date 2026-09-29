# Database Invariant Evidence

Migration: `Khubzati-backend-apis/prisma/migrations/20260726010000_launch_blocker_invariants/migration.sql`.

It adds:

- `products_exactly_one_vendor_owner_check`;
- a partial unique index for one non-deleted cart per user;
- unique requester/idempotency keys for refunds;
- unique vendor/idempotency keys for payouts;
- unique nullable side-effect keys for financial transactions and vendor-ledger entries.

## Existing database migration

The preflight initially stopped because four legacy test products had neither owner. All four were named `Product <timestamp>`. Read-only probes found zero cart-item, order-item, review, or modifier references. Exactly those four isolated test fixtures were permanently deleted, the failed migration was marked rolled back, and migration deployment then succeeded. No application/customer record was deleted.

Post-migration probe result:

```json
{"invalidProducts":0,"customersWithDuplicateActiveCarts":0}
```

Direct Prisma regression writes with both owners and with neither owner each fail with PostgreSQL check-constraint code `23514`.

## Fresh database rehearsal

An isolated database named `khubzati_launch_validation_20260726` was created. All 25 migrations applied successfully and `prisma validate` passed. The isolated database was then dropped. This proves installation from an empty production-shaped PostgreSQL schema, independent of the repaired current database.

