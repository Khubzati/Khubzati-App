"use client";

import { SectionTitle } from "@/components/section-title";
import { useLanguage } from "@/i18n/language-context";

export function StoreDirectoryIntro() {
  const { t } = useLanguage();
  return <section className="section card stack"><SectionTitle eyebrow={t.stores.eyebrow} title={t.stores.pageTitle} description={t.stores.pageDescription} /></section>;
}
