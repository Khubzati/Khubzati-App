"use client";

import { SectionTitle } from "@/components/section-title";
import { StoreExplorer } from "@/components/store-explorer";
import { useLanguage } from "@/i18n/language-context";

export default function StoresPage() {
  const { t } = useLanguage();

  return (
    <div className="stack-lg">
      <section className="section card stack">
        <SectionTitle eyebrow={t.stores.eyebrow} title={t.stores.pageTitle} description={t.stores.pageDescription} />
      </section>

      <StoreExplorer />
    </div>
  );
}
