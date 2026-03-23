import type { MetadataRoute } from "next";

const siteUrl = "https://nexus-ai-template.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/features", "/architecture", "/network", "/pricing", "/login"];
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
