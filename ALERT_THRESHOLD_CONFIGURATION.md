# SLA Alert Threshold Configuration

## Overview
SLA alert evaluation runs in the KPI worker and produces active/resolved alert events with webhook delivery and retries.

## Environment Variables
- `SLA_ALERT_WEBHOOK_URL`: Destination webhook URL
- `SLA_ALERT_WEBHOOK_SECRET`: HMAC secret for signature header
- `SLA_ALERT_WEBHOOK_MAX_ATTEMPTS`: Max delivery attempts (default `6`)
- `SLA_ALERT_WEBHOOK_RETRY_BASE_SECONDS`: Exponential backoff base (default `30`)

## Threshold Variables
- `SLA_QUEUE_LAG_SECONDS` (default `300`)
- `SLA_STUCK_PAYOUT_COUNT` (default `5`)
- `SLA_STUCK_PAYOUT_HOURS` (default `24`)
- `SLA_AGING_DISPUTE_COUNT` (default `5`)
- `SLA_AGING_DISPUTE_HOURS` (default `48`)
- `SLA_HIGH_REFUND_RATIO` (default `0.08`)
- `SLA_ASSIGNMENT_BREACH_COUNT` (default `1`)
- `SLA_DEAD_LETTER_GROWTH_24H` (default `20`)

## Runtime Rule Storage
- Rules table: `sla_alert_rules`
- Alerts table: `sla_alert_events`
- Delivery queue: `sla_alert_deliveries`
- Attempt audit: `sla_alert_delivery_attempts`
- Dead letters: `sla_alert_dead_letters`

## Signature Headers
- `x-khubzati-signature`
- `x-khubzati-timestamp`
- `x-khubzati-event`

Signature format: `sha256(timestamp + '.' + requestBody)` using `SLA_ALERT_WEBHOOK_SECRET`.
