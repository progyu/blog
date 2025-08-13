"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Command } from "cmdk";
import DOMPurify from "isomorphic-dompurify";
import { useSearch } from "../contexts/SearchContext";
import { getSearchHistory, highlightText } from "../lib/search";

export function SearchModal() {
  const {
    isOpen,
    closeSearch,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    selectedIndex,
    setSelectedIndex,
    navigateToPost,
  } = useSearch();

  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSearchHistory(getSearchHistory());
    }
  }, [isOpen]);

  // 선택 가능한 항목들 생성
  const selectableItems = useMemo(() => [
    ...(!searchQuery
      ? searchHistory.map(query => ({ type: "history" as const, data: query }))
      : []),
    ...(searchQuery
      ? searchResults.map(result => ({ type: "result" as const, data: result }))
      : []),
  ], [searchQuery, searchHistory, searchResults]);

  // 선택 핸들러
  const handleSelect = useCallback((item: (typeof selectableItems)[0]) => {
    if (item.type === "history") {
      setSearchQuery(item.data);
    } else if (item.type === "result") {
      navigateToPost(item.data.item.slug);
    }
  }, [setSearchQuery, navigateToPost]);

  // 키보드 네비게이션 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev =>
            Math.min(prev + 1, selectableItems.length - 1)
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (selectableItems[selectedIndex]) {
            handleSelect(selectableItems[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, selectableItems, setSelectedIndex, handleSelect]);

  // selectedIndex를 선택 가능한 항목 수에 맞게 조정
  useEffect(() => {
    if (selectedIndex >= selectableItems.length && selectableItems.length > 0) {
      setSelectedIndex(0);
    }
  }, [selectableItems.length, selectedIndex, setSelectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={closeSearch}
      />

      {/* 모달 */}
      <div className="fixed inset-x-0 top-20 mx-auto max-w-2xl z-50 px-4">
        <Command 
          className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          role="dialog"
          aria-labelledby="search-title"
          aria-describedby="search-description"
        >
          {/* 검색 입력창 */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
            <SearchIcon className="mr-3 text-gray-400" />
            <Command.Input
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="검색어를 입력하세요..."
              className="flex-1 py-4 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
              aria-label="검색어 입력"
              aria-describedby="search-help"
              autoFocus
            />
            <span className="text-xs text-gray-400 ml-2">ESC 닫기</span>
          </div>

          {/* 검색 결과 */}
          <Command.List className="max-h-96 overflow-y-auto p-2">
            {/* 검색중 표시 */}
            {isSearching && (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                검색중...
              </div>
            )}

            {/* 검색 기록 */}
            {!searchQuery && searchHistory.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  최근 검색
                </div>
                {searchHistory.map((query, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <Command.Item
                      key={query}
                      value={query}
                      onSelect={() =>
                        handleSelect({ type: "history", data: query })
                      }
                      className={`flex items-center px-4 py-2 cursor-pointer rounded-md transition-colors ${
                        isSelected
                          ? "bg-blue-100 dark:bg-blue-900/50 border-l-2 border-blue-500"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      data-selected={isSelected}
                    >
                      <HistoryIcon className="mr-3 text-gray-400" />
                      <span
                        className={`${
                          isSelected
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {query}
                      </span>
                    </Command.Item>
                  );
                })}
              </>
            )}

            {/* 검색 결과 */}
            {searchQuery && !isSearching && (
              <>
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      검색 결과 ({searchResults.length}개)
                    </div>
                    {searchResults.map((result, index) => {
                      const { item: post, matches } = result;
                      const year = new Date(post.date).getFullYear();
                      const isSelected = selectedIndex === index;

                      return (
                        <Command.Item
                          key={post.slug}
                          value={`${post.title} ${
                            post.description
                          } ${post.tags?.join(" ")} ${post.content}`}
                          onSelect={() =>
                            handleSelect({ type: "result", data: result })
                          }
                          className={`block px-4 py-3 cursor-pointer rounded-md transition-colors ${
                            isSelected
                              ? "bg-blue-100 dark:bg-blue-900/50 border-l-2 border-blue-500"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                          data-selected={isSelected}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <PostIcon className="text-gray-400" />
                                <h3
                                  className={`font-medium ${
                                    isSelected
                                      ? "text-blue-700 dark:text-blue-300"
                                      : "text-gray-900 dark:text-gray-100"
                                  }`}
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                      matches
                                        ? highlightText(
                                            post.title,
                                            matches,
                                            "title"
                                          )
                                        : post.title
                                    ),
                                  }}
                                />
                                <span className="text-xs text-gray-500">
                                  {year}
                                </span>
                              </div>
                              {post.description && (
                                <p
                                  className={`text-sm line-clamp-2 ${
                                    isSelected
                                      ? "text-blue-600 dark:text-blue-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                      matches
                                        ? highlightText(
                                            post.description,
                                            matches,
                                            "description"
                                          )
                                        : post.description
                                    ),
                                  }}
                                />
                              )}
                              {post.content && (
                                <p
                                  className={`text-sm line-clamp-2 ${
                                    isSelected
                                      ? "text-blue-600 dark:text-blue-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                      matches
                                        ? highlightText(
                                            post.content,
                                            matches,
                                            "content"
                                          )
                                        : post.content
                                    ),
                                  }}
                                />
                              )}
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {post.tags.map(tag => (
                                    <span
                                      key={tag}
                                      className={`text-xs px-2 py-0.5 rounded ${
                                        isSelected
                                          ? "bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
                                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                      }`}
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Command.Item>
                      );
                    })}
                  </>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {`${searchQuery}에 대한 검색 결과가 없습니다`}
                  </div>
                )}
              </>
            )}

            {/* 검색어 없을 때 */}
            {!searchQuery && searchHistory.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                검색어를 입력하세요
              </div>
            )}
          </Command.List>

          {/* 하단 도움말 */}
          <div 
            className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
            id="search-help"
          >
            <div className="flex gap-4">
              <span>↑↓ 이동</span>
              <span>↵ 선택</span>
            </div>
            <span>⌘K 단축키</span>
          </div>
        </Command>
      </div>
    </>
  );
}

// 아이콘 컴포넌트들
function SearchIcon({ className = "" }) {
  return (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function HistoryIcon({ className = "" }) {
  return (
    <svg
      className={`w-4 h-4 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function PostIcon({ className = "" }) {
  return (
    <svg
      className={`w-4 h-4 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
