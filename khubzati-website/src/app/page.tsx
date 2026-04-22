"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { StoreCard } from "@/components/store-card";
import { stores } from "@/data/stores";
import { useLanguage } from "@/i18n/language-context";

export default function HomePage() {
  const { language, t } = useLanguage();

  return (
    <div className="stack-lg">
      <section className="hero card">
        <div>
          <p className="eyebrow">{t.home.eyebrow}</p>
          <h1>{t.home.title}</h1>
          <p className="lead">{t.home.description}</p>
          <div className="hero__actions">
            <Link href="/stores" className="button">
              {t.home.exploreStores}
            </Link>
            <Link href="/app" className="button button--ghost">
              {t.home.appMap}
            </Link>
          </div>
        </div>

        <div className="hero__stats">
          <article>
            <p>90 sec</p>
            <span>{t.home.statOneLabel}</span>
          </article>
          <article>
            <p>4.7+</p>
            <span>{t.home.statTwoLabel}</span>
          </article>
          <article>
            <p>6 cities</p>
            <span>{t.home.statThreeLabel}</span>
          </article>
        </div>
      </section>

      <section className="section stack">
        <SectionTitle eyebrow={t.home.whyEyebrow} title={t.home.whyTitle} description={t.home.whyDescription} />

        <div className="feature-grid">
          {t.home.highlights.map((item, index) => (
            <article key={item} className="card feature-card">
              <h3>{language === "ar" ? `ميزة ${index + 1}` : `Feature ${index + 1}`}</h3>
              <p className="muted">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section stack">
        <SectionTitle
          eyebrow={t.home.topStoresEyebrow}
          title={t.home.topStoresTitle}
          description={t.home.topStoresDescription}
        />

        <div className="store-grid">
          {stores.slice(0, 3).map((store) => (
            <StoreCard key={store.slug} store={store} />
          ))}
        </div>
      </section>

      <section className="cta card">
        <div>
          <p className="eyebrow">{t.home.nextStepEyebrow}</p>
          <h2>{t.home.nextStepTitle}</h2>
          <p className="muted">{t.home.nextStepDescription}</p>
        </div>
        <Link href="/contact" className="button">
          {t.home.startOnboarding}
        </Link>
      </section>
    </div>
  );
}
