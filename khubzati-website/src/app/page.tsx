import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { StoreCard } from "@/components/store-card";
import { stores } from "@/data/stores";

const highlights = [
  {
    title: "Freshness-first routing",
    description:
      "Orders are routed by preparation speed, distance, and oven timing so bread reaches customers warm, not delayed."
  },
  {
    title: "Store growth dashboard",
    description:
      "Store owners get cleaner order visibility, prep waves, and repeat-customer signals inside one operational flow."
  },
  {
    title: "Neighborhood trust",
    description:
      "Khubzati supports local kitchens with reliable delivery windows and transparent service quality."
  }
];

export default function HomePage() {
  return (
    <div className="stack-lg">
      <section className="hero card">
        <div>
          <p className="eyebrow">Khubzati Website</p>
          <h1>One platform for local bread, food stores, and delivery-ready customer journeys.</h1>
          <p className="lead">
            Khubzati is a local commerce network that links bakeries, restaurants, and cafes to customers through
            intelligent routing, polished UX, and fast storefront discovery.
          </p>
          <div className="hero__actions">
            <Link href="/stores" className="button">
              Explore Stores
            </Link>
            <Link href="/app" className="button button--ghost">
              View App Route Map
            </Link>
          </div>
        </div>

        <div className="hero__stats">
          <article>
            <p>90 sec</p>
            <span>Average order-to-store route assignment</span>
          </article>
          <article>
            <p>4.7+</p>
            <span>Store quality rating baseline</span>
          </article>
          <article>
            <p>6 cities</p>
            <span>Pilot-ready expansion model</span>
          </article>
        </div>
      </section>

      <section className="section stack">
        <SectionTitle
          eyebrow="Why Khubzati"
          title="Designed to serve both customer experience and store operations"
          description="This is not just an ordering list. It is a delivery and operations system built around how bread and fresh meals are actually prepared."
        />

        <div className="feature-grid">
          {highlights.map((item) => (
            <article key={item.title} className="card feature-card">
              <h3>{item.title}</h3>
              <p className="muted">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section stack">
        <SectionTitle
          eyebrow="Top Stores"
          title="Trusted partners already ready for digital routing"
          description="Preview the type of stores Khubzati can onboard and route with a premium user flow."
        />

        <div className="store-grid">
          {stores.slice(0, 3).map((store) => (
            <StoreCard key={store.slug} store={store} />
          ))}
        </div>
      </section>

      <section className="cta card">
        <div>
          <p className="eyebrow">Next Step</p>
          <h2>Launch Khubzati as a full consumer + store web presence.</h2>
          <p className="muted">
            This repo includes the core website structure, visual system, and store routing pages so your team can extend
            toward live APIs and production deployment.
          </p>
        </div>
        <Link href="/contact" className="button">
          Start Store Onboarding
        </Link>
      </section>
    </div>
  );
}
