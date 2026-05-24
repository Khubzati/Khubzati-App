import { notFound } from "next/navigation";
import { StoreDetailsView } from "@/components/store-details-view";
import { fetchStoreBySlug } from "@/data/store-service";
import { localize } from "@/data/stores";
import { getSiteUrl } from "@/lib/seo";

type StorePageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: StorePageProps) {
  const store = await fetchStoreBySlug(params.slug);

  if (!store) {
    return {
      title: "Store not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const name = store.name.en;
  const city = store.city.en;
  const categoryLabel =
    store.category === "bakery" ? "Bakery" : store.category === "restaurant" ? "Restaurant" : "Cafe";
  const seoTitle = `${name} | ${categoryLabel} in ${city}`;
  const seoDescription = store.description.en;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `/stores/${params.slug}`
    },
    openGraph: {
      title: `${seoTitle} | Khubzati`,
      description: seoDescription,
      url: `/stores/${params.slug}`,
      images: store.imageUrl
        ? [
            {
              url: store.imageUrl,
              alt: `${name} logo`
            }
          ]
        : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | Khubzati`,
      description: seoDescription,
      images: store.imageUrl ? [store.imageUrl] : undefined
    }
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const store = await fetchStoreBySlug(params.slug);

  if (!store) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/stores/${params.slug}`;
  const storeName = localize(store.name, "en");
  const city = localize(store.city, "en");
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: storeName,
    description: localize(store.description, "en"),
    url,
    image: store.imageUrl || undefined,
    telephone: "+962798913567",
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "JO"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(store.rating.toFixed(1)),
      bestRating: 5,
      worstRating: 1
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }} />
      <StoreDetailsView store={store} />
    </>
  );
}
