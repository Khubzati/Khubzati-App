"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { useLanguage } from "@/i18n/language-context";
import { trackEvent } from "@/lib/analytics";

export default function ContactPage() {
  const { language, t } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div className="stack-lg">
      <section className="section card stack">
        <SectionTitle eyebrow={t.contact.eyebrow} title={t.contact.pageTitle} description={t.contact.pageDescription} />
      </section>

      <section className="section contact-grid">
        <article className="card stack contact-card">
          <p className="eyebrow">{isArabic ? "للمتاجر المحلية" : "For local businesses"}</p>
          <h2>{isArabic ? "خلّينا نحكي عن متجرك" : "Let’s talk about your store"}</h2>
          <p className="muted">
            {isArabic
              ? "تواصل معنا للتعرّف على الانضمام إلى خبزاتي. شاركنا نوع نشاطك وموقعه وسنرد عليك بالتفاصيل المتاحة."
              : "Get in touch to discuss joining Khubzati. Tell us what kind of business you run and where it is, and we’ll share the available next steps."}
          </p>
          <a
            className="button"
            href={`mailto:khubzati.dgh@gmail.com?subject=${encodeURIComponent(isArabic ? "استفسار شراكة مع خبزاتي" : "Khubzati partnership inquiry")}`}
            onClick={() => trackEvent("lead_contact_click", { method: "email", page: "contact" })}
          >
            {isArabic ? "راسل فريق الشراكات" : "Email the partnerships team"}
          </a>
          <p>
            <a href="mailto:khubzati.dgh@gmail.com" onClick={() => trackEvent("lead_contact_click", { method: "email", page: "contact" })}>
              khubzati.dgh@gmail.com
            </a>
          </p>
          <p>
            {t.contact.salesLine}: {" "}
            <a href="tel:+962798913567" onClick={() => trackEvent("lead_contact_click", { method: "phone", page: "contact" })}>
              +962 79 891 3567
            </a>
          </p>
        </article>

        <article className="card stack contact-card">
          <h3>{isArabic ? "ماذا تذكر في رسالتك؟" : "What to include in your message"}</h3>
          <ul className="list">
            <li>{isArabic ? "اسم المتجر ونوع النشاط" : "Store name and business type"}</li>
            <li>{isArabic ? "المدينة أو منطقة العمل" : "City or service area"}</li>
            <li>{isArabic ? "أفضل طريقة ووقت للتواصل" : "Your preferred way and time to be contacted"}</li>
          </ul>
          <p className="muted">
            {isArabic
              ? "لا يوجد نموذج تقديم داخل الموقع حاليًا؛ البريد والهاتف أعلاه هما قنوات التواصل المتاحة."
              : "There is no application form on the website yet. Email and phone are the available contact channels."}
          </p>
          <Link href="/stores" className="button button--ghost" onClick={() => trackEvent("cta_click", { cta: "contact_view_stores", page: "contact" })}>
            {isArabic ? "استكشف المتاجر المتاحة" : "Explore available stores"}
          </Link>
        </article>
      </section>
    </div>
  );
}
