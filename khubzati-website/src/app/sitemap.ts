import type { MetadataRoute } from "next";
import { fetchStores } from "@/data/store-service";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/stores`,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/app`,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.6
    }
  ];

  const stores = await fetchStores().catch(() => []);
  const storePages: MetadataRoute.Sitemap = stores.map((store) => ({
    url: `${siteUrl}/stores/${store.slug}`,
    changeFrequency: "daily",
    priority: 0.8
  }));

  return [...staticPages, ...storePages];
}
