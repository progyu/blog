import { MetadataRoute } from "next";
import { getPosts } from "@/app/get-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const routes = [
    {
      url: "https://blog-leegyuha.vercel.app",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: "https://blog-leegyuha.vercel.app/about",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  const postRoutes = posts.map(post => ({
    url: `https://blog-leegyuha.vercel.app/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...postRoutes];
}
