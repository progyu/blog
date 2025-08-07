# 📚 문서 네비게이션 인덱스

LeeGyuHa 블로그 프로젝트의 종합 문서 가이드

---

## 📖 문서 구성

### 🏠 시작하기

- **[CLAUDE.md](./CLAUDE.md)** - Claude Code 작업 가이드
- **[Readme.md](./Readme.md)** - 프로젝트 기본 정보
- **[package.json](./package.json)** - 의존성 및 스크립트

### 🏗️ 아키텍처 & 구조

- **[PROJECT_INDEX.md](./PROJECT_INDEX.md)** - 전체 프로젝트 구조 및 아키텍처
- **[API_REFERENCE.md](./API_REFERENCE.md)** - 함수 및 컴포넌트 API 참조
- **[SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)** - 시스템 설계 명세서 및 기술 아키텍처
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - 구현 가이드 및 개발 로드맵

### ⚙️ 설정 파일

- **[next.config.mjs](./next.config.mjs)** - Next.js 및 MDX 설정
- **[tsconfig.json](./tsconfig.json)** - TypeScript 설정
- **[tailwind.config.js](./tailwind.config.js)** - Tailwind CSS 설정
- **[postcss.config.js](./postcss.config.js)** - PostCSS 설정

---

## 🔍 빠른 참조

### 개발 명령어

```bash
pnpm dev     # 개발 서버 시작
pnpm build   # 프로덕션 빌드
pnpm start   # 프로덕션 실행
```

### 핵심 디렉토리

```
app/                  # Next.js App Router
├── (post)/          # 포스트 라우팅 그룹
├── utils/           # 공통 유틸리티
└── components/      # 공통 컴포넌트

src/posts/           # MDX 포스트 파일
public/              # 정적 자산
fonts/               # 폰트 파일
```

### 주요 컴포넌트

- **PostPage** - 동적 포스트 렌더링
- **MDX Components** - 커스텀 MDX 컴포넌트들
- **ThemeToggle** - 다크/라이트 모드 토글

---

## 🔗 상호 참조

### 개발 워크플로우

1. [CLAUDE.md](./CLAUDE.md#개발-명령어) → 개발 환경 설정
2. [PROJECT_INDEX.md](./PROJECT_INDEX.md#새-포스트-작성) → 새 포스트 작성법
3. [API_REFERENCE.md](./API_REFERENCE.md#포스트-관리) → API 사용법

### 아키텍처 이해

1. [PROJECT_INDEX.md](./PROJECT_INDEX.md#아키텍처-구조) → 전체 구조 파악
2. [API_REFERENCE.md](./API_REFERENCE.md#mdx-컴포넌트-시스템) → 컴포넌트 시스템
3. [next.config.mjs](./next.config.mjs) → 빌드 설정

### 커스터마이징

1. [tailwind.config.js](./tailwind.config.js) → 스타일링 설정
2. [PROJECT_INDEX.md](./PROJECT_INDEX.md#스타일링-시스템) → 테마 시스템
3. [API_REFERENCE.md](./API_REFERENCE.md#테마-관리) → 테마 API

---

## 🎯 문서별 용도

| 문서                       | 언제 참조하나요?                      |
| -------------------------- | ------------------------------------- |
| **CLAUDE.md**              | Claude Code로 이 프로젝트 작업할 때   |
| **PROJECT_INDEX.md**       | 전체 프로젝트 구조를 파악하고 싶을 때 |
| **API_REFERENCE.md**       | 특정 함수나 컴포넌트 사용법을 찾을 때 |
| **DOCUMENTATION_INDEX.md** | 어떤 문서를 봐야 할지 모를 때         |

---

## 🏷️ 태그별 분류

### #개발환경

- CLAUDE.md, package.json, 설정 파일들

### #아키텍처

- PROJECT_INDEX.md, API_REFERENCE.md

### #MDX

- PROJECT_INDEX.md (MDX 처리 플로우)
- API_REFERENCE.md (MDX 컴포넌트)
- next.config.mjs (MDX 플러그인)

### #SEO

- PROJECT_INDEX.md (SEO 시스템)
- API_REFERENCE.md (메타데이터 유틸리티)

### #스타일링

- tailwind.config.js
- PROJECT_INDEX.md (스타일링 시스템)
- API_REFERENCE.md (테마 관리)

---

## 📝 문서 업데이트 로그

- **2025-08-07**: 초기 문서 인덱스 생성
- **2025-08-07**: CLAUDE.md, PROJECT_INDEX.md, API_REFERENCE.md 작성 완료
