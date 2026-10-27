import { StoreDirectoryIntro } from "@/components/store-directory-intro";
import { StoreExplorer } from "@/components/store-explorer";
import { fetchStores } from "@/data/store-service";

export default async function StoresPage() {
  const stores = await fetchStores().catch(() => null);

  return (
    <div className="stack-lg">
      <StoreDirectoryIntro />
      <StoreExplorer initialStores={stores} />
    </div>
  );
}
