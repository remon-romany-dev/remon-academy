import type { MetadataRoute } from "next";
import { diplomas, goals } from "@/content/paths";
import { SITE_URL } from "@/content/site";
import { getCatalog } from "@/lib/catalog";

const staticPages = ["about", "terms", "privacy", "refund", "goals", "diplomas", "kids", "verify"];

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
    ...goals.map((goal) => ({
      url: `${SITE_URL}/goals/${goal.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...diplomas.map((diploma) => ({
      url: `${SITE_URL}/diplomas/${diploma.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
