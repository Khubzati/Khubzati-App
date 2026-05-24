# Khubzati Website

A dedicated customer-facing and partner-facing web experience for Khubzati, built with Next.js.

## Included routes

- `/` Home and value proposition
- `/about` What Khubzati is and why it exists
- `/stores` Store explorer with search and category filtering
- `/stores/[slug]` Dynamic store detail route pages
- `/app` Customer app + store app route map
- `/contact` Partnership onboarding information

## Language behavior

- Default language is Arabic (`ar`) with RTL direction.
- Users can switch between Arabic and English from the top navbar.
- Language preference is saved in browser local storage.

## Run locally

```bash
cd /Users/user/Desktop/Khubzati-App-Latest/khubzati-website
npm install
npm run dev
```

Website runs on `http://localhost:3004` by default.

## CI Gate

```bash
npm ci
npm run lint
npm run build
```
