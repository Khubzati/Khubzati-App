"use client";

import { useEffect, useMemo, useState } from "react";
import { StoreCard } from "@/components/store-card";
import { fetchStores } from "@/data/store-service";
import { Store, storeCategories, StoreCategory } from "@/data/stores";
import { useLanguage } from "@/i18n/language-context";

type CategoryFilter = "all" | StoreCategory;

export function StoreExplorer({ initialStores }: { initialStores: Store[] | null }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [allStores, setAllStores] = useState<Store[]>(initialStores ?? []);
  const [hasError, setHasError] = useState(initialStores === null);
  const { language, t } = useLanguage();

  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get("category");
    if (category === "bakery" || category === "restaurant") {
      window.requestAnimationFrame(() => setSelectedCategory(category));
    }
  }, []);

  const retry = async () => {
    setHasError(false);
    try {
      setAllStores(await fetchStores());
    } catch {
      setHasError(true);
    }
  };

  const filteredStores = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allStores.filter((store) => {
      const matchesCategory = selectedCategory === "all" || store.category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        store.name[language].toLowerCase().includes(normalizedQuery) ||
        (store.city?.[language].toLowerCase().includes(normalizedQuery) ?? false) ||
        (store.neighborhood?.[language].toLowerCase().includes(normalizedQuery) ?? false) ||
        store.specialties.some((item) => item[language].toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [allStores, query, selectedCategory, language]);

  return (
    <section className="section stack">
      <div className="filters card" id="explore">
        <label className="field">
          {t.stores.searchLabel}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.stores.searchPlaceholder}
          />
        </label>

        <div className="chip-row" role="group" aria-label={t.stores.title}>
          <button
            type="button"
            aria-pressed={selectedCategory === "all"}
            className={selectedCategory === "all" ? "chip is-active" : "chip"}
            onClick={() => setSelectedCategory("all")}
          >
            {t.stores.all}
          </button>
          {storeCategories.map((category) => (
            <button
              key={category}
              aria-pressed={selectedCategory === category}
              type="button"
              className={selectedCategory === category ? "chip is-active" : "chip"}
              onClick={() => setSelectedCategory(category)}
            >
              {t.categories[category]}
            </button>
          ))}
        </div>
      </div>

      {hasError ? (
        <div className="card empty-state"><h3>{language === "ar" ? "تعذر تحميل المتاجر" : "Stores could not load"}</h3><p className="muted">{language === "ar" ? "تعذر الاتصال بدليل المتاجر. حاول مرة أخرى." : "The store directory could not be reached. Please try again."}</p><button className="button button--ghost" type="button" onClick={retry}>{language === "ar" ? "إعادة المحاولة" : "Try again"}</button></div>
      ) : filteredStores.length > 0 ? (
        <div className="store-grid">
          {filteredStores.map((store) => (
            <StoreCard key={store.slug} store={store} />
          ))}
        </div>
      ) : allStores.length === 0 ? (
        <div className="card empty-state">
          <h3>{language === "ar" ? "لا توجد متاجر بعد" : "No shops yet"}</h3>
          <p className="muted">
            {language === "ar"
              ? "نعمل على انضمام المخابز والمطاعم. تابعونا قريبًا!"
              : "We're onboarding bakeries and restaurants. Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="card empty-state">
          <h3>{t.stores.noMatchTitle}</h3>
          <p className="muted">{t.stores.noMatchDescription}</p>
        </div>
      )}
    </section>
  );
}
