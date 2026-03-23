import { NextResponse } from "next/server";

const siteUrl = "https://nexus-ai-template.vercel.app";

const content = [
  "# Nexus AI Platform",
  `> ${siteUrl}`,
  "",
  "Nexus is a marketing website for an AI infrastructure platform focused on bare-metal GPU orchestration, low-latency inference, and secure model deployment.",
  "",
  "## Preferred Crawl Scope",
  "- /",
  "- /features",
  "- /architecture",
  "- /network",
  "- /pricing",
  "- /login",
  "",
  "## Sitemaps",
  `- ${siteUrl}/sitemap.xml`,
].join("\n");

export function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
