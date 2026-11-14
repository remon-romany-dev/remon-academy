import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { getCatalog } from "@/lib/catalog";

const staticPages = ["about", "terms", "privacy", "refund"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...catalog.map((course) => ({
      url: `${SITE_URL}/courses/${course.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...staticPages.map((page) => ({
      url: `${SITE_URL}/${page}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
