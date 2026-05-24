# Environment Variables

## Required (Production)
- `NODE_ENV=production`
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `CORS_ORIGINS`

## Backend Core
- `APP_PORT`
- `ENABLE_STUB_RESPONSES=false` (must never be true in production)
- `APP_BASE_URL`

## Payments
- `PAYMENT_MODE` (`sandbox`/`live`)
- `STRIPE_SECRET_KEY` (required in live mode)
- `STRIPE_WEBHOOK_SECRET` (required in live mode)
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`
- `ENABLE_STRIPE_CURRENCY_FALLBACK`
- `STRIPE_FALLBACK_CURRENCY`
- `STRIPE_FALLBACK_RATE`
- `ENABLE_NOON_PAYMENTS` (keep false unless fully implemented)

## Uploads/Storage
- `UPLOAD_STORAGE_DRIVER` (`local` currently active)
- `UPLOAD_MAX_FILE_SIZE_BYTES`

## Notifications
- Firebase credentials (`FIREBASE_SERVICE_ACCOUNT_PATH` or env-based credentials)
- Optional SMS/Email credentials:
  - Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
  - SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`

## Operational
- `REDIS_URL` (optional; future queue/rate-limiting scaling)
- Admin bootstrap:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
