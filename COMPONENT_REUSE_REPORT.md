# Component Reuse Report

## Reused existing components

### Flutter
- `AppCard`: used for all new section containers and operational cards.
- `AppButton`: used for primary/secondary/outline operational actions.
- `AppLoadingWidget`: used in async loading states.
- `HomepageHeader`: retained in bakery owner screens.
- Existing feature services/blocs were reused for data and actions.

### Admin
- `Layout`: all new ops pages inherit existing nav/header shell.
- `Card`: reused for content blocks and feedback states.
- `Table`: reused for refunds/disputes/payouts/drivers list management.
- `Button` and `Input`: reused for action flows and forms.

## New shared components added
- `offline_retry_widget.dart`
- `status_timeline.dart`

## Why these new components were needed
- Prior codebase lacked one reusable pattern for offline/retry state.
- Multiple new business flows required timeline/status progression UX; creating one shared timeline avoided repeated bespoke implementations.

## Avoided duplication
- No parallel theme/token system introduced.
- No alternate component library introduced.
- No custom one-off styles where existing card/button/input primitives were sufficient.

