"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-context";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <section className="section card stack">
      <p className="eyebrow">404</p>
      <h1>{t.notFound.title}</h1>
      <p className="muted">{t.notFound.description}</p>
      <Link href="/stores" className="button">
        {t.notFound.goStores}
      </Link>
    </section>
  );
}
