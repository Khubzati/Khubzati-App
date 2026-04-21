import { SectionTitle } from "@/components/section-title";
import { StoreExplorer } from "@/components/store-explorer";

export const metadata = {
  title: "Store Explorer"
};

export default function StoresPage() {
  return (
    <div className="stack-lg">
      <section className="section card stack">
        <SectionTitle
          eyebrow="Store Routing"
          title="Browse Khubzati partner stores"
          description="Filter by category and search by city, name, or specialty to find the right store fast."
        />
      </section>

      <StoreExplorer />
    </div>
  );
}
