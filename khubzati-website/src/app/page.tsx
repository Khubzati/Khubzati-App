import type { Metadata } from "next";
import { HomeExperience } from "@/components/home-experience";
import { fetchStores } from "@/data/store-service";
import { getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "خبزاتي | اكتشف المخابز والمطاعم المحلية",
  description: "اكتشف المخابز والمطاعم المحلية على خبزاتي، وتعرّف على المتاجر المتاحة بالقرب منك.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "خبزاتي | طازج من متاجر حارتك",
    description: "اكتشف المخابز والمطاعم المحلية على خبزاتي.",
    url: getSiteUrl(),
    images: [{ url: "/images/hero-bread.png", width: 640, height: 640, alt: "خبز مخبوز طازجًا على لوح خشبي" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/hero-bread.png"] },
};

export default async function HomePage() {
  const stores = await fetchStores().catch(() => null);
  return <HomeExperience stores={stores} siteUrl={getSiteUrl()} />;
}
