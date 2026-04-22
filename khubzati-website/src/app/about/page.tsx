"use client";

import { SectionTitle } from "@/components/section-title";
import { useLanguage } from "@/i18n/language-context";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="stack-lg">
      <section className="section card stack">
        <SectionTitle
          eyebrow={t.about.whatEyebrow}
          title={t.about.whatTitle}
          description={t.about.whatDescription}
        />
        <p className="lead compact">{t.about.whatParagraph}</p>
      </section>

      <section className="section stack">
        <SectionTitle
          eyebrow={t.about.principlesEyebrow}
          title={t.about.principlesTitle}
          description={t.about.principlesDescription}
        />

        <div className="feature-grid">
          {t.about.principles.map((item) => (
            <article key={item.title} className="card feature-card">
              <h3>{item.title}</h3>
              <p className="muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section card stack">
        <SectionTitle
          eyebrow={t.about.valueEyebrow}
          title={t.about.valueTitle}
          description={t.about.valueDescription}
        />

        <ul className="list">
          {t.about.valuePoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
