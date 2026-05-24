# Deployment Guide

## Topology
- Backend API (Node/Express + Prisma/PostgreSQL)
- Admin app (Next.js)
- Website app (Next.js)
- Flutter mobile client

## Backend Deployment
1. Build and deploy backend.
2. Run database migrations:
   - `cd Khubzati-backend-apis`
   - `npm run db:migrate`
3. Generate client if needed in CI build stage:
   - `npm run db:generate`
4. Start app:
   - `npm start`

## Frontend Deployment
- Admin:
  - `cd admin`
  - `npm ci && npm run build`
- Website:
  - `cd khubzati-website`
  - `npm ci && npm run build`

## Mobile Validation
- `cd khubzati-app`
- `flutter analyze`
- `flutter test`

## Smoke Test Matrix
- Auth login/register
- Vendor browse/search
- Checkout (Stripe/COD)
- Order status progression
- Driver accept -> deliver with proof
- Refund request and processing
- Dispute open/respond/resolve
- Payout request and admin settlement
- Notification job enqueue/process
- Reconciliation report access
