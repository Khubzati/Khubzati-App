# Performance Review

Audit date: 2026-07-25

## High-impact scalability concerns

### Full financial-record scan for every payout request

`financeService.js:127-158` loads every `OrderFinancialRecord` for a vendor into Node.js and reduces it in memory. Cost grows linearly with lifetime order volume and is executed on a latency-sensitive money path.

**Recommendation:** Maintain an atomic vendor balance/ledger aggregate or calculate with database aggregates and indexed vendor context.

### Missing indexes on primary relationship/filter columns

The Prisma schema has no indexes on `Bakery.ownerId`, `Restaurant.ownerId`, `Product.bakeryId`, `Product.restaurantId`, `Product.categoryId`, `Cart.userId`, `CartItem.cartId`, `Order.userId`, `Order.bakeryId`, `Order.restaurantId`, or `OrderItem.orderId`. These are repeatedly used in owner dashboards, discovery, cart, order history and finance. With `relationMode = "prisma"`, Prisma does not supply implicit relation indexes.

**Recommendation:** Obtain `EXPLAIN (ANALYZE, BUFFERS)` from production-like data and add targeted composite indexes matching status/deleted/time filters.

### KPI aggregation loads raw operational rows

`kpiAggregationService.js:216-336` loads orders, dispatch jobs, cancellation reasons, refunds, payouts and disputes and then loops in application memory. Backfill range cost grows with raw history.

**Recommendation:** Push aggregation into grouped SQL/materialized facts, enforce bounded date windows and run backfills outside request processes.

## Medium concerns

- `cart.js:95-117` loads all cart items to calculate totals and performs a separate cart update on every mutation.
- Order cancellation/restock paths (`orders.js:179-226`, restaurant/bakery/admin equivalents) query and update products sequentially per item.
- Recurring renewals and queue delivery use row-by-row loops. Batching/claim limits exist in some workers, but throughput is connection/round-trip bound.
- The backend mounts singular/plural and `/api`/`/v1` aliases for the same large routers, increasing routing/test surface and observability cardinality.
- Local upload storage prevents safe horizontal scaling and can lose files on ephemeral instances (`upload.js:140-143`).
- In-memory rate limits are per replica, so effective limits grow linearly with scale.
- Public worker-health handlers swallow individual database errors and report zero, making degraded performance look healthy (`app.js` count calls with `.catch(() => 0)`).

## Flutter performance risks

- `ApiClient` is a process-wide singleton (`api_client.dart:12-23`), simplifying connection reuse but coupling every feature to shared interceptor/storage state.
- Payment status polling performs up to six fixed two-second checks on app resume (`payment_screen.dart:153-160,628-655`). It is bounded, but all returning payers can synchronize load.
- The repository includes a large quarantined Flutter source tree and numerous generated/duplicate feature implementations. It is excluded from active routing but increases analysis/indexing and accidental-import risk.
- Several owner dashboards request multiple independent analytics endpoints; no request coalescing/cache invalidation policy is visible at the API boundary.
- Image loading has no repository-wide sizing/cache policy; remote and uploaded images can therefore decode at source resolution.

## Positive evidence

- List APIs generally expose pagination and bounded `take`.
- Driver assignment and order creation use transactional/atomic mechanisms in critical paths.
- Flutter controllers reviewed in active payment/search/product screens are disposed, and delayed payment callbacks check `mounted`.
- Dio uses connection and receive timeouts.
- Queue/worker models contain status/time indexes and bounded claim patterns.

