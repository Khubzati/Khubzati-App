import Link from "next/link";
import { Store } from "@/data/stores";

type StoreCardProps = {
  store: Store;
};

export function StoreCard({ store }: StoreCardProps) {
  return (
    <article className="store-card">
      <div className="store-card__visual" style={{ background: store.gradient }} aria-hidden="true" />
      <div className="store-card__content">
        <p className="store-card__meta">
          <span>{store.category}</span>
          <span>{store.city}</span>
          <span>{store.rating.toFixed(1)} rating</span>
        </p>
        <h3>{store.name}</h3>
        <p className="muted">{store.description}</p>
        <p className="store-card__chips">
          {store.specialties.map((specialty) => (
            <span key={specialty}>{specialty}</span>
          ))}
        </p>

        <Link href={`/stores/${store.slug}`} className="button button--small">
          View Store Route
        </Link>
      </div>
    </article>
  );
}
