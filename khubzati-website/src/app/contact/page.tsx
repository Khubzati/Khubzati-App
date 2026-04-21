import Link from "next/link";
import { SectionTitle } from "@/components/section-title";

export const metadata = {
  title: "Partner With Khubzati"
};

export default function ContactPage() {
  return (
    <div className="stack-lg">
      <section className="section card stack">
        <SectionTitle
          eyebrow="Store Onboarding"
          title="Join Khubzati as a bakery, restaurant, or cafe"
          description="We help local stores launch faster with better digital visibility and smarter order routing."
        />
      </section>

      <section className="section contact-grid">
        <article className="card stack contact-card">
          <h3>Partnership Team</h3>
          <p className="muted">Share your store profile and we will contact you with the onboarding checklist.</p>
          <p>
            Email: <a href="mailto:partners@khubzati.com">partners@khubzati.com</a>
          </p>
          <p>
            Sales line: <a href="tel:+962790000000">+962 79 000 0000</a>
          </p>
          <Link href="/stores" className="button button--ghost">
            View Live Store Examples
          </Link>
        </article>

        <article className="card stack contact-card">
          <h3>What to prepare</h3>
          <ul className="list">
            <li>Store identity and location coverage</li>
            <li>Menu categories and top products</li>
            <li>Daily open hours and prep capacity</li>
            <li>Preferred launch timeline</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
