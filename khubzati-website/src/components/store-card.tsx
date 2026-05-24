"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { localize, Store } from "@/data/stores";
import { useLanguage } from "@/i18n/language-context";

type StoreCardProps = {
  store: Store;
  onCtaClick?: (store: Store) => void;
};

export function StoreCard({ store, onCtaClick }: StoreCardProps) {
  const { language, t } = useLanguage();
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);
  const shouldShowLogo = Boolean(store.imageUrl) && failedLogoUrl !== store.imageUrl;

  return (
    <article className="store-card">
      <div
        className="store-card__visual"
        style={shouldShowLogo ? { background: "#fff" } : { background: store.gradient }}
        aria-hidden="true"
      >
        {shouldShowLogo ? (
          <Image
            className="store-card__logo"
            src={store.imageUrl as string}
            alt={`${localize(store.name, language)} logo`}
            width={320}
            height={120}
            unoptimized
            sizes="(max-width: 900px) 100vw, 33vw"
            onError={() => setFailedLogoUrl(store.imageUrl as string)}
          />
        ) : null}
      </div>
      <div className="store-card__content">
        <p className="store-card__meta">
          <span>{t.categories[store.category]}</span>
          <span>{localize(store.city, language)}</span>
          <span>
            {store.rating.toFixed(1)} {t.stores.rating}
          </span>
        </p>
        <h3 className="store-card__name">{localize(store.name, language)}</h3>
        <p className="muted store-card__description">{localize(store.description, language)}</p>
        <p className="store-card__chips">
          {store.specialties.map((specialty) => (
            <span key={specialty.en}>{localize(specialty, language)}</span>
          ))}
        </p>

        <Link
          href={`/stores/${store.slug}`}
          className="button button--small store-card__cta"
          onClick={() => onCtaClick?.(store)}
        >
          {t.stores.viewStoreRoute}
        </Link>
      </div>
    </article>
  );
}
