import { notFound } from "next/navigation";
import { StoreDetailsView } from "@/components/store-details-view";
import { fetchStoreBySlug } from "@/data/store-service";
import { localize } from "@/data/stores";
import { getSiteUrl } from "@/lib/seo";

type StorePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: StorePageProps) {
  const { slug } = await params;
  const store = await fetchStoreBySlug(slug);

  if (!store) {
    return {
      title: "المتجر غير موجود",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const name = store.name.ar;
  const city = store.city?.ar;
  const categoryLabel = store.category === "bakery" ? "مخبز" : "مطعم";
  const seoTitle = `${name} | ${categoryLabel}${city ? ` في ${city}` : ""}`;
  const seoDescription = store.description.ar;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `/stores/${slug}`
    },
    openGraph: {
      title: `${seoTitle} | خبزاتي`,
      description: seoDescription,
      url: `/stores/${slug}`,
      images: store.imageUrl
        ? [
            {
              url: store.imageUrl,
              alt: `شعار ${name}`
            }
          ]
        : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | خبزاتي`,
      description: seoDescription,
      images: store.imageUrl ? [store.imageUrl] : undefined
    }
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const store = await fetchStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/stores/${slug}`;
  const storeName = localize(store.name, "ar");
  const city = store.city ? localize(store.city, "ar") : undefined;
  const address = city ? {
    "@type": "PostalAddress",
    addressLocality: city,
    addressCountry: "JO"
  } : undefined;
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": store.category === "bakery" ? "Bakery" : "Restaurant",
    name: storeName,
    description: localize(store.description, "ar"),
    url,
    image: store.imageUrl || undefined,
    address
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "المتاجر", item: `${siteUrl}/stores` },
      { "@type": "ListItem", position: 3, name: storeName, item: url }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <StoreDetailsView store={store} />
    </>
  );
}
