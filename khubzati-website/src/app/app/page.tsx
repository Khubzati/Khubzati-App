import Link from "next/link";
import { SectionTitle } from "@/components/section-title";

export const metadata = {
  title: "App Route Map"
};

const customerFlow = [
  "Discover nearby stores based on city and specialty",
  "Select items and preferred delivery timing",
  "Receive live prep + route updates",
  "Track handoff and confirm warm delivery"
];

const storeFlow = [
  "Receive routed orders grouped by prep window",
  "Accept or adjust capacity in one tap",
  "Prepare batches with timing assistant",
  "Dispatch with clear delivery handoff status"
];

export default function AppRoutePage() {
  return (
    <div className="stack-lg">
      <section className="section card stack">
        <SectionTitle
          eyebrow="Routing Architecture"
          title="Customer app and store app working as one system"
          description="Khubzati separates customer and store experiences while keeping both synchronized through routing logic."
        />
      </section>

      <section className="section flow-grid">
        <article className="card stack">
          <h3>Customer App Route</h3>
          <ol className="numbered-list">
            {customerFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="card stack">
          <h3>Store App Route</h3>
          <ol className="numbered-list">
            {storeFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="section card stack">
        <h2>How this website supports both apps</h2>
        <ul className="list">
          <li>Explains Khubzati clearly for users, stores, and partners</li>
          <li>Provides discoverable store pages with clean route details</li>
          <li>Creates a direct onboarding path for new stores</li>
          <li>Acts as launch-ready brand foundation for mobile app growth</li>
        </ul>

        <div className="button-row">
          <Link href="/stores" className="button button--ghost">
            Open Stores
          </Link>
          <Link href="/contact" className="button">
            Start Onboarding
          </Link>
        </div>
      </section>
    </div>
  );
}
