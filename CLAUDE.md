# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

**개발 서버**: `pnpm dev` - Next.js 개발 서버 실행 (기본 포트 3000)
**빌드**: `pnpm build` - 프로덕션 빌드 생성
**프로덕션 실행**: `pnpm start` - 빌드된 앱 실행
**의존성 설치**: `pnpm install` - 패키지 설치 및 폰트 초기화 (`postinstall` 스크립트 실행)

**Lint/Type Check**: 별도 명령어 없음 - Next.js 빌드 시 기본 ESLint 실행됨

## 코드베이스 아키텍처

### 핵심 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict: false)
- **Content**: MDX with frontmatter (gray-matter)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Deployment**: Vercel

### 디렉토리 구조

**App Router 구조**:
- `/app/(post)/[year]/[id]/page.tsx`: 동적 포스트 페이지 (예: `/2025/ai-society-future`)
- `/app/(post)/components/`: MDX용 커스텀 컴포넌트들 (h1, h2, p, code, tweet, youtube 등)
- `/app/(post)/layout.tsx`: 포스트 레이아웃
- `/app/layout.tsx`: 루트 레이아웃 (메타데이터, SEO, JSON-LD)

**콘텐츠 관리**:
- `/src/posts/[year]/[slug].mdx`: 실제 포스트 파일들 (frontmatter + MDX 내용)
- `/app/get-posts.ts`: 포스트 파일 시스템 접근 및 메타데이터 파싱

**유틸리티**:
- `/app/utils/`: 메타데이터, MDX 컴포넌트, 날짜, 경로 유틸리티
- `/mdx-components.ts`: 글로벌 MDX 컴포넌트 매핑

### MDX 처리 시스템

**컴파일 과정**:
1. 파일시스템에서 MDX 읽기 (`get-posts.ts`)
2. gray-matter로 frontmatter/content 분리
3. `next-mdx-remote/rsc`로 동적 컴파일
4. 커스텀 컴포넌트 매핑으로 렌더링

**MDX 플러그인**:
- `remarkGfm`: GitHub Flavored Markdown
- `remarkFrontmatter`: YAML frontmatter 파싱  
- `remarkMdxFrontmatter`: frontmatter를 metadata로 변환
- `rehypePrettyCode`: 코드 하이라이팅

### SEO 및 메타데이터

**구조화된 데이터**:
- Website JSON-LD (홈페이지)
- BlogPosting JSON-LD (포스트 페이지)
- 조건부 렌더링으로 중복 방지

**메타데이터 생성**:
- 동적 OpenGraph 이미지: `/app/og/[id]/route.tsx`
- 포스트별 메타데이터: `generatePostMetadata()` 함수
- RSS/Atom 피드: `/app/atom/route.ts`

### 스타일링 시스템

**Tailwind 설정**:
- 다크 모드 지원 (`dark:` prefix)
- 커스텀 폰트: Inter (라틴), Roboto Mono (코드)
- 반응형 디자인 (모바일 퍼스트)

**테마 관리**:
- `/app/theme-effect.ts`: 초기 테마 설정 스크립트
- `/app/theme-toggle.tsx`: 테마 토글 컴포넌트

### 개발 시 주의사항

**파일 경로**: 
- 절대 경로 alias: `@/*` → 루트 디렉토리
- 포스트 경로: `src/posts/[year]/[slug].mdx` 형식 유지

**타입 설정**:
- strict 모드 비활성화 (`strict: false`)
- strictNullChecks만 활성화
- React 19 RC 타입 사용

**React 호환성**:
- React 19 RC 버전 사용
- `types-react@19.0.0-rc.1` 타입 오버라이드
- 하이드레이션 경고 억제 (`suppressHydrationWarning`)

**성능 최적화**:
- 이미지 캐싱 TTL: 31일 (2678400초)  
- 원격 이미지 패턴: Twitter, Amazon 등 허용
- MDX 동적 컴파일로 SSG 최적화