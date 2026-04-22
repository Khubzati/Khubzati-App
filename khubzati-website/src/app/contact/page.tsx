"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { useLanguage } from "@/i18n/language-context";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="stack-lg">
      <section className="section card stack">
        <SectionTitle eyebrow={t.contact.eyebrow} title={t.contact.pageTitle} description={t.contact.pageDescription} />
      </section>

      <section className="section contact-grid">
        <article className="card stack contact-card">
          <h3>{t.contact.teamTitle}</h3>
          <p className="muted">{t.contact.teamDescription}</p>
          <p>
            Email: <a href="mailto:partners@khubzati.com">partners@khubzati.com</a>
          </p>
          <p>
            {t.contact.salesLine}: <a href="tel:+962790000000">+962 79 000 0000</a>
          </p>
          <Link href="/stores" className="button button--ghost">
            {t.contact.viewExamples}
          </Link>
        </article>

        <article className="card stack contact-card">
          <h3>{t.contact.prepareTitle}</h3>
          <ul className="list">
            {t.contact.preparePoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
