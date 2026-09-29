# B2B Runtime Validation

## Executed evidence

| Check | Evidence | Result |
|---|---|---|
| Restaurant buyer Flutter entry | Pre-restoration live authentication landed on `RestaurantOwnerHomeRoute`, which loaded `/restaurant/profile`, `/bakeries`, Bakery details and buyer navigation | PASS for buyer discovery shell |
| Restaurant seller capability | Live isolated Restaurant owner successfully called `POST /v1/restaurant/products`; product persisted with `restaurantId` | FAIL — prohibited capability exists |
| Symmetric Customer lifecycle | Existing executable rehearsal places Customer cart/checkout orders against Restaurant and Bakery branches | FAIL — wrong actor model is protected by tests |
| Bakery supplier catalog | Existing Bakery product/availability execution passes | PASS |
| Explicit Restaurant buyer on Order | Schema uses generic `Order.userId`; no required Restaurant buyer FK | FAIL |
| Explicit Bakery supplier on Order | `bakeryId` is optional and mutually alternative with `restaurantId` | FAIL |
| Driver Bakery pickup / Restaurant destination | Delivery assignment does not encode both required business endpoints | FAIL |
| Restaurant receipt confirmation | No proven B2B receipt-confirmation contract | FAIL |
| Cross-Bakery / cross-Restaurant B2B isolation | Generic vendor isolation exists, but the required buyer/supplier pair is not modeled | FAIL |
| Migration safety | Wrong-model ownership constraint is in an already-applied migration; no historical file was edited | PASS for audit safety; corrective migration required later |

## Protection-test status

Focused executable B2B tests were not added because the current schema cannot express the required Restaurant-buyer/Bakery-supplier order, and adding tests that assert current symmetric behavior would further entrench the wrong model. The required test cases in `B2B_BUSINESS_RULES.md` must accompany the corrective schema/API implementation and must be green before release.

## Final decision

**BUSINESS FLOW STILL INCORRECT — NO-GO**

The limited code/document/data changes from the immediately preceding validation were restored, but runtime and historical git evidence show that the backend still implements the wrong core transaction. Documentation cleanup alone is insufficient.
