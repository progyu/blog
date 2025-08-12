import { getPosts } from "@/app/get-posts";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
  description: "모든 태그 목록",
};

export default async function TagsPage() {
  const posts = await getPosts();
  const tagsWithCounts: { [key: string]: number } = {};

  posts.forEach(post => {
    post.tags?.forEach(tag => {
      tagsWithCounts[tag] = (tagsWithCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagsWithCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tags</h1>
      <div className="flex flex-wrap gap-4">
        {sortedTags.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <span className="font-semibold">{tag}</span>
            <span className="ml-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full px-2 py-0.5">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
