# Authorization and Revocation Evidence

`src/middleware/auth.js` verifies the signature and then reloads the authoritative user on every protected request. A missing/deleted user returns 401; role mismatch, inactive required actor, or suspended selected vendor returns 403. Route authorization consumes the reloaded role rather than the JWT role.

Executable tests in `__tests__/authorization.revocation.test.js` establish:

- active administrator: 200;
- same administrator token after deletion: 401 on the next request;
- old administrator token after authoritative role downgrade: 403;
- bakery-owner token after selected bakery suspension: 403;
- active driver token: 200, then 401 after deletion and 403 after role change;
- driver password authentication returns a driver user and signed token.

The complete-suite run initially exposed that password login was incorrectly gated by the presence of stored OTP fields. Moving the OTP-presence check into the OTP-only branch made password authentication independent of OTP state. The isolated authorization suite then passed 6/6, followed by two green complete-suite runs.

Payout-account trust is separated from vendor mutation. Vendor-supplied `isVerified: true` remains false, vendor access to the verification transition returns 403, an administrator can verify, and one audit record is persisted.

Refresh-token disposition: Option B was selected. Flutter no longer stores or sends a refresh token and no interceptor targets the absent endpoint. Therefore there is no refresh session capable of preserving revoked authority; an access-token failure clears local session state once and sends the session-expired event once.
