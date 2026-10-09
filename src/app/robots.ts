import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/precos"],
        disallow: ["/api/", "/painel", "/curriculos/", "/entrar", "/criar-conta"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
