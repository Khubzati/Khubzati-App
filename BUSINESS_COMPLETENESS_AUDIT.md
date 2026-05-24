# Khubzati Business Completeness Audit

Date: 2026-05-09
Scope: `Khubzati-backend-apis`, `admin`, `khubzati-website`, `khubzati-app`

## 1) COMPLETE

| Feature | Current state | Affected repos/files | Business impact | Priority | Estimated risk |
|---|---|---|---|---|---|
| Authentication (OTP/JWT + role-aware auth) | Implemented with OTP, JWT issuance, role guards, device token registration endpoints | `Khubzati-backend-apis/src/routes/auth.js`, `src/middleware/auth.js`, Flutter auth flows under `khubzati-app/lib/features/auth` | Core sign-in and user separation works | P0 | Low |
| Vendor discovery + catalog browse | Customer-facing listing/details endpoints exist for bakeries/restaurants/products | `Khubzati-backend-apis/src/routes/bakeries.js`, `src/routes/restaurants.js`, `src/routes/products.js`; Flutter customer modules under `lib/features/customer` | Core demand-generation and order intake path works | P0 | Low |
| Order lifecycle baseline | Create/list/detail/update/cancel/invoice endpoints implemented with status transition checks | `Khubzati-backend-apis/src/routes/orders.js`, `src/utils/order-status.js` | Primary transaction flow works | P0 | Medium |
| Stripe + COD payment baseline | Checkout session + verified Stripe webhook + COD collection endpoint implemented | `Khubzati-backend-apis/src/routes/payments.js`, `src/services/payments/payment-service.js`, `src/routes/orders.js` | Revenue capture path is operational | P0 | Medium |
| Reviews and ratings | Review APIs present and integrated in client modules | `Khubzati-backend-apis/src/routes/reviews.js`, `khubzati-app/lib/features/customer/reviews` | Post-order quality loop exists | P1 | Low |
| Admin core moderation | User/vendor listing, status updates, approval/rejection/suspend flows exist; admin UI routes available | `Khubzati-backend-apis/src/routes/admin.js`, `admin/src/app/vendors`, `admin/src/app/users`, `admin/src/app/orders` | Operations team can supervise core marketplace states | P0 | Medium |
| CI baseline in all repos | CI workflows exist and run lint/test/build/analyze gates by repo type | `.github/workflows/ci.yml` in each repo | Protects release quality | P0 | Low |

## 2) PARTIAL

| Feature | Current state | Affected repos/files | Business impact | Priority | Estimated risk |
|---|---|---|---|---|---|
| Driver operations | Driver availability/assignment/status endpoints exist; no proof-of-delivery artifact flow; no GPS stream/dispatcher queue | `Khubzati-backend-apis/src/routes/driver.js`, `khubzati-app/lib/features/driver` | Delivery reliability is limited at scale | P0 | High |
| Vendor analytics parity | Restaurant analytics/export endpoints exist; bakery analytics/earnings parity is uneven | `Khubzati-backend-apis/src/routes/restaurants.js`, `src/routes/bakery.js`, admin dashboard pages | Vendor retention and trust metrics are incomplete for all vendor types | P1 | Medium |
| Notification architecture | In-app + push supported; dispatch currently synchronous without queue/retry backoff | `Khubzati-backend-apis/src/services/notificationDispatchService.js`, `src/services/pushNotificationService.js` | Potential drops/spikes under high traffic | P1 | Medium |
| Customer ETA/live tracking | Order status + estimated time fields exist; no real-time location timeline exposed | `Khubzati-backend-apis/src/routes/orders.js`, Flutter customer order modules | UX confidence gap during delivery window | P1 | Medium |
| Upload/storage architecture | Local storage is hardened and configurable; cloud object storage adapters are not implemented yet | `Khubzati-backend-apis/src/routes/upload.js` | Media pipeline is not cloud-native yet | P1 | Medium |
| Observability | Health endpoint existed; readiness/request-id now added; no centralized logging sink or tracing exporter | `Khubzati-backend-apis/src/app.js`, `src/middleware/error-handler.js`, `src/middleware/request-context.js` | Incident response still limited | P1 | Medium |

## 3) MISSING

| Feature | Current state | Affected repos/files | Business impact | Priority | Estimated risk |
|---|---|---|---|---|---|
| Refund and dispute workflow | No full dispute lifecycle and no provider-level refund endpoint orchestration | `Khubzati-backend-apis/src/routes/admin.js`, `src/services/payments` | Financial operations gap for failed/contested orders | P0 | High |
| Platform commission + payout tracking | No explicit payout ledger/settlement models and endpoints for vendors/drivers | Backend finance domain (not yet modeled) | Cannot operate robust multi-sided settlement | P0 | High |
| Coupon/promotion management | No first-class coupon/promo CRUD and redemption logic found | Backend/admin feature area | Limits growth tooling and campaign operations | P1 | Medium |
| Audit log trail for admin actions | No dedicated immutable audit log model/endpoints | `Khubzati-backend-apis/src/routes/admin.js` | Compliance and accountability risk | P0 | High |
| Content/banner management backend | Marketing content managed mostly in website code; no admin-managed content service | `khubzati-website/src/*`, admin feature gap | Slower merchandising operations | P2 | Low |

## 4) PLACEHOLDER

| Feature | Current state | Affected repos/files | Business impact | Priority | Estimated risk |
|---|---|---|---|---|---|
| Noon payments | Provider class present but intentionally placeholder/feature-flagged | `Khubzati-backend-apis/src/services/payments/noon-payment-provider.js`, `payment-service.js` | Safe if disabled; risky if enabled without full implementation | P0 | Medium |
| Legacy development stubs | Stub endpoints remain guarded behind `ENABLE_STUB_RESPONSES` and blocked in production | `Khubzati-backend-apis/src/app.js` | Lower risk in production due guard, but adds maintenance overhead | P1 | Low |
| Password reset/email verify route semantics | Explicit comments indicate simplified/non-final behavior in some auth endpoints | `Khubzati-backend-apis/src/routes/auth.js` | Security/identity UX incompleteness | P1 | Medium |

## 5) TECH DEBT

| Feature | Current state | Affected repos/files | Business impact | Priority | Estimated risk |
|---|---|---|---|---|---|
| ORM dual-stack residue | Runtime is Prisma, but Sequelize models/migrations/scripts remain in-tree | `Khubzati-backend-apis/src/db/*`, `package.json`, `prisma/*` | Cognitive load and migration drift risk | P1 | Medium |
| Prisma schema drift (fixed in this pass) | Driver/device-token models and `driver` role were missing from schema despite code usage; now aligned | `Khubzati-backend-apis/prisma/schema.prisma` | Previously caused latent runtime failures in driver/push paths | P0 | High (now reduced) |
| Admin lint warnings | Lint is non-interactive, but warnings remain (`<img>`, hook deps) | `admin/src/app/*`, `admin/src/presentation/components/shared/Logo.tsx` | Quality debt, not immediate blocker | P2 | Low |
| Flutter legacy backup module | Backup feature folder exists in source tree | `khubzati-app/lib/features/restaurant_owner.backup.20260422_014957` | Potential confusion and accidental imports | P2 | Low |

## Audit Verdict

Khubzati is **production-baseline capable** for core ordering and payments, but **not yet fully business-complete** for a mature regional commerce operation. The highest-priority business gaps are financial operations (refunds/disputes/payouts), driver proof-of-delivery + dispatch robustness, and audit/operations governance.
