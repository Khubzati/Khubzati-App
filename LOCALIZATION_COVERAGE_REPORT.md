# Localization Coverage Report

Date: 2026-05-09

## Coverage approach
- Preserved existing localization architecture.
- New Flutter UI strings use locale-aware rendering (`ar` / `en`) in affected new/rewritten screens.
- Admin navigation labels for newly added operations pages were added to both:
  - `admin/public/locales/en/common.json`
  - `admin/public/locales/ar/common.json`

## Newly localized areas

### Flutter
- Search advanced filter labels/actions
- Order history reorder dialogs/actions
- Payment failure/retry/alternative flow
- Order details delivery/refund timeline labels
- Bakery owner operational dashboard sections
- Bakery product bulk actions labels
- Driver dashboard onboarding/actions/notifications labels

### Admin
- New sidebar navigation keys:
  - refunds
  - disputes
  - payouts
  - drivers
  - commissions
  - broadcasts
  - content

## Validation status
- `flutter analyze` passed.
- `flutter test` passed including localization regression tests:
  - `customer_labels_localized_test.dart`
  - `translations_consistency_test.dart`

## Remaining localization debt
- Existing legacy pages in both Flutter and admin still include mixed hardcoded strings from earlier implementation periods.
- This pass localized all newly added/rewritten operational screens, but full repo-wide string-key normalization remains a separate cleanup track.

