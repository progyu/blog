# API 참조 문서

## 주요 함수 및 컴포넌트

### 포스트 관리 (/app/get-posts.ts)

#### `getPosts()`

```typescript
export const getPosts = async (): Promise<Post[]>
```

- 파일시스템에서 모든 MDX 포스트를 읽어 Post 배열로 반환
- `src/posts/` 디렉토리 스캔하여 년도/ID 형식의 포스트 자동 파싱
- gray-matter로 frontmatter와 content 분리

#### `Post` 타입

```typescript
type Post = {
  id: string; // 포스트 ID
  date: string; // 발행일
  slug: string; // URL 슬러그 (year/id)
  title: string; // 제목
  description: string; // 설명
  content: string; // MDX 콘텐츠
  updatedAt?: string; // 수정일 (선택적)
};
```

### 메타데이터 유틸리티 (/app/utils/metadata.ts)

#### `extractTags(content: string, title: string): string[]`

- 콘텐츠와 제목에서 기술 키워드 추출
- AI, React, Next.js, TypeScript 등 미리 정의된 키워드 매칭
- SEO 태그 생성에 활용

#### `calculateReadingTime(content: string): number`

- 콘텐츠 읽기 시간 계산 (분 단위)
- 한국어: 350자/분, 영어: 200단어/분 기준

#### `generatePostMetadata(post: Post)`

- 포스트별 Next.js 메타데이터 객체 생성
- OpenGraph, Twitter Cards, JSON-LD 포함
- 동적 OG 이미지 경로 생성

#### `generateJsonLd(post: Post)`

- BlogPosting 스키마 JSON-LD 생성
- 구조화 데이터로 SEO 최적화
- 저자, 발행일, 읽기 시간 등 포함

### MDX 컴포넌트 시스템

#### 헤딩 컴포넌트

```typescript
// app/(post)/components/h1.tsx, h2.tsx, h3.tsx
export function H1({ children }); // #앵커 링크 자동 생성
```

#### `withHeadingId()` 유틸리티

```typescript
// app/(post)/components/utils.tsx
export function withHeadingId(children);
```

- `[#anchor-id]` 패턴을 앵커 링크로 변환
- 호버 시 # 링크 표시

#### 특수 컴포넌트

- `<Tweet>`: Twitter 임베드
- `<YouTube videoId="...">`: 유튜브 비디오
- `<Callout>`: 강조 박스
- `<Snippet>`: 코드 블록 (syntax highlighting)

### 테마 관리

#### `themeEffect()` 함수

```typescript
// app/theme-effect.ts
export const themeEffect = function()
```

- localStorage + 시스템 테마 감지
- 초기 로드 시 깜빡임 방지
- 다크/라이트 모드 자동 적용

#### `<ThemeToggle>` 컴포넌트

```typescript
// app/theme-toggle.tsx
export function ThemeToggle();
```

- 테마 전환 버튼 UI
- 상태 관리 및 localStorage 동기화

### 라우트 핸들러

#### OpenGraph 이미지 생성

```typescript
// app/og/[id]/route.tsx
export async function GET(_req: Request, props);
```

- 동적 OG 이미지 생성
- 포스트별 제목/메타데이터 기반

#### Atom 피드

```typescript
// app/atom/route.ts
export async function GET();
```

- RSS/Atom XML 피드 생성
- 최신 포스트 목록 제공

#### 사이트맵

```typescript
// app/sitemap.ts
export default async function sitemap();
```

- 동적 사이트맵 생성
- 모든 포스트 URL 포함

### 유틸리티 함수

#### 날짜 처리

```typescript
// app/utils/date.ts
export const parseDate = (date: string): Date
```

#### 경로 검사

```typescript
// app/utils/path.ts
export function isPostPage(pathname: string): boolean;
```

- 포스트 페이지 여부 판별
- JSON-LD 조건부 렌더링에 활용

## 설정 및 미들웨어

### Next.js 설정 (next.config.mjs)

- MDX 플러그인 체인 구성
- 원격 이미지 패턴 허용
- 페이지 확장자 설정

### 미들웨어 (middleware.tsx)

```typescript
export default async function middleware();
```

- 기본 보안 헤더 설정
- 라우팅 전처리

## 타입 정의

프로젝트의 모든 주요 타입은 각 모듈에서 개별적으로 정의되며, 대부분 TypeScript strict 모드가 비활성화된 상태에서 유연하게 작동합니다.
