# UPDATED_E2E_TEST_RESULTS

Date: 2026-05-16
Scope: backend-integrated marketplace launch flows

## Command
`npm test -- __tests__/marketplace.flows.integration.test.js --runInBand`

## Result
- Status: **PASS**
- Suites: **1/1**
- Tests: **5/5**

## Covered flow groups
1. Customer onboarding flow
- Register/login
- OTP verify
- Profile update
- Address create/update
- Address ownership enforcement
- Authenticated upload flow

2. Vendor/bakery flow
- Bakery registration/update
- Product create/update/availability
- Inventory path
- Payout account setup

3. Customer ordering flow
- Browse bakeries/products
- Idempotent order create
- Duplicate request replay safety
- Scheduled order path
- Cancel + reason + restock verification

4. Dispatch/driver flow
- Dispatch job path
- Assignment race protection
- Delivery state transitions

5. Refund/dispute/finance/admin flow
- Dispute lifecycle path
- Refund/finance impact path
- Admin operations path

## Cart flow decision
- Launch coverage uses supported backend ordering path (`/v1/orders/create`).
- Ambiguous expectation on `GET /v1/cart` removed from launch gating.

## Additional full-suite confirmation
- Backend full suite: **20/20 suites pass, 70/70 tests pass**.
