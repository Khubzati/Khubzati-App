export function getSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  const fallback = "https://khubzati.com";
  const candidate = (configured || fallback).trim();

  return candidate.replace(/\/+$/, "");
}
