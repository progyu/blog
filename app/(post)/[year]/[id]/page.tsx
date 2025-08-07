import { getPosts } from "@/app/get-posts";
import { generatePostMetadata, generateJsonLd } from "@/app/utils/metadata";
import { mdxComponents } from "@/mdx-components";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; id: string }>;
}) {
  const { year, id } = await params;
  const posts = await getPosts();
  const post = posts.find(p => p.slug === `${year}/${id}`);

  if (!post) {
    return {
      title: "Post Not Found | LeeGyuHa Blog",
      description: "요청하신 포스트를 찾을 수 없습니다.",
    };
  }

  return generatePostMetadata(post);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ year: string; id: string }>;
}) {
  const { year, id } = await params;
  const posts = await getPosts();
  const post = posts.find(p => p.slug === `${year}/${id}`);

  if (!post) {
    notFound();
  }

  const jsonLd = generateJsonLd(post);

  // MDX 컴파일
  const { content: mdxContent } = await compileMDX({
    source: post.content,
    components: mdxComponents,
  });

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* MDX 컨텐츠 렌더링 */}
      {mdxContent}
    </>
  );
}
