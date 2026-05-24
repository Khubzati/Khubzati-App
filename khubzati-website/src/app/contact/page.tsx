"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { useLanguage } from "@/i18n/language-context";
import { trackEvent } from "@/lib/analytics";

export default function ContactPage() {
  const { language, t } = useLanguage();
  const offerTiers =
    language === "ar"
      ? [
          {
            name: "Starter",
            target: "للمتاجر التي تبدأ رقميًا",
            points: ["إعداد ملف المتجر", "تجهيز المسار الأساسي", "تدريب تشغيل أولي"],
          },
          {
            name: "Growth",
            target: "للمتاجر التي تريد رفع الطلبات",
            points: ["تحسين الظهور", "تحسين تجربة الطلب", "تقارير أداء دورية"],
          },
          {
            name: "Multi-Branch",
            target: "للتوسع لعدة فروع",
            points: ["هيكلة فروع موحدة", "دعم تشغيل متعدد", "متابعة KPI على مستوى الفروع"],
          },
        ]
      : [
          {
            name: "Starter",
            target: "For stores launching digitally",
            points: ["Store profile setup", "Core ordering flow", "Initial operations onboarding"],
          },
          {
            name: "Growth",
            target: "For teams focused on order growth",
            points: ["Visibility optimization", "Order journey improvements", "Recurring performance reviews"],
          },
          {
            name: "Multi-Branch",
            target: "For expanding operators",
            points: ["Branch-ready structure", "Multi-location operations support", "KPI tracking across branches"],
          },
        ];

  const slaItems =
    language === "ar"
      ? [
          "رد أولي خلال يوم عمل واحد.",
          "مشاركة خطة بدء واضحة خلال 3 أيام عمل.",
          "تعيين مسؤول متابعة للحساب بعد بدء التفعيل.",
        ]
      : [
          "Initial response within 1 business day.",
          "Clear onboarding plan shared within 3 business days.",
          "Dedicated account follow-up once activation starts.",
        ];

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
            Email:{" "}
            <a
              href="mailto:khubzati.dgh@gmail.com"
              onClick={() => trackEvent("lead_contact_click", { method: "email", page: "contact" })}
            >
              khubzati.dgh@gmail.com
            </a>
          </p>
          <p>
            {t.contact.salesLine}:{" "}
            <a
              href="tel:+962790000000"
              onClick={() => trackEvent("lead_contact_click", { method: "phone", page: "contact" })}
            >
              +962798913567
            </a>
          </p>
          <Link
            href="/stores"
            className="button button--ghost"
            onClick={() => trackEvent("cta_click", { cta: "contact_view_examples", page: "contact" })}
          >
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

      <section className="section card stack">
        <SectionTitle
          eyebrow={language === "ar" ? "باقات الشراكة" : "Offer Tiers"}
          title={language === "ar" ? "اختر مستوى الدعم المناسب لنمو متجرك" : "Choose the right support tier for your store growth"}
          description={
            language === "ar"
              ? "بنية واضحة تساعدك على البدء بسرعة والتوسع بدون ارتباك تشغيلي."
              : "Structured engagement models to launch faster and scale with less operational friction."
          }
        />
        <div className="tier-grid">
          {offerTiers.map((tier) => (
            <article key={tier.name} className="tier-card">
              <h3>{tier.name}</h3>
              <p className="muted">{tier.target}</p>
              <ul className="list">
                {tier.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <a
                href="mailto:khubzati.dgh@gmail.com?subject=Khubzati%20Onboarding%20-%20Tier%20Request"
                className="button button--small"
                onClick={() => trackEvent("tier_select", { tier: tier.name, page: "contact" })}
              >
                {language === "ar" ? "طلب هذه الباقة" : "Request this tier"}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section card stack">
        <SectionTitle
          eyebrow={language === "ar" ? "SLA" : "Response SLA"}
          title={language === "ar" ? "التزامنا بزمن الاستجابة" : "Our Response Commitments"}
          description={
            language === "ar"
              ? "وضوح التوقعات من أول تواصل حتى بدء التنفيذ."
              : "Clear expectations from first contact to kickoff."
          }
        />
        <ul className="list">
          {slaItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
