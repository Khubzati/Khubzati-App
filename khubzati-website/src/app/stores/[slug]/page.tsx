import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreBySlug, stores } from "@/data/stores";

type StorePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return stores.map((store) => ({ slug: store.slug }));
}

export function generateMetadata({ params }: StorePageProps) {
  const store = getStoreBySlug(params.slug);

  if (!store) {
    return { title: "Store not found" };
  }

  return {
    title: `${store.name} Store Route`
  };
}

export default function StorePage({ params }: StorePageProps) {
  const store = getStoreBySlug(params.slug);

  if (!store) {
    notFound();
  }

  return (
    <article className="stack-lg">
      <section className="section card store-hero" style={{ backgroundImage: store.gradient }}>
        <div>
          <p className="eyebrow dark">{store.category}</p>
          <h1>{store.name}</h1>
          <p className="lead compact dark">{store.description}</p>
        </div>
      </section>

      <section className="section card stack">
        <h2>Store route details</h2>
        <div className="meta-grid">
          <div>
            <span>City</span>
            <p>
              {store.city}, {store.neighborhood}
            </p>
          </div>
          <div>
            <span>Average ETA</span>
            <p>{store.etaMinutes} minutes</p>
          </div>
          <div>
            <span>Open Hours</span>
            <p>{store.openHours}</p>
          </div>
          <div>
            <span>Delivery Days</span>
            <p>{store.deliveryDays}</p>
          </div>
          <div>
            <span>Customer Rating</span>
            <p>{store.rating.toFixed(1)} / 5</p>
          </div>
        </div>

        <div>
          <h3>Specialties</h3>
          <p className="store-card__chips">
            {store.specialties.map((specialty) => (
              <span key={specialty}>{specialty}</span>
            ))}
          </p>
        </div>

        <div className="button-row">
          <Link href="/stores" className="button button--ghost">
            Back to Stores
          </Link>
          <Link href="/contact" className="button">
            Partner with Khubzati
          </Link>
        </div>
      </section>
    </article>
  );
}
