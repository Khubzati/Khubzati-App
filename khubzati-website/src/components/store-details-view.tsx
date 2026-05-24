"use client";

import Image from "next/image";
import Link from "next/link";
import { localize, Store } from "@/data/stores";
import { useLanguage } from "@/i18n/language-context";
import { trackEvent } from "@/lib/analytics";

type StoreDetailsViewProps = {
  store: Store;
};

export function StoreDetailsView({ store }: StoreDetailsViewProps) {
  const { language, t } = useLanguage();

  return (
    <article className="stack-lg">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{language === "ar" ? "الرئيسية" : "Home"}</Link>
        <span>/</span>
        <Link href="/stores">{language === "ar" ? "المتاجر" : "Stores"}</Link>
        <span>/</span>
        <span>{localize(store.name, language)}</span>
      </nav>

      <section className="section card store-hero" style={{ backgroundImage: store.gradient }}>
        <div className="store-hero__content">
          <p className="eyebrow dark">{t.categories[store.category]}</p>
          <h1>{localize(store.name, language)}</h1>
          <p className="lead compact dark">{localize(store.description, language)}</p>
        </div>
        {store.imageUrl ? (
          <div className="store-hero__logo-wrap">
            <Image src={store.imageUrl} alt={`${localize(store.name, language)} logo`} width={220} height={140} unoptimized />
          </div>
        ) : null}
      </section>

      <section className="section card stack">
        <h2>{t.storeDetails.detailsTitle}</h2>
        <div className="meta-grid">
          <div>
            <span>{t.storeDetails.city}</span>
            <p>
              {localize(store.city, language)}
              {language === "ar" ? "، " : ", "}
              {localize(store.neighborhood, language)}
            </p>
          </div>
          <div>
            <span>{t.storeDetails.eta}</span>
            <p>
              {store.etaMinutes} {t.storeDetails.minutes}
            </p>
          </div>
          <div>
            <span>{t.storeDetails.openHours}</span>
            <p>{localize(store.openHours, language)}</p>
          </div>
          <div>
            <span>{t.storeDetails.deliveryDays}</span>
            <p>{localize(store.deliveryDays, language)}</p>
          </div>
          <div>
            <span>{t.storeDetails.customerRating}</span>
            <p>{store.rating.toFixed(1)} / 5</p>
          </div>
        </div>

        <div>
          <h3>{t.storeDetails.specialties}</h3>
          <p className="store-card__chips">
            {store.specialties.map((specialty) => (
              <span key={specialty.en}>{localize(specialty, language)}</span>
            ))}
          </p>
        </div>

        <div className="button-row">
          <Link
            href="/stores"
            className="button button--ghost"
            onClick={() =>
              trackEvent("cta_click", {
                cta: "store_details_back_to_stores",
                page: "store_details",
                store_slug: store.slug,
              })
            }
          >
            {t.storeDetails.backToStores}
          </Link>
          <Link
            href="/contact"
            className="button"
            onClick={() =>
              trackEvent("lead_intent", {
                source: "store_details",
                store_slug: store.slug,
                store_category: store.category,
              })
            }
          >
            {t.storeDetails.partner}
          </Link>
        </div>
      </section>
    </article>
  );
}
