"use client";

import { useEffect } from "react";
import { SearchProvider as SearchContextProvider } from "../contexts/SearchContext";
import { SearchModal } from "./SearchModal";
import type { Post } from "../get-posts";
import { useSearch } from "../contexts/SearchContext";

// 검색 초기화를 위한 내부 컴포넌트
function SearchInitializer() {
  const { initializeSearch } = useSearch();

  useEffect(() => {
    async function loadPosts() {
      try {
        console.log("Starting to load posts for search...");
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const posts: Post[] = await response.json();
        console.log("Loaded posts for search:", posts);
        initializeSearch(posts);
      } catch (error) {
        console.error("Failed to load posts for search:", error);
      }
    }

    loadPosts();
  }, [initializeSearch]);

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
