"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Post } from "../get-posts";
import {
  createSearchIndex,
  SearchResult,
  addToSearchHistory,
} from "../lib/search";

interface SearchContextType {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchIndex: Fuse<Post> | null;
  initializeSearch: (posts: Post[]) => void;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  navigateToPost: (slug: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

interface SearchProviderProps {
  children: React.ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchIndex, setSearchIndex] = useState<Fuse<Post> | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openSearch = useCallback(() => {
    setIsOpen(true);
    setSelectedIndex(0);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedIndex(0);
  }, []);

  const toggleSearch = useCallback(() => setIsOpen(prev => !prev), []);

  // 포스트로 이동하는 함수
  const navigateToPost = useCallback(
    (slug: string) => {
      closeSearch();
      router.push(`/${slug}`);
    },
    [router, closeSearch]
  );

  // 검색 인덱스 초기화
  const initializeSearch = useCallback((posts: Post[]) => {
    const index = createSearchIndex(posts);
    setSearchIndex(index);
  }, []);

  // 검색 실행 (debounced)
  useEffect(() => {
    if (!searchIndex || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const results = searchIndex.search(searchQuery, { limit: 10 });
      setSearchResults(results);
      setIsSearching(false);

      // 검색 기록에 추가
      if (searchQuery.trim().length > 2) {
        addToSearchHistory(searchQuery.trim());
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false);
    };
  }, [searchQuery, searchIndex]);

  // 단축키 설정
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }

      // ESC 키로 닫기
      if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleSearch, closeSearch]);

  const value: SearchContextType = {
    isOpen,
    openSearch,
    closeSearch,
    toggleSearch,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchIndex,
    initializeSearch,
    selectedIndex,
    setSelectedIndex,
    navigateToPost,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
