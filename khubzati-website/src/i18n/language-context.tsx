"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_LANGUAGE, Language } from "@/i18n/types";
import { translations } from "@/i18n/translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (typeof translations)[Language];
};

const STORAGE_KEY = "khubzati-language";

const pageMetadata = {
  "/": {
    ar: {
      title: "خبزاتي | اكتشف المخابز والمطاعم المحلية",
      description: "اكتشف المخابز والمطاعم المحلية على خبزاتي، وتعرّف على المتاجر المتاحة بالقرب منك."
    },
    en: {
      title: "Khubzati | Discover local bakeries and restaurants",
      description: "Discover local bakeries and restaurants on Khubzati, and explore businesses available near you."
    }
  },
  "/stores": {
    ar: {
      title: "المخابز والمطاعم المحلية | Khubzati",
      description: "تصفح المخابز والمطاعم المنشورة حاليًا على خبزاتي وابحث حسب الاسم أو المدينة أو الفئة."
    },
    en: {
      title: "Local bakeries and restaurants | Khubzati",
      description: "Browse bakeries and restaurants listed on Khubzati. Filter the directory by name, city, or category."
    }
  },
  "/about": {
    ar: { title: "عن خبزاتي | Khubzati", description: "تعرف على خبزاتي، منصة محلية لاكتشاف المخابز والمطاعم القريبة ومعلوماتها." },
    en: { title: "About Khubzati", description: "Learn about Khubzati, a local platform for discovering nearby bakeries, restaurants, and useful store details." }
  },
  "/app": {
    ar: { title: "كيف يعمل خبزاتي | Khubzati", description: "تعرف على مسارات استكشاف المتاجر وتجربة العميل والشريك عبر تطبيقات خبزاتي." },
    en: { title: "How Khubzati works", description: "Learn how customers and local businesses discover stores and continue through Khubzati’s app journeys." }
  },
  "/contact": {
    ar: { title: "تواصل وشراكة | Khubzati", description: "تواصل مع فريق خبزاتي للاستفسار عن انضمام المخابز والمطاعم المحلية." },
    en: { title: "Contact and partnerships | Khubzati", description: "Contact the Khubzati team to ask about partnerships for local bakeries and restaurants." }
  }
} satisfies Record<string, Record<Language, { title: string; description: string }>>;

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyLanguage(language: Language) {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // The current session still switches when browser storage is unavailable.
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Keep the server and first browser render identical; restore preference after hydration.
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);

  useEffect(() => {
    let storedLanguage: string | null = null;
    try {
      storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Use the default language when browser storage is unavailable.
    }
    window.queueMicrotask(() => {
      if (storedLanguage === "ar" || storedLanguage === "en") setLanguageState(storedLanguage);
      setPreferenceLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!preferenceLoaded) return;
    applyLanguage(language);
  }, [language, preferenceLoaded]);

  useEffect(() => {
    const localizedMetadata = pageMetadata[pathname as keyof typeof pageMetadata]?.[language];
    if (!localizedMetadata) return;

    const titleUpdate = window.requestAnimationFrame(() => {
      document.title = localizedMetadata.title;
    });
    document.querySelector('meta[name="description"]')?.setAttribute("content", localizedMetadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", localizedMetadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", localizedMetadata.description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", localizedMetadata.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", localizedMetadata.description);

    return () => window.cancelAnimationFrame(titleUpdate);
  }, [language, pathname]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        applyLanguage(nextLanguage);
      },
      toggleLanguage: () => {
        const nextLanguage = language === "ar" ? "en" : "ar";
        setLanguageState(nextLanguage);
        applyLanguage(nextLanguage);
      },
      t: translations[language]
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
