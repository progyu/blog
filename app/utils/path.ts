/**
 * 클라이언트 사이드에서 포스트 페이지인지 확인합니다.
 * @param pathname - 현재 pathname
 */
export function isPostPage(pathname: string): boolean {
  // /2025/ai-society-future 같은 패턴 매칭
  const postPagePattern = /^\/\d{4}\/[^\/]+\/?$/;
  return postPagePattern.test(pathname);
}