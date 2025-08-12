import { getPosts, Post } from "@/app/get-posts";
import { Posts } from "@/app/posts";
import { Metadata } from "next";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `Posts tagged with "${decodedTag}"`,
    description: `"${decodedTag}" 태그가 포함된 모든 게시물 목록입니다.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const allPosts = await getPosts();
  const posts = allPosts.filter(p => p.tags?.includes(decodedTag));

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Tag: {decodedTag}</h1>
      <Posts posts={posts} />
    </div>
  );
}
