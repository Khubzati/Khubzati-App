"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { StoreCard } from "@/components/store-card";
import { fetchStores } from "@/data/store-service";
import { Store, stores as fallbackStores } from "@/data/stores";
import { useLanguage } from "@/i18n/language-context";
import { trackEvent } from "@/lib/analytics";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [featuredStores, setFeaturedStores] = useState<Store[]>(fallbackStores.slice(0, 3));
  const businessHighlights =
    language === "ar"
      ? [
          {
            title: "إطلاق أسرع",
            text: "تجهيز المتجر رقميًا بسرعة مع صفحة واضحة للمنتجات ومسار طلب سهل."
          },
          {
            title: "تشغيل أوضح",
            text: "لوحة عرض منظمة تساعد فريق المتجر على متابعة الطلبات اليومية بدون تعقيد."
          },
          {
            title: "تحويل أعلى",
            text: "تجربة عميل مركزة على القرار السريع: اكتشاف، ثقة، وطلب مباشر."
          }
        ]
      : [
          {
            title: "Faster Launch",
            text: "Get vendors online quickly with clear product visibility and a simple ordering flow."
          },
          {
            title: "Clearer Operations",
            text: "Structured storefronts help teams manage daily demand with less operational friction."
          },
          {
            title: "Higher Conversion",
            text: "A buyer-first experience built for faster decisions: discover, trust, and order."
          }
        ];

  const faqItems =
    language === "ar"
      ? [
          {
            question: "هل كل متجر يظهر في المنصة موثّق؟",
            answer: "نعم، عرض المتاجر يركز على شركاء موثّقين لضمان تجربة طلب موثوقة وشفافة."
          },
          {
            question: "هل يمكن تخصيص تجربة المتجر حسب نوع النشاط؟",
            answer: "نعم، يمكن تكييف المحتوى والباقات حسب مخبز أو مطعم أو كافيه مع نفس الهوية الرقمية."
          },
          {
            question: "هل المنصة مناسبة للتوسع لعدة فروع؟",
            answer: "نعم، بنية العرض مصممة لدعم التوسع تدريجيًا مع الحفاظ على وضوح التجربة للمستخدم."
          }
        ]
      : [
          {
            question: "Are listed stores verified?",
            answer: "Yes. The marketplace prioritizes verified partners to keep ordering trust high."
          },
          {
            question: "Can the storefront be tailored by business type?",
            answer: "Yes. Bakery, restaurant, and cafe experiences can be adapted under one brand system."
          },
          {
            question: "Is the platform scalable for multi-branch operators?",
            answer: "Yes. The structure supports branch growth while preserving a consistent customer experience."
          }
        ];

  useEffect(() => {
    let isMounted = true;

    fetchStores()
      .then((allStores) => {
        if (isMounted) {
          setFeaturedStores(allStores.slice(0, 3));
        }
      })
      .catch(() => {
        // Keep fallback stores when backend is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="stack-lg">
      <section className="hero card">
        <div>
          <p className="eyebrow">{t.home.eyebrow}</p>
          <h1>{t.home.title}</h1>
          <p className="lead">{t.home.description}</p>
          <div className="hero__actions">
            <Link
              href="/stores"
              className="button"
              onClick={() => trackEvent("cta_click", { cta: "hero_explore_stores", page: "home" })}
            >
              {t.home.exploreStores}
            </Link>
            <Link
              href="/app"
              className="button button--ghost"
              onClick={() => trackEvent("cta_click", { cta: "hero_view_app_flow", page: "home" })}
            >
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

      <section className="section card stack">
        <SectionTitle
          eyebrow={language === "ar" ? "قيمة الأعمال" : "Business Value"}
          title={language === "ar" ? "نتائج عملية يمكن قياسها" : "Operational Gains You Can Measure"}
          description={
            language === "ar"
              ? "تصميم التجربة يخدم النمو التجاري: سرعة إطلاق، تشغيل يومي أوضح، وتحويل أفضل."
              : "Experience design aligned to business outcomes: faster launch, cleaner operations, and better conversion."
          }
        />
        <div className="insight-grid">
          {businessHighlights.map((item) => (
            <article key={item.title} className="insight-card">
              <h3>{item.title}</h3>
              <p className="muted">{item.text}</p>
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
          {featuredStores.map((store) => (
            <StoreCard
              key={store.slug}
              store={store}
              onCtaClick={(clickedStore) =>
                trackEvent("store_card_click", {
                  page: "home",
                  store_slug: clickedStore.slug,
                  store_category: clickedStore.category,
                })
              }
            />
          ))}
        </div>
        <div className="button-row">
          <Link
            href="/stores"
            className="button button--ghost"
            onClick={() => trackEvent("cta_click", { cta: "view_all_stores", page: "home" })}
          >
            {language === "ar" ? "عرض كل المتاجر" : "View all stores"}
          </Link>
        </div>
      </section>

      <section className="section card stack">
        <SectionTitle
          eyebrow={language === "ar" ? "الأسئلة الشائعة" : "FAQ"}
          title={language === "ar" ? "أسئلة قبل بدء الشراكة" : "Common Questions Before Onboarding"}
          description={
            language === "ar"
              ? "إجابات سريعة عن الجاهزية، التخصيص، والتوسع."
              : "Quick answers on readiness, customization, and growth."
          }
        />
        <div className="faq-list">
          {faqItems.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p className="muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta card">
        <div>
          <p className="eyebrow">{t.home.nextStepEyebrow}</p>
          <h2>{t.home.nextStepTitle}</h2>
          <p className="muted">{t.home.nextStepDescription}</p>
        </div>
        <Link
          href="/contact"
          className="button"
          onClick={() => trackEvent("cta_click", { cta: "start_onboarding", page: "home" })}
        >
          {t.home.startOnboarding}
        </Link>
      </section>
    </div>
  );
}
