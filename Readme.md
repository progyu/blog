# LeeGyuHa Blog

개인 블로그 - Next.js 15와 MDX를 활용한 현대적인
블로그 시스템

[rauchg/blog](https://github.com/rauchg/blog)와 [hajoeun/blog](https://github.com/hajoeun/blog)를 기반으로 만들었습니다.

## ✨ 주요 기능

- **MDX 기반 콘텐츠**: Frontmatter와 함께 리치한 콘텐츠
- **동적 라우팅**: `/[year]/[id]` 형식의 SEO 친화적 URL
- **읽기 시간 표시**: 포스트별 예상 읽기 시간 자동 계산
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **다크/라이트 모드**: 사용자 선호에 맞는 테마 지원
- **SEO 최적화**: 구조화된 데이터, 메타태그, OpenGraph
  이미지
- **RSS/Atom 피드**: 콘텐츠 구독 지원
- **성능 최적화**: Next.js 15 App Router와 최신 React 19 RC
  사용

## 🛠 기술 스택

### 핵심 기술

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Content**: MDX with gray-matter
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

### 주요 라이브러리

- `next-mdx-remote`: 동적 MDX 컴파일
- `gray-matter`: Frontmatter 파싱
- `reading-time`: 포스트 읽기 시간 계산
- `react-tweet`: Twitter 임베드
- `react-youtube`: YouTube 임베드
- `rehype-pretty-code`: 코드 하이라이팅
- `@vercel/analytics`: 웹사이트 분석

## 🚀 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

http://localhost:3000 에서 확인

### 빌드

```bash
pnpm build
```

### 프로덕션 실행

```bash
pnpm start
```

## 📁 프로젝트 구조

```
├── app/                          # Next.js App Router
│   ├── (post)/                   # 포스트 관련 라우트 그룹
│   │   ├── [year]/[id]/         # 동적 포스트 페이지
│   │   ├── components/          # MDX 커스텀 컴포넌트
│   │   └── layout.tsx           # 포스트 레이아웃
│   ├── about/                   # About 페이지
│   ├── atom/                    # RSS/Atom 피드
│   ├── og/                      # OpenGraph 이미지 생성
│   └── utils/                   # 유틸리티 함수
├── src/posts/                   # MDX 포스트 파일
│   └── [year]/                  # 연도별 포스트 구성
├── fonts/                       # 로컬 폰트 파일
├── public/                      # 정적 파일
└── mdx-components.ts            # 글로벌 MDX 컴포넌트 매핑
```

## ✍️ 포스트 작성

### 새 포스트 생성

1.  `src/posts/[year]/[id].mdx` 파일 생성
2.  Frontmatter 추가:

```yaml
---
title: 포스트 제목
description: 포스트 설명
date: "2025-01-01T00:00:00.000Z"
openGraph:
  images: ["/og/post-slug"]
---
```

3.  MDX 콘텐츠 작성

### 사용 가능한 컴포넌트

- `<Tweet id="..." />`: Twitter 트윗 임베드
- `<YouTube id="..." />`: YouTube 영상 임베드
- `<Callout>`: 강조 박스
- `<Figure>`: 이미지 캡션
- 기본 MDX 컴포넌트 (h1-h6, p, code, blockquote 등)

## 🎨 스타일링

### Tailwind CSS

- 다크 모드: `dark:` prefix 사용
- 반응형: `sm:`, `md:`, `lg:`, `xl:` breakpoints
- 커스텀 폰트: Inter (본문), Roboto Mono (코드)

### 테마 시스템

- 자동 테마 감지
- 수동 테마 토글 가능
- 하이드레이션 깜빡임 방지

## 📊 SEO 및 메타데이터

### 구조화된 데이터

- Website JSON-LD (홈페이지)
- BlogPosting JSON-LD (포스트)
- 자동 메타데이터 생성

### OpenGraph 이미지

- 동적 OG 이미지 생성 (`/og/[id]/route.tsx`)
- 포스트별 맞춤형 이미지

### RSS/Atom 피드

- `/atom` 경로에서 피드 제공
- 최신 포스트 자동 포함

### 폰트 최적화

- 로컬 폰트 파일 사용
- `postinstall` 스크립트로 자동 초기화

## 🚀 배포

Vercel 배포

### 환경 변수

현재 추가 환경 변수 불필요

## 📝 라이선스

MIT License
