# Vendor State Machines

## Final state-machine gate — 2026-07-25

**Launch decision: GO.** Both isolated vendor lifecycles traversed the persisted canonical path `confirmed → preparing → ready_for_pickup → picked_up → out_for_delivery → delivered`; invalid and backward owner transitions were rejected. Approval, explicit selected context, suspension denial and Flutter session invalidation/vendor-switch behavior are also executable-test covered. See `FINAL_VENDOR_LIFECYCLE_EVIDENCE.md`. Earlier risk text below is retained as historical analysis.

These are extracted from Prisma enums, route validation, `src/utils/order-status.js`, `src/utils/delivery-state-machine.js`, Flutter labels, and tests. UI labels are translations of the canonical lowercase API strings.

## Vendor account

| Current | Action/actor | Next | Enforcement/impact |
|---|---|---|---|
| no vendor | owner submits profile | `pending_approval` | ownerId comes from token |
| `pending_approval` | admin approve | `active`/approved semantic | audited; owner mutations enabled |
| `pending_approval` | admin reject(reason) | `rejected` | reason and rejectedAt persisted |
| `rejected` | owner resubmits documents | `pending_approval` | rejection metadata cleared |
| active | admin suspend | `suspended` | distinct persisted enum; audited; backend mutation gate denies |
| suspended | admin activate | `approved` | audited; status visible on profile/status refresh/app resume |
| any | user deletedAt set | inactive account | auth endpoints deny |

There is no WebSocket status push. The app learns changes through login, token/profile/status refresh; a hard logout is not intrinsically required, but an unreachable bakery shell prevents a complete bakery UX.

## Canonical order machine

Restaurant and bakery use the same Order model and transition utility. Owner endpoints differ only by vendor lookup.

| Current | Allowed next | Actor | Customer label | Vendor label | Driver impact |
|---|---|---|---|---|---|
| pending/new | confirmed/accepted, cancelled/rejected | matching vendor or admin | Pending | New | not available |
| confirmed/accepted | preparing, cancelled | vendor/admin | Confirmed | Accepted | not available |
| preparing | ready_for_pickup, cancelled | vendor/admin | Preparing | Preparing | becomes pickup candidate |
| ready_for_pickup | assigned/picked_up | driver/admin | Ready | Ready | available/assigned |
| assigned | picked_up, failed | assigned driver/admin | Driver assigned | Driver assigned | active |
| picked_up | out_for_delivery | assigned driver/admin | Picked up | Picked up | active |
| out_for_delivery | delivered, failed | assigned driver/admin | On the way | Out for delivery | active |
| delivered | refunded (financial side state) | admin/payment workflow | Delivered | Delivered | complete |
| cancelled/failed | terminal (refund may proceed) | permitted actor | Cancelled/Failed | Cancelled/Failed | released/failed |

Exact aliases are normalized in `order-status.js`; this is a risk because Flutter and individual owner routes still contain parallel label/validation lists. Admin may override through admin status endpoints and audit logging is not proven for every transition.

## Delivery machine

`unassigned → assigned → picked_up → out_for_delivery → delivered`; `assigned|picked_up|out_for_delivery → failed`, with reassignment supported after release/failure where route conditions allow. The assigned driver is enforced on mutation. Location updates are stored through driver status/location payloads. Bakery and restaurant orders share DeliveryAssignment and the same driver endpoints.

## Refund machine

`pending → approved → processing → completed`, or `pending/approved → rejected/failed` as allowed by finance route validation/provider outcome. RefundRequest is separate from Order.status and FinancialTransaction records provider money movement. Flutter vendor/customer refund UI is absent; admin refund UI is not proven to persist.
## Implementation checkpoint — 2026-07-25

Vendor operational status now distinguishes `pending_approval`, `approved`, `rejected`, `suspended`, and `inactive`; the bakery shell gates each state and refreshes on resume. Order modifier configuration is validated before order creation and copied into immutable snapshots. Final device-level restaurant and bakery lifecycle transition rehearsals remain open.
# 2026-07-25 selected-context state update

Owner selection now follows:

`aggregate refresh -> single auto-select | multiple explicit choice -> secure persistence -> selected status refresh -> scoped shell recreation`

On removal or stale persistence:

`refresh -> validation failure -> secure selection cleared -> selection-required gate`

On token-expiry recovery failure:

`401 -> refresh attempt -> auth and selected-vendor keys cleared`

Rejected, suspended, and inactive selected entities remain selected and are evaluated independently; an approved sibling cannot mask their state. Launch remains **NO-GO** pending isolated lifecycle rehearsal evidence.
