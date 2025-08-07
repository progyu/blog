# 구현 가이드

## 🎯 즉시 실행 가능한 개선사항

### 1. SEO 최적화 검증 및 개선

#### 현재 상태 점검

```bash
# Lighthouse 성능 측정
npx lighthouse https://your-blog-url --view

# Core Web Vitals 확인
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

#### 개선 작업

- [ ] 메타 태그 완전성 검증
- [ ] 구조화 데이터 스키마 검증 ([Schema Validator](https://validator.schema.org/))
- [ ] 사이트맵 XML 형식 최적화
- [ ] 로봇.txt 규칙 정비

### 2. 접근성 감사 및 개선

#### 도구 설치

```bash
npm install -D @axe-core/cli
npm install -D lighthouse
```

#### 접근성 점검 목록

- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 호환성 (NVDA, JAWS 테스트)
- [ ] 색상 대비 비율 검증 (WCAG AA 기준)
- [ ] Alt 텍스트 및 ARIA 레이블 완전성

#### 구현 예시

```tsx
// 개선된 이미지 컴포넌트
export function Image({ src, alt, caption, ...props }) {
  return (
    <figure>
      <NextImage
        src={src}
        alt={alt}
        {...props}
        // 접근성 개선
        role="img"
        loading="lazy"
      />
      {caption && (
        <figcaption className="sr-only md:not-sr-only">{caption}</figcaption>
      )}
    </figure>
  );
}
```

### 3. 성능 최적화 구현

#### 번들 분석 및 최적화

```bash
# Bundle Analyzer 설치
npm install -D @next/bundle-analyzer

# 분석 실행
ANALYZE=true npm run build
```

#### 이미지 최적화 개선

```tsx
// next.config.mjs 개선
export default withMDX({
  images: {
    // 현재: minimumCacheTTL: 2678400
    minimumCacheTTL: 31536000, // 1년 캐싱으로 개선
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // 실험적 기능 활성화
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
});
```

---

## 🔧 중기 개발 로드맵 (1-2개월)

### 1. 검색 기능 구현

#### Option A: Fuse.js (클라이언트 사이드)

```bash
npm install fuse.js
```

```tsx
// app/components/Search.tsx
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import type { Post } from "@/app/get-posts";

interface SearchProps {
  posts: Post[];
}

export function Search({ posts }: SearchProps) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "description", "content"],
        threshold: 0.3,
        includeScore: true,
      }),
    [posts]
  );

  const results = query ? fuse.search(query).map(result => result.item) : [];

  return (
    <div className="search-container">
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="포스트 검색..."
        className="w-full p-2 border rounded"
      />
      <SearchResults results={results} />
    </div>
  );
}
```

#### Option B: Algolia (서버 사이드)

```bash
npm install algoliasearch instantsearch.js
```

### 2. 댓글 시스템 통합 (giscus)

#### 설치 및 설정

```bash
npm install @giscus/react
```

```tsx
// app/(post)/components/Comments.tsx
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function Comments() {
  const { theme } = useTheme();

  return (
    <Giscus
      id="comments"
      repo="your-username/your-blog"
      repoId="your-repo-id"
      category="Announcements"
      categoryId="your-category-id"
      mapping="pathname"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === "dark" ? "dark" : "light"}
      lang="ko"
    />
  );
}
```

### 3. 카테고리/태그 시스템

#### 타입 정의 확장

```typescript
// app/types/post.ts
export interface Post {
  id: string;
  date: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  updatedAt?: string;
  // 새로운 필드들
  category?: string;
  tags?: string[];
  series?: string;
  featured?: boolean;
}
```

#### 카테고리 페이지 생성

```tsx
// app/category/[slug]/page.tsx
export default function CategoryPage({ params }) {
  // 카테고리별 포스트 필터링 로직
}

