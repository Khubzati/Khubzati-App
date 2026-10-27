"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionTitle } from "@/components/section-title";
import { StoreCard } from "@/components/store-card";
import BlurText from "@/components/reactbits/BlurText";
import LightRays from "@/components/reactbits/LightRays";
import StarBorder from "@/components/reactbits/StarBorder";
import { Store } from "@/data/stores";
import { useLanguage } from "@/i18n/language-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { trackEvent } from "@/lib/analytics";

export function HomeExperience({ stores, siteUrl }: { stores: Store[] | null; siteUrl: string }) {
  const { language, t } = useLanguage();
  const ar = language === "ar";
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-motion-reveal]").forEach((section) => {
        gsap.set(section, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(section, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
            const cards = section.querySelectorAll<HTMLElement>(
              ".category-card, .step-card, .benefit-card, .store-card"
            );
            if (cards.length) {
              gsap.fromTo(
                cards,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.08, delay: 0.05 }
              );
            }
          },
        });
      });
    });

    // Recalculate trigger positions once layout/images settle.
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [reduced]);
  const categories = [
    {
      kind: "bakery",
      name: ar ? "مخابز الحي" : "Neighborhood bakeries",
      detail: ar ? "تصفّح المخابز المتاحة على خبزاتي." : "Browse bakeries currently listed on Khubzati.",
      image: "/images/hero-bread.png",
    },
    {
      kind: "restaurant",
      name: ar ? "مطاعم محلية" : "Local restaurants",
      detail: ar ? "اكتشف المطاعم المدرجة في دليل المتاجر." : "Explore restaurants listed in the store directory.",
      image: "/images/pita-oven.png",
    },
  ] as const;
  const steps = ar
    ? [
        ["01", "اكتشف", "تصفّح المخابز والمطاعم الظاهرة في دليل المتاجر."],
        ["02", "تعرّف على المتجر", "اقرأ التفاصيل وساعات العمل والمنتجات المتاحة عند عرضها."],
        ["03", "تابع عبر التطبيق", "استخدم تطبيق خبزاتي لإتمام الطلب عندما تكون الخدمة متاحة."],
      ]
    : [
        ["01", "Discover", "Browse the bakeries and restaurants shown in the store directory."],
        ["02", "Choose a store", "Review its details, hours, and listed products when available."],
        ["03", "Continue in the app", "Use the Khubzati app to place an order where the service is available."],
      ];
  const benefits = ar
    ? [
        ["قريب من الناس", "دليل واحد يساعد العملاء على اكتشاف متاجر الطعام المحلية."],
        ["تفاصيل أوضح", "صفحات المتاجر تعرض المعلومات المتاحة من بيانات الشريك."],
        ["مصمم للمتاجر", "تجربة رقمية تربط اكتشاف المتجر بمسارات تطبيق خبزاتي."],
      ]
    : [
        ["Rooted in the neighborhood", "One place to discover local food businesses."],
        ["Clear store details", "Store pages show information provided through partner data."],
        ["Built for local businesses", "A digital storefront connected to Khubzati’s app journeys."],
      ];
  const faqs = ar
    ? [
        ["كيف أجد المتاجر المتاحة؟", "افتح دليل المتاجر لتصفح المخابز والمطاعم التي تظهر حاليًا على المنصة."],
        ["هل أستطيع إتمام الطلب من الموقع؟", "الموقع مخصص للاكتشاف ومعلومات المتاجر. عند توفر الطلب، أكمله عبر تطبيق خبزاتي."],
        ["كيف ينضم متجري؟", "تواصل مع فريق الشراكات عبر البريد أو الهاتف في صفحة الشراكة لمعرفة الخطوات المتاحة."],
      ]
    : [
        ["How do I find available stores?", "Open the store directory to browse bakeries and restaurants currently listed."],
        ["Can I place an order on this website?", "This website helps you discover stores and review their details. Where ordering is available, continue in the Khubzati app."],
        ["How can my business join?", "Contact the partnerships team by email or phone on the Partner page to ask about current onboarding."],
      ];

  const itemList = stores?.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: ar ? "متاجر خبزاتي" : "Khubzati stores",
        itemListElement: stores.map((store, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/stores/${store.slug}`,
          name: store.name[language],
        })),
      }
    : null;

  return (
    <div className="home stack-lg">
      {itemList ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }}
        />
      ) : null}

      <section className="hero card">
        <LightRays
          className="hero__rays"
          raysOrigin="top-center"
          raysColor="#f4c27d"
          raysSpeed={0.6}
          lightSpread={0.9}
          rayLength={1.3}
          fadeDistance={1.1}
          saturation={0.9}
          pulsating={false}
          noiseAmount={0.06}
          distortion={0.02}
        />
        <div className="hero__copy stack">
          <p className="eyebrow">{t.home.eyebrow}</p>
          <BlurText
            key={language}
            as="h1"
            className="hero-title"
            text={t.home.title}
            animateBy="words"
            direction="top"
            delay={80}
          />
          <p className="lead">{ar
            ? "من مخابز الحارة إلى مطاعمها، اكتشف خيارات محلية في مكان واحد."
            : "From neighborhood bakeries to local restaurants, explore nearby food businesses in one place."}</p>
          <div className="hero__actions">
            <StarBorder className="hero__cta-star" color="#f4c27d" speed="6s" thickness={2}>
              <Link href="/stores" className="button" onClick={() => trackEvent("cta_click", { cta: "hero_explore_stores", page: "home" })}>
                {ar ? "استكشف المتاجر" : "Explore stores"}
              </Link>
            </StarBorder>
            <Link href="/contact" className="button button--ghost" onClick={() => trackEvent("cta_click", { cta: "hero_become_partner", page: "home" })}>
              {ar ? "انضم كشريك" : "Become a partner"}
            </Link>
          </div>
          <p className="hero__note">{ar ? "المعلومات والخيارات المعروضة تختلف حسب المتجر والمنطقة." : "Store information and available options vary by business and area."}</p>
        </div>
        <div className="hero__media">
          <Image
            src="/images/hero-bread.png"
            alt={ar ? "رغيف خبز مخبوز طازجًا على لوح خشبي" : "Freshly baked loaf on a wooden board"}
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 880px) 92vw, 48vw"
            className="hero__img"
          />
          <div className="hero__image-caption" dir={ar ? "rtl" : "ltr"}>
            <span>{ar ? "طازج من الحارة" : "Fresh from the neighborhood"}</span>
            <span aria-hidden="true">✳</span>
          </div>
        </div>
      </section>

      <section className="section stack" id="categories" data-motion-reveal>
        <SectionTitle eyebrow={ar ? "اكتشف محليًا" : "Find something local"} title={ar ? "من الفرن إلى مائدتك" : "From the oven to your table"} description={ar ? "ابدأ من نوع المتجر الذي تبحث عنه، ثم تصفح المتاجر المدرجة." : "Start with the kind of place you have in mind, then browse the listed businesses."} />
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.kind} href={`/stores?category=${category.kind}`} className={`category-card category-card--${category.kind}`}>
              <Image src={category.image} alt="" fill sizes="(max-width: 700px) 92vw, 45vw" className="category-card__image" />
              <span className="category-card__veil" aria-hidden="true" />
              <span className="category-card__copy">
                <span className="category-card__eyebrow">{ar ? "تصفّح الفئة" : "Browse category"}</span>
                <span className="category-card__title">{category.name}</span>
                <span className="category-card__detail">{category.detail}</span>
                <span className="category-card__link">{ar ? "عرض المتاجر" : "View stores"} <span aria-hidden="true">{ar ? "←" : "→"}</span></span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section card steps-section stack" data-motion-reveal>
        <SectionTitle eyebrow={ar ? "بكل بساطة" : "A simple journey"} title={ar ? "اكتشف، اختر، وتابع" : "Discover, choose, continue"} description={ar ? "خطوات واضحة من تصفح المتاجر إلى تجربة الطلب المتاحة في تطبيق خبزاتي." : "A clear path from exploring stores to the ordering experience available in the Khubzati app."} />
        <ol className="steps-grid">
          {steps.map(([number, title, text]) => (
            <li key={number} className="step-card">
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section stack" data-motion-reveal>
        <SectionTitle eyebrow={t.home.whyEyebrow} title={ar ? "الطعام المحلي يستحق أن يكون أقرب" : "Local food deserves to feel closer"} description={ar ? "خبزاتي تجمع اكتشاف المتاجر المحلية ومعلوماتها في تجربة واحدة سهلة." : "Khubzati brings local store discovery and useful business details into one simple experience."} />
        <div className="benefit-grid">
          {benefits.map(([title, text], index) => (
            <article key={title} className="card benefit-card">
              <span className="benefit-card__index">0{index + 1}</span>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section stack" id="stores" data-motion-reveal>
        <SectionTitle eyebrow={ar ? "دليل المتاجر" : "Store directory"} title={ar ? "متاجر متاحة على خبزاتي" : "Stores on Khubzati"} description={ar ? "المتاجر هنا تُحمّل مباشرة من بيانات المنصة." : "Stores are loaded from the platform’s live business data."} />
        {stores === null ? (
          <div className="card empty-state"><h3>{ar ? "تعذر تحميل المتاجر" : "Stores could not load"}</h3><p className="muted">{ar ? "تحقق من اتصالك أو أعد المحاولة من دليل المتاجر." : "Check your connection or try again from the store directory."}</p><Link href="/stores" className="button button--ghost">{ar ? "إعادة المحاولة" : "Try again"}</Link></div>
        ) : stores.length ? (
          <div className="store-grid">{stores.slice(0, 3).map((store) => <StoreCard key={store.slug} store={store} />)}</div>
        ) : (
          <div className="card empty-state"><h3>{ar ? "قريبًا على خبزاتي" : "Coming to Khubzati"}</h3><p className="muted">{ar ? "لا توجد متاجر منشورة حاليًا. ندعو المخابز والمطاعم المحلية للتواصل معنا." : "There are no published stores yet. Local bakeries and restaurants can get in touch with us."}</p></div>
        )}
        <Link href="/stores" className="button button--ghost" onClick={() => trackEvent("cta_click", { cta: "view_all_stores", page: "home" })}>{ar ? "عرض دليل المتاجر" : "Open store directory"}</Link>
      </section>

      <section className="section merchant-band" data-motion-reveal>
        <div className="merchant-band__copy">
          <p className="eyebrow">{ar ? "لأصحاب المخابز والمطاعم" : "For bakeries and restaurants"}</p>
          <h2>{ar ? "خلّ متجرك جزءًا من خبزاتي" : "Bring your business to Khubzati"}</h2>
          <p>{ar ? "تواصل مع فريقنا للتعرّف على الظهور في دليل المتاجر ومسارات التطبيق المتاحة لشركائنا." : "Talk with our team about appearing in the store directory and the app journeys available to partners."}</p>
          <Link href="/contact" className="button button--light" onClick={() => trackEvent("cta_click", { cta: "merchant_partnership", page: "home" })}>{ar ? "تعرّف على الشراكة" : "Explore partnership"}</Link>
        </div>
        <div className="merchant-band__seal" aria-hidden="true"><Image className="merchant-band__logo" src="/khubzati-logo.svg" alt="" width={120} height={72} /></div>
      </section>

      <section className="section card stack" data-motion-reveal>
        <SectionTitle eyebrow={ar ? "أسئلة شائعة" : "Frequently asked"} title={ar ? "قبل أن تبدأ" : "Before you get started"} description={ar ? "إجابات مختصرة عن استخدام الموقع والانضمام إلى خبزاتي." : "A few helpful answers about using the website and joining Khubzati."} />
        <div className="faq-list">
          {faqs.map(([question, answer]) => <details key={question} className="faq-item"><summary>{question}</summary><p className="muted">{answer}</p></details>)}
        </div>
      </section>
    </div>
  );
}
