import type { MetadataRoute } from "next";
import { fetchStores } from "@/data/store-service";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/stores`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/app`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6
    }
  ];

  const stores = await fetchStores().catch(() => []);
  const storePages: MetadataRoute.Sitemap = stores.map((store) => ({
    url: `${siteUrl}/stores/${store.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8
  }));

  return [...staticPages, ...storePages];
}