// app/tag/[slug]/page.tsx
export default function TagPage({ params }) {
  // 태그별 포스트 필터링 로직
}
```

---

## 🌟 장기 개발 로드맵 (3-6개월)

### 1. 다국어 지원 준비

#### i18n 라이브러리 도입

```bash
npm install next-intl
```

#### 디렉토리 구조 개편

```
app/
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   └── (post)/
│       └── [year]/[id]/page.tsx
├── i18n/
│   ├── messages/
│   │   ├── en.json
│   │   └── ko.json
│   └── config.ts
└── middleware.ts  // 언어 감지
```

### 2. CMS 인터페이스 설계

#### Headless CMS 옵션 비교

| CMS            | 장점                | 단점         | 적합성     |
| -------------- | ------------------- | ------------ | ---------- |
| **Contentful** | 강력한 API, 좋은 UX | 비용, 복잡성 | ⭐⭐⭐     |
| **Strapi**     | 오픈소스, 자유도    | 호스팅 필요  | ⭐⭐⭐⭐   |
| **Sanity**     | 실시간 협업         | 학습 곡선    | ⭐⭐⭐⭐   |
| **NetlifyCMS** | 간단함, Git 기반    | 제한적 기능  | ⭐⭐⭐⭐⭐ |

#### 권장: NetlifyCMS (단순함 + Git 통합)

```yaml
# public/admin/config.yml
backend:
  name: git-gateway
  branch: main

media_folder: "public/images"
public_folder: "/images"

collections:
  - name: "posts"
    label: "Posts"
    folder: "src/posts"
    create: true
    slug: "{{year}}/{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Description", name: "description", widget: "text" }
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "Body", name: "body", widget: "markdown" }
```

### 3. API 설계 및 구현

#### GraphQL API 구조

```typescript
// app/api/graphql/schema.ts
import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    slug: String!
    content: String!
    publishedAt: String!
    category: Category
    tags: [Tag!]!
  }

  type Query {
    posts(first: Int, after: String): PostConnection!
    post(slug: String!): Post
    categories: [Category!]!
    tags: [Tag!]!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
  }
`;
```

---

## ⚡ 성능 최적화 체크리스트

### Core Web Vitals 개선

- [ ] **LCP < 2.5s**: Hero 이미지 최적화, 중요 리소스 우선로딩
- [ ] **FID < 100ms**: JavaScript 번들 크기 최적화, 코드 스플리팅
- [ ] **CLS < 0.1**: 이미지 크기 사전 지정, 폰트 로딩 최적화

### 실행 가능한 최적화

```typescript
// 1. 동적 임포트로 코드 스플리팅
const Comments = dynamic(() => import("./Comments"), {
  loading: () => <div>댓글을 불러오는 중...</div>,
  ssr: false,
});

// 2. 이미지 지연 로딩 및 최적화
<Image
  src="/hero.jpg"
  alt="Hero image"
  priority={isAboveTheFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>;

// 3. 폰트 최적화
// next.config.mjs
module.exports = {
  optimizeFonts: true,
  fontLoaders: [
    { loader: "@next/font/google", options: { subsets: ["latin"] } },
  ],
};
```

---

## 🔒 보안 강화 가이드

### 1. Content Security Policy 구현

```typescript
// next.config.mjs
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.live;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' vitals.vercel-insights.com;
    `
      .replace(/\s{2,}/g, " ")
      .trim(),
  },
];

export default {
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};
```

### 2. 환경 변수 보안

```bash
# .env.local (예시)
NEXT_PUBLIC_SITE_URL=https://blog.leegyuha.com
GISCUS_REPO_ID=your-repo-id
ANALYTICS_ID=your-analytics-id

# Vercel 환경변수로 관리
vercel env add GISCUS_REPO_ID
```

---

## 📊 모니터링 및 분석

### 1. 성능 모니터링 도구

```typescript
// app/utils/analytics.ts
import { track } from "@vercel/analytics";

export function trackPageView(url: string) {
  track("page_view", { url });
}

export function trackPostRead(postId: string, readingTime: number) {
  track("post_read", { postId, readingTime });
}
```

### 2. 에러 추적 (Sentry)

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

이 구현 가이드를 통해 체계적으로 블로그를 개선하고 확장해 나갈 수 있습니다!
