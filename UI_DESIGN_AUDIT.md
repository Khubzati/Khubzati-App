# UI Design Audit (Khubzati)

Date: 2026-05-09
Scope: Flutter app + Admin dashboard

## Current design language
- Warm bakery palette anchored by burnt orange, cream, and brown accents (`AppColors.primaryBurntOrange`, `secondaryLightCream`, `textDarkBrown`).
- Rounded surfaces and controls (12–20 radius), soft shadows, card-first layout.
- Arabic-first typography and RTL-aware theme switching (`GE Dinar One` for Arabic, `Lato` for English).
- Mobile-first composition with dense operational cards and list rows.

## Reusable components found
- Flutter shared UI: `AppCard`, `AppButton`, `AppLoadingWidget`, `AppErrorWidget`, `AppTextField`, `EmptyStateWidget`, custom nav/header widgets.
- Flutter status/operations: `status_chip`, shared bottom sheets, reusable notifications widgets.
- Admin shared UI: `Layout`, `Card`, `Button`, `Input`, `Table`, toast/modal primitives.

## Inconsistencies observed
- Some Flutter business screens remained placeholder/TODO-heavy (bakery owner dashboard/product management and older driver sections).
- Mixed localization approach (localized keys + inline hardcoded strings in several older files).
- Inconsistent loading/error empty states across feature modules.
- Admin had strong core CRUD pages but missing dedicated finance/operations pages in navigation.

## Reuse opportunities applied in this implementation
- Standardized new screens on existing card/button/loading patterns in both Flutter and admin.
- Reused existing services (`BakeryDashboardService`, `BakeryProductManagementService`, `DriverDashboardService`) instead of introducing new architecture.
- Reused finance/notification backend endpoints in admin operational pages.

## Missing shared widgets (before implementation)
- Dedicated offline/retry reusable widget.
- Timeline/status progression card for delivery/refund/payout journeys.
- Unified filter chip presentation for advanced search filter state.

## Shared widgets added
- `lib/core/widgets/shared/offline_retry_widget.dart`
- `lib/core/widgets/shared/status_timeline.dart`

