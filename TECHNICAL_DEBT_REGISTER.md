# Technical Debt Register

This register contains reconciled non-blockers only. Confirmed launch blockers are tracked in `FINAL_LAUNCH_DECISION.md` and intentionally are not duplicated here.

| Item | Final status | Evidence | Priority | Exit criterion |
|---|---|---|---|---|
| Quarantined DI imports and registrations | False positive as an overwrite; real maintenance debt | Distinct GetIt/Dart types; no wrong live resolution or startup instantiation observed | P2 | Quarantine sources are outside generated production DI and release artifact inspection is clean |
| Unused Retrofit/Dio scaffolding | Partially confirmed | 307 measured application call sites use ApiClient; no production call site invokes the generated Retrofit endpoint | P2 | One supported client stack remains and all transport tests pass |
| Unused Checkout Bloc | Confirmed debt | Checkout transport executed through CheckoutService while no runtime/test constructed CheckoutBloc | P1 | Bloc is removed or becomes the single tested orchestration path |
| Source-string tests | Partially confirmed | 36 of 60 executed tests (60%) inspect source text; only 21 (35%) execute transport/widget behavior | P1 | Routing, auth, checkout, cart and owner-shell assertions are behavioral/widget/integration tests |
| Localization mixing | Partially confirmed | 70.7% easy_localization, 20.6% inline helpers, 8.7% literal Text call-site proxy; translation contracts passed | P2 | User-visible strings use translation keys and both locales pass widget snapshots/smokes |
| Customer-home reachability coverage | Not reproducible | No execution proved the alleged unreachable state | P1 verification | Customer login-to-home cold/warm/resume smoke passes |
| Stage/production host separation | Not reproducible | No completed stage-versus-prod runtime request trace | P1 verification | Signed artifacts record distinct approved hosts, or shared host is explicitly approved |
| Upload durability on deployed topology | Not reproducible | No ephemeral/multi-replica production execution | P1 verification | Upload survives restart/deploy and is visible consistently across replicas |
| Admin browser-token exposure | Not reproducible | No runtime exfiltration was executed | P1 security hardening | HttpOnly Secure session is used and browser security integration tests pass |
| Admin fabricated rendering cookie | Not reproducible | Fabricated-cookie request returned 500, not a protected page; unauthenticated request redirected | P2 | Middleware integration test rejects malformed/unsigned sessions without 500 |
| Malware scanner fail-open behavior | Not reproducible | No deployed scanner outage/detection execution | P1 verification | Malware fixture is quarantined and scanner outage fails closed |
| Active upload content/origin isolation | Not reproducible | No browser active-content execution completed | P2 | Deployed MIME/disposition/CSP/origin tests pass |
| Rate-limit multi-instance behavior | Not reproducible | No two-instance Redis-outage run | P1 verification | Shared limiter passes abuse test and defined outage policy |
| Index/full-scan scalability concern | Not reproducible | No production-volume EXPLAIN/latency evidence | P2 | Production-shaped query plans meet documented latency budgets |
| Runtime auth DDL | Not reproducible | Missing-schema scenario was not executed | P2 | Empty-database migration/startup test passes without request-time schema mutation |
| Admin CI gate completeness | Not reproducible as a runtime defect | No executable failure attributed to omitted admin gates | P1 release engineering | Type-check, tests and build run green in CI |
| Backend clean-runner database setup | Not reproducible | No successful isolated clean-runner reproduction was completed | P1 release engineering | Fresh runner provisions DB, applies migrations and passes the suite |
| Immutable deployment artifact | Not reproducible | No production packaging runtime existed in the evidence set | P1 operations | Versioned artifact runs non-root with readiness/liveness checks and rollback proof |
