# Remaining Launch Blockers

## Final launch gate — 2026-07-25

Launch decision: **GO**. This final gate supersedes the earlier checkpoints retained below for audit history.

No evidence-backed launch blocker remains. Separate isolated restaurant and bakery lifecycles passed through registration, approval, explicit vendor selection, catalog/modifiers, discovery, authenticated cart, idempotent checkout, server pricing, immutable snapshots, owner transitions, driver delivery, final customer/admin reads, suspension enforcement and cleanup. Injected Flutter transport tests cover authentication loss, authorization denial, network/server/malformed responses, stale vendor responses and retry-safe mutations. See `FINAL_VENDOR_LIFECYCLE_EVIDENCE.md`.

## Critical

- G-01 production bakery-owner flow: production entry/status shell and shared live operations are implemented; behavioral 401/403/loading/empty/error coverage and device-level lifecycle proof remain.
- G-02 product modifier domain: Prisma, migration, ownership-gated backend CRUD, shared restaurant/bakery management UI, checkout validation/pricing, customer selection, cart serialization, snapshot rendering, and the required backend selection/ownership/security matrix are implemented. Behavioral Flutter tests and final lifecycle proof remain.
- G-03 immutable order-item snapshots: implemented and backend-tested; end-to-end Flutter historical-order rendering proof remains.
- Authenticated server cart: CRUD, one-vendor/stock/vendor gates, cross-device persistence and local-to-server merge are implemented. Flutter behavioral merge/failure tests remain.
- Signed onboarding uploads: short-lived purpose tokens, MIME/size gates, generated names, rate limits, ownership audit binding and malware-scan hook are implemented. Registration-time consumption/cleanup automation remains.
- Admin finance: real persisted endpoints, filters, pagination, loading/empty/error states, confirmations, RBAC and production build are verified. Dedicated page behavioral tests remain.
- Multi-vendor approval context: backend now returns all entities and supports explicit owned vendor selection. Flutter vendor selector/context propagation to every owner mutation remains.

## Required validation still outstanding

- Both restaurant and bakery modifier checkout lifecycles.
- Historical rendering after product/option mutation.
- Full backend suite is repeatably green (latest run: 28/28 suites, 126/126 tests); remaining cleanup is eliminating diagnostic noise from intentionally exercised conflict paths.
- Full Flutter and admin behavioral suites.
- Separate customer → vendor → driver → delivered lifecycle for each vendor type.
# Verification checkpoint — 2026-07-25

**Launch decision: NO-GO.**

Closed in this checkpoint:

- Explicit Flutter selected-vendor policy, secure restoration, stale-selection recovery, cross-type switching, selected status rendering, request headers, owner-shell selector, app-resume refresh, and scoped page recreation.
- Retry-safe authenticated cart merge checkpointing.
- Durable onboarding upload sessions, transactional registration consumption, reuse/identity/purpose/expiry rejection, and retry-safe expired-file cleanup command.
- Finance direct-route middleware tests, backend authorization/error tests, UI contract tests, confirmation, and persisted reload after commission mutation.
- Backend lint/build and two consecutive complete test runs: **29 suites / 136 tests passed** on both runs.
- Flutter complete suite: **39 tests passed**. Analyze remains at the known baseline of **21 third-party/package warnings**.
- Admin type-check, **26 tests**, and production build passed.

Remaining launch blockers:

1. A new, isolated **restaurant** lifecycle rehearsal has not been recorded through customer registration, modifier checkout, selected-owner receipt, driver delivery, and admin consistency.
2. The existing bakery integration flow passes, but it has not yet been rerun as the newly requested isolated evidence artifact paired with the restaurant rehearsal.
3. Several new Flutter checks are executable regression/contract tests rather than injected transport-level UI/BLoC simulations for every requested timeout, offline, malformed-response, and mutation rollback permutation.

No GO decision is permitted until those items are completed and evidenced.
