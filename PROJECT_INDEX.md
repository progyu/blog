# LeeGyuHa Blog - 프로젝트 인덱스

## 📋 개요

LeeGyuHa의 개인 기술 블로그 - Next.js 15 + MDX 기반의 현대적인 블로그 플랫폼

**핵심 기술**: Next.js 15, TypeScript, MDX, Tailwind CSS, Vercel

---

## 🏗️ 아키텍처 구조

### 프레임워크 & 기술 스택

```
Next.js 15 (App Router)
├── TypeScript (strict: false)
├── MDX (next-mdx-remote)
├── Tailwind CSS
├── Vercel Analytics
└── pnpm (패키지 매니저)
```

### 디렉토리 구조

```
blog/
├── app/                          # Next.js App Router
│   ├── (post)/                  # 포스트 그룹 라우트
│   │   ├── [year]/[id]/        # 동적 포스트 페이지
│   │   ├── components/         # MDX 커스텀 컴포넌트
│   │   ├── og/[id]/           # 동적 OpenGraph 이미지
│   │   └── layout.tsx         # 포스트 레이아웃
│   ├── utils/                 # 공통 유틸리티
│   ├── components/            # 공통 컴포넌트
│   └── layout.tsx            # 루트 레이아웃
├── src/posts/                # MDX 포스트 파일
│   └── [year]/[slug].mdx
├── public/                   # 정적 자산
└── fonts/                   # 폰트 파일
```

---

## 🔧 핵심 컴포넌트 & 함수

### 페이지 컴포넌트

| 컴포넌트     | 경로                               | 설명                          |
| ------------ | ---------------------------------- | ----------------------------- |
| `Home`       | `/app/page.tsx`                    | 메인 페이지, 포스트 목록 표시 |
| `PostPage`   | `/app/(post)/[year]/[id]/page.tsx` | 동적 포스트 페이지            |
| `RootLayout` | `/app/layout.tsx`                  | 전역 레이아웃, SEO 메타데이터 |

### MDX 컴포넌트 시스템

**경로**: `/app/(post)/components/`

| 컴포넌트         | 파일                         | 기능                 |
| ---------------- | ---------------------------- | -------------------- |
| `H1`, `H2`, `H3` | `h1.tsx`, `h2.tsx`, `h3.tsx` | 헤딩 + ID 앵커 링크  |
| `Code`           | `code.tsx`                   | 인라인 코드 스타일링 |
| `Snippet`        | `snippet.tsx`                | 코드 블록 하이라이팅 |
| `Tweet`          | `tweet.tsx`                  | 트위터 임베드        |
| `YouTube`        | `youtube.tsx`                | 유튜브 비디오 임베드 |
| `Image`          | `image.tsx`                  | 최적화된 이미지      |
| `Callout`        | `callout.tsx`                | 강조 박스            |

### 유틸리티 함수

**메타데이터 관리** (`/app/utils/metadata.ts`):

- `extractTags()`: 콘텐츠에서 태그/키워드 추출
- `calculateReadingTime()`: 읽기 시간 계산
- `generatePostMetadata()`: 포스트 메타데이터 생성
- `generateJsonLd()`: 구조화 데이터 생성

**포스트 관리** (`/app/get-posts.ts`):

- `getPosts()`: 파일시스템에서 MDX 포스트 읽기 및 파싱

**날짜 처리** (`/app/utils/date.ts`):

- `parseDate()`: 날짜 문자열 파싱

---

## 📝 MDX 처리 플로우

```
1. 파일시스템 스캔 (src/posts/[year]/[slug].mdx)
   ↓
2. gray-matter로 frontmatter 분리
   ↓
3. next-mdx-remote/rsc로 동적 컴파일
   ↓
4. 커스텀 컴포넌트 매핑 적용
   ↓
5. 렌더링 + SEO 메타데이터 생성
```

### MDX 플러그인 체인

```javascript
// next.config.mjs
remarkPlugins: [
  remarkGfm,           // GitHub Flavored Markdown
  remarkFrontmatter,   // YAML frontmatter
  [remarkMdxFrontmatter, { name: "metadata" }]
],
rehypePlugins: [
  rehypePrettyCode      // 코드 하이라이팅
]
```

---

## 🎨 스타일링 시스템

### Tailwind CSS 설정

**테마 기능**:

- 다크/라이트 모드 토글
- 시스템 테마 감지
- localStorage 상태 저장

**반응형 디자인**:

- 모바일 퍼스트 접근
- 최대 너비: `max-w-2xl`
- 반응형 패딩/마진

### 폰트 시스템

- **본문**: Inter (라틴 문자)
- **코드**: Roboto Mono
- **자동 로딩**: `/fonts/init.mjs` 스크립트

---

## 🔍 SEO & 메타데이터

### 구조화 데이터 (JSON-LD)

1. **Website 스키마**: 홈페이지 (조건부 렌더링)
2. **BlogPosting 스키마**: 포스트 페이지
3. **Person 스키마**: 저자 정보

### 동적 메타데이터

- **OpenGraph 이미지**: `/app/og/[id]/route.tsx`
- **메타 태그**: 포스트별 자동 생성
- **RSS/Atom 피드**: `/app/atom/route.ts`

---

## 🚀 배포 & 성능

### Vercel 최적화

- **정적 생성**: `revalidate = 60`
- **이미지 최적화**: Next.js Image + 31일 캐싱
- **번들 분석**: 자동 코드 스플리팅

### 성능 기능

- **원격 이미지 패턴**: Twitter, Amazon 등 허용
- **폰트 최적화**: 로컬 폰트 + 프리로딩
- **CSS 최적화**: Tailwind JIT 모드

---

## 🛠️ 개발 워크플로우

### 개발 명령어

```bash
# 개발 서버 시작
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 실행
pnpm start

# 의존성 설치 + 폰트 초기화
pnpm install
```

### 새 포스트 작성

1. `/src/posts/[year]/[slug].mdx` 파일 생성
2. Frontmatter 작성:
   ```yaml
   ---
   title: "포스트 제목"
   description: "포스트 설명"
   date: "2025-01-01T00:00:00.000Z"
   openGraph:
     images: ["/og/[slug]"]
   ---
   ```
3. MDX 콘텐츠 작성
4. 자동 메타데이터 & 라우팅 생성

---

## 🔧 주요 설정 파일

| 파일                 | 용도                     |
| -------------------- | ------------------------ |
| `next.config.mjs`    | Next.js + MDX 설정       |
| `tailwind.config.js` | Tailwind CSS 설정        |
| `tsconfig.json`      | TypeScript 설정          |
| `package.json`       | 의존성 & 스크립트        |
| `mdx-components.ts`  | 글로벌 MDX 컴포넌트 매핑 |

---

## 📚 참조

- [Next.js 15 문서](https://nextjs.org/docs)
- [MDX 문서](https://mdxjs.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Vercel 배포 가이드](https://vercel.com/docs)
