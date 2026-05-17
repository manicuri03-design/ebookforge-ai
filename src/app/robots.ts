import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ebookforge-ai.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/demo"],
      disallow: ["/dashboard/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
