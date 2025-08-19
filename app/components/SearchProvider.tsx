"use client";

import { useEffect, useState } from "react";
import { SearchProvider as SearchContextProvider } from "../contexts/SearchContext";
import { SearchModal } from "./SearchModal";
import type { Post } from "../get-posts";
import { useSearch } from "../contexts/SearchContext";

// 검색 초기화를 위한 내부 컴포넌트
function SearchInitializer() {
  const { initializeSearch } = useSearch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }
        const posts: Post[] = await response.json();
        initializeSearch(posts);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "검색 데이터를 불러오는데 실패했습니다.";
        setError(errorMessage);
        console.error("Failed to load posts for search:", error);
      }
    }

    loadPosts();
  }, [initializeSearch]);

  // 에러가 있을 경우 에러 메시지 표시 (개발 환경에서만)
  if (error && process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
        검색 기능 초기화 실패: {error}
      </div>
    );
  }

  return null;
}

// SearchProvider 래퍼 컴포넌트
export function SearchProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchContextProvider>
      <SearchInitializer />
      {children}
      <SearchModal />
    </SearchContextProvider>
  );
}
