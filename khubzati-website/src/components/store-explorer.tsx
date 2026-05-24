"use client";

import { useEffect, useMemo, useState } from "react";
import { StoreCard } from "@/components/store-card";
import { fetchStores } from "@/data/store-service";
import { Store, storeCategories, StoreCategory, stores as fallbackStores } from "@/data/stores";
import { useLanguage } from "@/i18n/language-context";

type CategoryFilter = "all" | StoreCategory;

export function StoreExplorer() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [allStores, setAllStores] = useState<Store[]>(fallbackStores);
  const { language, t } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    fetchStores()
      .then((storesFromApi) => {
        if (isMounted) {
          setAllStores(storesFromApi);
        }
      })
      .catch(() => {
        // Keep fallback stores when backend is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStores = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allStores.filter((store) => {
      const matchesCategory = selectedCategory === "all" || store.category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        store.name[language].toLowerCase().includes(normalizedQuery) ||
        store.city[language].toLowerCase().includes(normalizedQuery) ||
        store.neighborhood[language].toLowerCase().includes(normalizedQuery) ||
        store.specialties.some((item) => item[language].toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [allStores, query, selectedCategory, language]);

  return (
    <section className="section stack">
      <div className="filters card">
        <label className="field">
          {t.stores.searchLabel}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.stores.searchPlaceholder}
          />
        </label>

        <div className="chip-row" role="tablist" aria-label={t.stores.title}>
          <button
            type="button"
            className={selectedCategory === "all" ? "chip is-active" : "chip"}
            onClick={() => setSelectedCategory("all")}
          >
            {t.stores.all}
          </button>
          {storeCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "chip is-active" : "chip"}
              onClick={() => setSelectedCategory(category)}
            >
              {t.categories[category]}
            </button>
          ))}
        </div>
      </div>

      {filteredStores.length > 0 ? (
        <div className="store-grid">
          {filteredStores.map((store) => (
            <StoreCard key={store.slug} store={store} />
          ))}
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
