# Khubzati 90-Day Risk Register

Date: 2026-05-15

| ID | Risk | Area | Severity | Status | Mitigation in this pass | Residual Risk |
|---|---|---|---|---|---|---|
| R1 | Auth bypass via fallback OTP/Firebase logic | Security | Critical | Mitigated | Removed fallback branches, added strict verify + security events | Low |
| R2 | Unauthenticated uploads + missing ownership checks | Security | Critical | Mitigated | Enforced auth, ownership checks, upload audit logs | Medium (legacy clients must authenticate) |
| R3 | Cross-user address takeover via upsert | Data isolation | Critical | Mitigated | Converted to owner-scoped update + 404 on missing | Low |
| R4 | False-success admin paths masking failures | Operations | High | Mitigated | Removed fallback-success behavior on not-found | Low |
| R5 | Duplicate order creation on retries | Revenue/ops | Critical | Mitigated | Added idempotency key store + replay/progress handling | Medium (needs client adoption of keys) |
| R6 | Inventory mismatch after cancel | Marketplace ops | Critical | Mitigated | Added transactional restock + inventory movement ledger | Medium (legacy flows should be stress-tested) |
| R7 | Queue terminal failures lose context | Reliability | High | Mitigated | Added notification dead-letter table + metrics endpoints | Low |
| R8 | Recurring worker multi-instance race | Reliability | High | Mitigated | Added PostgreSQL advisory lock around renewal loop | Medium (single DB lock domain) |
| R9 | Admin/API contract mismatch (disputes/commission) | Product ops | High | Mitigated | Aligned admin payloads + backend compatibility layer | Low |
| R10 | Missing scale entities for multi-city dispatch + finance ops | Scale | Critical | Mitigated (foundation) | Added schema + baseline APIs for slots/zones/shifts/dispatch/settlement/ledger | Medium (advanced optimization pending) |
| R11 | Missing client contract observability | Product quality | High | Mitigated | Added contract version + client error ingestion endpoints | Medium (client instrumentation rollout needed) |
| R12 | RelationMode=prisma index pressure | Performance | Medium | Open | Added indexes for new high-volume entities | Medium (needs ongoing index tuning) |
