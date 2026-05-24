# E2E Test Matrix

Date: 2026-05-09

## Legend
- Automated: covered by executable tests
- Partial: partially automated, manual/staging still required
- Pending: not yet automated in this repository set

## Customer
| Flow | Status | Evidence |
|---|---|---|
| Auth token validity/expiry | Automated | `qa.reliability.test.js` |
| Checkout payment initiation | Automated | `payments.test.js` |
| Payment webhook completion + duplicate webhook | Automated | `payments.test.js`, `qa.reliability.test.js` |
| Refund request + status progression | Automated | `finance.test.js`, `qa.reliability.test.js` |
| Dispute creation | Automated | `finance.test.js` |
| Order list access under concurrency | Automated | `load.smoke.test.js` |
| Offline mobile UX behavior | Partial | Flutter widget/domain tests exist; real offline runtime still manual |

## Vendor
| Flow | Status | Evidence |
|---|---|---|
| Vendor commission snapshot on orders | Automated | `finance.test.js` |
| Payout request flow | Automated | `finance.test.js`, `qa.reliability.test.js` |
| Payout over-balance rejection | Automated | `qa.reliability.test.js` |
| Vendor access-control boundaries | Automated | `security.abuse.test.js` |

## Driver
| Flow | Status | Evidence |
|---|---|---|
| Assignment accept lifecycle | Automated | `driver.delivery.test.js` |
| Status transitions (picked_up -> out_for_delivery -> delivered/failed) | Automated | `driver.delivery.test.js`, `delivery-state-machine.unit.test.js` |
| Race condition on concurrent accept | Automated | `qa.reliability.test.js` |
| Driver list endpoints under concurrent load | Automated | `load.smoke.test.js` |

## Admin
| Flow | Status | Evidence |
|---|---|---|
| Commission config update | Automated | `finance.test.js` |
| Refund approve/process | Automated | `finance.test.js` |
| Dispute resolve | Automated | `finance.test.js` |
| Payout approve/mark paid | Automated | `finance.test.js` |
| RBAC enforcement on admin-only operations | Automated | `security.abuse.test.js` |

## Cross-Cutting
| Area | Status | Evidence |
|---|---|---|
| Notification enqueue/process retry-safe workflow | Automated | `notifications.queue.test.js` |
| Upload validation/type-path security | Automated | `upload.validation.test.js` |
| Build/lint/analyze gates (web/admin/flutter/backend) | Automated | CI commands run and passed |
| End-user browser/mobile full UI click-through E2E | Partial | API-level E2E strong; full UI driver automation still pending |

