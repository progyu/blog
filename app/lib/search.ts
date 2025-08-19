import Fuse from "fuse.js";
import { Post } from "../get-posts";
import type { FuseResult } from "fuse.js";

// Fuse.js 검색 옵션 설정
const fuseOptions = {
  // 검색할 필드와 가중치
  keys: [
    { name: "title", weight: 0.4 },
    { name: "tags", weight: 0.3 },
    { name: "description", weight: 0.2 },
    { name: "content", weight: 0.1 },
  ],
  // 검색 정확도 (0 = 완벽한 매치, 1 = 모든 것 매치)
  threshold: 0.3,
  // 매칭된 부분을 포함할지 여부
  includeMatches: true,
  // 검색 결과에 점수 포함
  includeScore: true,
  // 최소 매치 문자 길이
  minMatchCharLength: 2,
  // 오타 허용
  ignoreLocation: true,
  // 대소문자 구분 안함
  isCaseSensitive: false,
  // 필드 길이 정규화
  ignoreFieldNorm: false,
  // 매치 위치 정보
  shouldSort: true,
};

// 검색 결과 타입
export type SearchResult = FuseResult<Post>;

// 검색 인덱스 생성
export function createSearchIndex(posts: Post[]): Fuse<Post> {
  return new Fuse(posts, fuseOptions);
}

// 검색 실행
export function searchPosts(
  searchIndex: Fuse<Post>,
  query: string,
  limit: number = 10
): SearchResult[] {
  if (!query || query.trim() === "") {
    return [];
  }

  const results = searchIndex.search(query, { limit });
  return results;
}

// 검색어 하이라이팅을 위한 유틸 함수
export function highlightText(
  text: string,
  matches: SearchResult["matches"],
  fieldName: string
): string {
  const match = matches?.find(m => m.key === fieldName);
  if (!match) return text;

  // 역순으로 정렬하여 문자열 인덱스가 변경되지 않도록 함
  const indices = match.indices.slice().sort((a, b) => b[0] - a[0]);
  let result = text;

  for (const [start, end] of indices) {
    result = 
      result.slice(0, start) +
      "<mark class=\"bg-yellow-200 dark:bg-yellow-800\">" +
      result.slice(start, end + 1) +
      "</mark>" +
      result.slice(end + 1);
  }

  return result;
}

// 검색 기록 관리
const SEARCH_HISTORY_KEY = "blog-search-history";
const MAX_HISTORY_ITEMS = 5;

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];

  const history = localStorage.getItem(SEARCH_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

export function addToSearchHistory(query: string): void {
  if (typeof window === "undefined" || !query.trim()) return;

  const history = getSearchHistory();
  const newHistory = [query, ...history.filter(item => item !== query)].slice(
    0,
    MAX_HISTORY_ITEMS
  );

  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
}

export function clearSearchHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SEARCH_HISTORY_KEY);
}
