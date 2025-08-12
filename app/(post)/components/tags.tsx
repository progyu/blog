import Link from "next/link";

export function Tags({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map(tag => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
