"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { useLanguage } from "@/i18n/language-context";

export default function AppRoutePage() {
  const { t } = useLanguage();

  return (
    <div className="stack-lg">
      <section className="section card stack">
        <SectionTitle
          eyebrow={t.appRoutes.eyebrow}
          title={t.appRoutes.pageTitle}
          description={t.appRoutes.pageDescription}
        />
      </section>

      <section className="section flow-grid">
        <article className="card stack">
          <h3>{t.appRoutes.customerTitle}</h3>
          <ol className="numbered-list">
            {t.appRoutes.customerFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="card stack">
          <h3>{t.appRoutes.storeTitle}</h3>
          <ol className="numbered-list">
            {t.appRoutes.storeFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="section card stack">
        <h2>{t.appRoutes.supportTitle}</h2>
        <ul className="list">
          {t.appRoutes.supportPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="button-row">
          <Link href="/stores" className="button button--ghost">
            {t.appRoutes.openStores}
          </Link>
          <Link href="/contact" className="button">
            {t.appRoutes.startOnboarding}
          </Link>
        </div>
      </section>
    </div>
  );
}
