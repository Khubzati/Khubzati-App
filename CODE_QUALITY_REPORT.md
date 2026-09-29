# Code Quality Report

Audit date: 2026-07-25

## Overall rating: Needs improvement

The system has meaningful domain tests and several sound abstractions, but production behavior is spread across very large route modules with duplicated state logic and legacy frameworks. The result is a codebase that can pass lifecycle tests while still hiding cross-cutting financial and authorization defects.

## Maintainability and architecture

### Large route modules combine too many responsibilities

- `routes/auth.js` contains authentication, OTP, runtime schema recovery, Firebase login, device tokens and vendor approval status.
- `routes/admin.js` combines authentication, dashboards, users, vendors, orders, banners and KPI/SLA operations.
- `routes/bakery.js` and `routes/restaurants.js` each duplicate dashboard, catalog, category, order, cancellation and reporting logic.

This duplication directly contributed to parallel order-transition implementations and makes invariant changes difficult to apply consistently.

### Runtime database repair bypasses migration discipline

`auth.js:85+` runs `CREATE TABLE/INDEX` DDL to heal missing production schema during requests. This makes application behavior depend on database DDL privileges and can conceal a failed deployment migration.

**Recommendation:** Remove runtime DDL after a verified forward migration and fail readiness when schema prerequisites are absent.

### Multiple persistence/application stacks remain

The backend package contains Prisma (active), Sequelize models/migrations, Next/React build dependencies and Supabase utilities while production starts Express. `package.json` still builds a Next application and retains legacy Sequelize scripts. Dependency direction and ownership are unclear.

### API aliases multiply the contract surface

`app.js` mounts most routers under both `/api` and `/v1`, with singular and plural restaurant paths. Backward compatibility is understandable, but aliases lack deprecation telemetry/version retirement.

### Flutter contains production, backup and quarantine implementations

The active app uses feature BLoCs/services plus `lib/_quarantine`, while generated DI and routing span many domains. The quarantine boundary is better than active duplication, but it should not ship in the application source set.

### Dead payment code is misleading

The payment screen declares raw card controllers and builds a manual-card widget (`payment_screen.dart:695-750`) while the visible flow states Stripe-hosted checkout and `PaymentService.processPayment` ignores `cardDetails`. `savePaymentMethod` still contains a raw PAN/CVV API payload for an endpoint absent from the backend (`payment_service.dart:138-162`).

**Recommendation:** Remove unreachable raw-card code to prevent accidental PCI scope expansion.

## Correctness debt

- Finance state machines exist as unconstrained strings/transitions in route handlers.
- Polymorphic vendor identity relies on application convention rather than database constraints.
- Cart creation is find-then-create without uniqueness.
- `AuthInterceptor` implements refresh against `/auth/refresh-token`, but no backend route is registered.
- Tests sometimes validate only HTTP outcomes, not persisted side-effect cardinality (webhook replay).

## Readability and positive practices

- Critical lifecycle tests use isolated fixtures and explicit cleanup.
- Request IDs and centralized error middleware exist.
- Domain utilities exist for delivery and order status normalization.
- Flutter uses explicit states, secure storage and bounded retry behavior.
- Admin repositories centralize external API calls.
- Prisma model and migration naming is generally descriptive.

## Recommended remediation order

1. Correct financial idempotency/concurrency and authorization revocation without broad refactoring.
2. Encode database invariants and add safe migrations.
3. Make CI/deployment reproducible.
4. Split route modules along domain-service boundaries and centralize state machines.
5. Remove legacy Sequelize/Next backend and quarantined Flutter source after confirming no imports.
6. Delete dead raw-card flows and align refresh-token contracts.

