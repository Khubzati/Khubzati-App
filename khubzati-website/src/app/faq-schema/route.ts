import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/seo";

export async function GET() {
  const siteUrl = getSiteUrl();

  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        inLanguage: "ar",
        mainEntity: [
          {
            "@type": "Question",
            name: "هل كل متجر يظهر في المنصة موثّق؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "نعم، عرض المتاجر يركز على شركاء موثّقين لضمان تجربة طلب موثوقة وشفافة.",
            },
          },
          {
            "@type": "Question",
            name: "هل يمكن تخصيص تجربة المتجر حسب نوع النشاط؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "نعم، يمكن تكييف المحتوى والباقات حسب مخبز أو مطعم أو كافيه مع نفس الهوية الرقمية.",
            },
          },
          {
            "@type": "Question",
            name: "هل المنصة مناسبة للتوسع لعدة فروع؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "نعم، بنية العرض مصممة لدعم التوسع تدريجيًا مع الحفاظ على وضوح التجربة للمستخدم.",
            },
          },
        ],
      },
      {
        "@type": "FAQPage",
        inLanguage: "en",
        mainEntity: [
          {
            "@type": "Question",
            name: "Are listed stores verified?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The marketplace prioritizes verified partners to keep ordering trust high.",
            },
          },
          {
            "@type": "Question",
            name: "Can the storefront be tailored by business type?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Bakery, restaurant, and cafe experiences can be adapted under one brand system.",
            },
          },
          {
            "@type": "Question",
            name: "Is the platform scalable for multi-branch operators?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The structure supports branch growth while preserving a consistent customer experience.",
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        name: "Khubzati FAQ Schema",
        url: `${siteUrl}/faq-schema`,
      },
    ],
  };

  return NextResponse.json(payload, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
    },
  });
}
