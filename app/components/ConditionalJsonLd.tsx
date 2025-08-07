"use client";

import { usePathname } from "next/navigation";
import { isPostPage } from "@/app/utils/path";

interface WebsiteJsonLdProps {
  websiteData: any;
}

/**
 * 포스트 페이지가 아닐 때만 Website JSON-LD를 렌더링하는 컴포넌트
 */
export function ConditionalWebsiteJsonLd({ websiteData }: WebsiteJsonLdProps) {
  const pathname = usePathname();
  const shouldRenderWebsiteSchema = !isPostPage(pathname);

  if (!shouldRenderWebsiteSchema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteData)
      }}
    />
  );
}