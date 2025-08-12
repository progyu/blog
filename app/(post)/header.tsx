"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import type { Post } from "@/app/get-posts";
import { parseDate } from "@/app/utils/date";
import { Tags } from "./components/tags";

export function Header({ posts }: { posts: Post[] }) {
  const segments = useSelectedLayoutSegments();
  const post = posts.find(post => post.id === segments[segments.length - 1]);

  if (post == null) return <></>;

  const displayDate = parseDate(post.date)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll(" ", "");

  return (
    <>
      <h1 className="text-2xl font-bold mb-1 dark:text-gray-100">
        {post.title}
      </h1>

      <p className="font-mono flex text-xs text-gray-500 dark:text-gray-500">
        <span className="flex-grow">
          <span>{displayDate}</span>
        </span>
        <span className="ml-2">{post.readingTime} min read</span>
      </p>
      <Tags tags={post.tags} />
    </>
  );
}
