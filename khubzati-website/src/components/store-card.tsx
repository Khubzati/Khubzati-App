"use client";

import Link from "next/link";
import { localize, Store } from "@/data/stores";
import { useLanguage } from "@/i18n/language-context";

type StoreCardProps = {
  store: Store;
};

export function StoreCard({ store }: StoreCardProps) {
  const { language, t } = useLanguage();

  return (
    <article className="store-card">
      <div className="store-card__visual" style={{ background: store.gradient }} aria-hidden="true" />
      <div className="store-card__content">
        <p className="store-card__meta">
          <span>{t.categories[store.category]}</span>
          <span>{localize(store.city, language)}</span>
          <span>
            {store.rating.toFixed(1)} {t.stores.rating}
          </span>
        </p>
        <h3>{localize(store.name, language)}</h3>
        <p className="muted">{localize(store.description, language)}</p>
        <p className="store-card__chips">
          {store.specialties.map((specialty) => (
            <span key={specialty.en}>{localize(specialty, language)}</span>
          ))}
        </p>

        <Link href={`/stores/${store.slug}`} className="button button--small">
          {t.stores.viewStoreRoute}
        </Link>
      </div>
    </article>
  );
}
