# Financial Integrity Evidence

## Executed regression evidence

Targeted command:

```text
npm test -- --runInBand __tests__/authorization.revocation.test.js __tests__/finance.test.js __tests__/qa.reliability.test.js __tests__/customer.cart.test.js
```

Result: 4 suites passed, 33 tests passed.

Observed postconditions from executable tests:

- Stripe sequential and concurrent delivery of one signed provider event leaves exactly one webhook receipt and one `FinancialTransaction` side effect.
- A pre-seeded duplicate downstream side-effect key forces HTTP 500 and the enclosing transaction rolls back the webhook receipt to zero.
- Concurrent payouts of 6 against balance 10 yield one 201 and one 400; reservations never exceed 10.
- Two valid payouts of 5 against balance 10 both succeed. Separate vendors do not share a lock or balance.
- A repeated payout idempotency key resolves to the same payout.
- Sequential and concurrent paid transitions leave exactly one settlement transaction and one vendor-ledger entry. `rejected -> paid` returns 409.
- Concurrent refunds of 6 against refundable total 10 yield one 201 and one 400. Exact remaining value, partial liability, idempotent retry, and rejected-liability release all pass.

## Enforcement path

The migration adds unique keys for refund creation, payout creation, financial side effects, and ledger side effects. Route transactions acquire stable PostgreSQL advisory locks before calculating authoritative aggregates. The Stripe event receipt and all downstream mutations commit or roll back together.

Test-created financial, refund, payout, receipt, and ledger records are removed by suite cleanup. Expected error logs in the run are assertions of rejected over-reservation, invalid transition, unique-key rollback, and concurrent assignment behavior—not suite failures.

