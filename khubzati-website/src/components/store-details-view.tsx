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
          <Image src={store.imageUrl} alt={language === "ar" ? `شعار ${localize(store.name, language)}` : `${localize(store.name, language)} logo`} width={220} height={140} unoptimized />
          </div>
        ) : null}
      </section>

      <section className="section card stack">
        <h2>{t.storeDetails.detailsTitle}</h2>
        <div className="meta-grid">
          {store.city || store.neighborhood ? <div><span>{t.storeDetails.city}</span><p>{[store.neighborhood, store.city].filter(Boolean).map((value) => localize(value!, language)).join(language === "ar" ? "، " : ", ")}</p></div> : null}
          {store.etaMinutes ? <div><span>{t.storeDetails.eta}</span><p>{store.etaMinutes} {t.storeDetails.minutes}</p></div> : null}
          {store.openHours.en !== "Not provided" ? <div><span>{t.storeDetails.openHours}</span><p>{localize(store.openHours, language)}</p></div> : null}
          {store.deliveryDays ? <div><span>{t.storeDetails.deliveryDays}</span><p>{localize(store.deliveryDays, language)}</p></div> : null}
          {store.rating ? <div><span>{t.storeDetails.customerRating}</span><p>{store.rating.toFixed(1)} / 5</p></div> : null}
        </div>

        {store.specialties.length ? <div>
          <h3>{t.storeDetails.specialties}</h3>
          <p className="store-card__chips">
            {store.specialties.map((specialty) => (
              <span key={specialty.en}>{localize(specialty, language)}</span>
            ))}
          </p>
        </div> : null}

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
