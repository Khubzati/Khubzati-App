# Khubzati Production Checklist

This checklist tracks the multi-repo production baseline for:

- `Khubzati-backend-apis`
- `admin`
- `khubzati-website`
- `khubzati-app`

## 1) Quality Gates

### Backend

```bash
cd Khubzati-backend-apis
npm ci
npm run lint
npm test
npm run build
```

### Admin

```bash
cd admin
npm ci
npm run lint
npm run build
```

### Website

```bash
cd khubzati-website
npm ci
npm run lint
npm run build
```

### Flutter app

```bash
cd khubzati-app
flutter pub get
flutter analyze
flutter test
```

## 2) CI/CD Workflows Added

Each repo now has a GitHub Actions workflow at:

- `Khubzati-backend-apis/.github/workflows/ci.yml`
- `admin/.github/workflows/ci.yml`
- `khubzati-website/.github/workflows/ci.yml`
- `khubzati-app/.github/workflows/ci.yml`

Triggers:

- `pull_request` to `main`, `master`, `develop`
- `push` to `main`, `master`, `develop`

## 3) Backend Deployment Notes

1. Configure required production env vars:
   - `NODE_ENV=production`
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
   - `CORS_ORIGINS` (comma-separated allowlist)
   - `UPLOAD_STORAGE_DRIVER` (default `local`)
   - `UPLOAD_MAX_FILE_SIZE_BYTES` (default `10485760`)
2. Optional integrations:
   - Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PAYMENT_MODE`
   - Firebase, Twilio, SMTP, Redis as needed
3. Run migrations:

```bash
cd Khubzati-backend-apis
npm run db:migrate
```

4. Start app:

```bash
npm start
```

5. Verify probes:
   - `GET /health` (liveness)
   - `GET /ready` (readiness + DB connectivity)

## 4) Migration Direction

- Active runtime stack: **Prisma**
- Primary migration commands:
  - `npm run db:migrate` (production deploy)
  - `npm run db:migrate:dev` (local development)
  - `npm run db:generate`
- Legacy Sequelize artifacts remain as temporary historical compatibility assets and are not the production migration path.

## 5) Upload Storage Notes

- Current production-safe baseline keeps validated local uploads (`UPLOAD_STORAGE_DRIVER=local`).
- `uploads/` is git-ignored.
- Code includes safe filenames, file type checks, and max size limits.
- Future: implement object storage adapter (S3/R2/GCS) behind `UPLOAD_STORAGE_DRIVER`.

## 6) Business-Complete Gaps (Post-Baseline)

Before calling the platform fully business-complete, prioritize:

- refund + dispute workflows
- commission/payout ledger and settlement tooling
- driver proof-of-delivery and dispatch robustness
- immutable admin audit logs
