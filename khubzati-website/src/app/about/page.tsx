import { SectionTitle } from "@/components/section-title";

export const metadata = {
  title: "About Khubzati"
};

const principles = [
  {
    title: "Local-first marketplace",
    text: "Khubzati exists to amplify neighborhood kitchens instead of burying them under generic delivery listings."
  },
  {
    title: "Warm delivery logic",
    text: "Routes are planned with prep windows and oven timing in mind, which is critical for bread quality and customer trust."
  },
  {
    title: "Store enablement",
    text: "The platform supports stores with clearer order flow, demand windows, and a digital identity that feels premium."
  }
];

export default function AboutPage() {
  return (
    <div className="stack-lg">
      <section className="section card stack">
        <SectionTitle
          eyebrow="What is Khubzati"
          title="Khubzati is a digital network for fresh bread and neighborhood food"
          description="The name is inspired by the Arabic word for bread and the culture of daily fresh food."
        />
        <p className="lead compact">
          The word <strong>Khubzati</strong> is inspired by bread culture and daily neighborhood life. The platform helps
          people discover trusted local stores while giving bakeries and kitchens better routing and operational control.
        </p>
      </section>

      <section className="section stack">
        <SectionTitle
          eyebrow="Core Principles"
          title="Built around real kitchen operations"
          description="A strong UX is not only visual design. It is also delivery confidence, prep clarity, and transparent communication."
        />

        <div className="feature-grid">
          {principles.map((item) => (
            <article key={item.title} className="card feature-card">
              <h3>{item.title}</h3>
              <p className="muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section card stack">
        <SectionTitle
          eyebrow="Value"
          title="What Khubzati delivers"
          description="For customers, it means better food reliability. For stores, it means scalable local growth."
        />

        <ul className="list">
          <li>Faster store discovery by city, specialty, and quality</li>
          <li>Cleaner order routing between customer app and partner stores</li>
          <li>Clear partner onboarding path for bakeries and cafes</li>
          <li>Strong visual brand that feels modern and local at the same time</li>
        </ul>
      </section>
    </div>
  );
}
