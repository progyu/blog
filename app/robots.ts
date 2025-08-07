import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "",
        allow: "/",
        disallow: ["/api/", "/_next/", "/.", "/*.json", "/favicon.ico"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: "https://blog-leegyuha.vercel.app/sitemap.xml",
    host: "https://blog-leegyuha.vercel.app",
  };
}
