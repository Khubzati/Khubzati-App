import { notFound } from "next/navigation";
import { StoreDetailsView } from "@/components/store-details-view";
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
    title: `${store.name.en} Store Route`
  };
}

export default function StorePage({ params }: StorePageProps) {
  const store = getStoreBySlug(params.slug);

  if (!store) {
    notFound();
  }

  return <StoreDetailsView store={store} />;
}
