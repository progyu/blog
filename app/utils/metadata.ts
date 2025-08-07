import { Post } from "@/app/get-posts";

/**
 * 콘텐츠에서 태그/키워드 추출
 */
export function extractTags(content: string, title: string): string[] {
  const tags = new Set<string>();

  // 제목에서 키워드 추출
  const titleWords = title.split(/\s+/).filter(word => word.length > 2);
  titleWords.forEach(word => tags.add(word));

  // 자주 사용되는 기술 키워드 검색
  const techKeywords = [
    "AI",
    "인공지능",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "프론트엔드",
    "백엔드",
    "개발",
    "웹개발",
  ];

  techKeywords.forEach(keyword => {
    if (content.includes(keyword) || title.includes(keyword)) {
      tags.add(keyword);
    }
  });

  return Array.from(tags);
}

/**
 * 읽기 시간 계산 (한국어 기준)
 */
export function calculateReadingTime(content: string): number {
  // 한국어는 분당 약 300-400글자 읽기 속도
  const wordsPerMinute = 350;
  const contentLength = content.replace(/\s+/g, "").length; // 공백 제거 후 글자 수
  return Math.ceil(contentLength / wordsPerMinute);
}

/**
 * 포스트에서 구조화된 메타데이터 생성
 */
export function generatePostMetadata(post: Post) {
  const tags = extractTags(post.content, post.title);
  const readingTime = calculateReadingTime(post.content);

  return {
    title: `${post.title} | LeeGyuHa Blog`,
    description: post.description,
    keywords: tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: ["LeeGyuHa"],
      tags,
      url: `https://blog-leegyuha.vercel.app${post.slug}`,
      images: [
        {
          url: `https://blog-leegyuha.vercel.app/og/${post.id}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`https://blog-leegyuha.vercel.app/og/${post.id}`],
      creator: "@GyuHa10",
    },
    other: {
      "reading-time": `${readingTime}분`,
      "article:author": "LeeGyuHa",
      "article:published_time": post.date,
      "og:locale": "ko_KR",
    },
  };
}

/**
 * JSON-LD 구조화 데이터 생성
 */
export function generateJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `https://blog-leegyuha.vercel.app/og/${post.id}`,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: {
      "@type": "Person",
      name: "LeeGyuHa",
      url: "https://blog-leegyuha.vercel.app/about",
      sameAs: ["https://github.com/progyu", "https://twitter.com/GyuHa10"],
    },
    publisher: {
      "@type": "Person",
      name: "LeeGyuHa",
    },
    isPartOf: {
      "@type": "Blog",
      "@id": "https://blog-leegyuha.vercel.app",
      name: "LeeGyuHa Blog",
      description:
        "개발자 이규하의 기술 블로그입니다. AI, 웹 개발, 프론트엔드 기술에 대한 인사이트를 공유합니다.",
      url: "https://blog-leegyuha.vercel.app",
      inLanguage: "ko-KR",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://blog-leegyuha.vercel.app${post.slug}`,
    },
    wordCount: post.content.replace(/\s+/g, "").length,
    keywords: extractTags(post.content, post.title).join(", "),
    inLanguage: "ko-KR",
  };
}
