# Design System Notes

## Theme adherence
- Kept Khubzati warm palette and existing semantic color usage.
- Preserved rounded card/button geometry and soft elevated surfaces.
- Used existing typography and locale-driven font switching.

## Interaction patterns used
- Primary actions: filled `AppButton` / gradient admin buttons.
- Secondary actions: outline buttons for reversible ops actions.
- High-risk actions: danger style for reject/suspend/remove.
- Refresh/retry: pull-to-refresh where applicable, explicit retry actions in error states.

## Added design primitives
1. `OfflineRetryWidget`
- Purpose: consistent offline/failure state with retry CTA.
- Applied in customer and operations views.

2. `StatusTimelineCard`
- Purpose: reusable linear process visualization for delivery/refund/payout/onboarding progress.
- Applied in order details, bakery dashboard, and driver onboarding/status.

## Visual consistency decisions
- Reused existing spacing rhythm (`8/10/12/16/20`) from current screen patterns.
- Maintained card-first density and compact action rows for operational scenarios.
- Avoided introducing new typography families or unrelated style language.

## Known legacy inconsistencies still present
- Some older modules still mix key-based localization and inline strings.
- Existing warning-level lint issues in older admin files remain unchanged.

