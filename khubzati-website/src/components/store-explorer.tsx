"use client";

import { useMemo, useState } from "react";
import { StoreCard } from "@/components/store-card";
import { storeCategories, stores } from "@/data/stores";

export function StoreExplorer() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredStores = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return stores.filter((store) => {
      const matchesCategory = selectedCategory === "All" || store.category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        store.name.toLowerCase().includes(normalizedQuery) ||
        store.city.toLowerCase().includes(normalizedQuery) ||
        store.neighborhood.toLowerCase().includes(normalizedQuery) ||
        store.specialties.some((item) => item.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  return (
    <section className="section stack">
      <div className="filters card">
        <label className="field">
          Search store, city, or specialty
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: Saj, Amman, Croissant"
          />
        </label>

        <div className="chip-row" role="tablist" aria-label="Store categories">
          <button
            type="button"
            className={selectedCategory === "All" ? "chip is-active" : "chip"}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          {storeCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "chip is-active" : "chip"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
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
          <h3>No stores match yet</h3>
          <p className="muted">Try removing filters or searching with a city like Amman, Irbid, or Aqaba.</p>
        </div>
      )}
    </section>
  );
}
