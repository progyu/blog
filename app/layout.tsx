import "./globals.css";

import { Inter } from "next/font/google";
import { themeEffect } from "./theme-effect";
import { Analytics } from "./analytics";
import { Header } from "./header";
import { Footer } from "./footer";
import { ConditionalWebsiteJsonLd } from "./components/ConditionalJsonLd";
import { getPosts } from "./get-posts";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "LeeGyuHa Blog",
    template: "%s | LeeGyuHa Blog",
  },
  description:
    "개발자 이규하의 기술 블로그입니다. AI, 웹 개발, 프론트엔드 기술에 대한 인사이트를 공유합니다.",
  keywords: [
    "개발자",
    "AI",
    "웹개발",
    "프론트엔드",
    "기술블로그",
    "LeeGyuHa",
    "Next.js",
    "React",
    "JavaScript",
    "TypeScript",
  ],
  authors: [{ name: "LeeGyuHa", url: "https://blog-leegyuha.vercel.app" }],
  creator: "LeeGyuHa",
  publisher: "LeeGyuHa",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://blog-leegyuha.vercel.app/",
    siteName: "LeeGyuHa Blog",
    title: "LeeGyuHa Blog",
    description:
      "개발자 이규하의 기술 블로그입니다. AI, 웹 개발, 프론트엔드 기술에 대한 인사이트를 공유합니다.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "LeeGyuHa Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeeGyuHa Blog",
    description:
      "개발자 이규하의 기술 블로그입니다. AI, 웹 개발, 프론트엔드 기술에 대한 인사이트를 공유합니다.",
    site: "@GyuHa10",
    creator: "@GyuHa10",
    images: ["/opengraph-image"],
  },
  alternates: {
    types: {
      "application/atom+xml": "https://blog-leegyuha.vercel.app/atom",
      "application/rss+xml": "https://blog-leegyuha.vercel.app/rss",
    },
  },
  verification: {
    google: "google-site-verification-code", // Google Search Console에서 받은 코드
  },
  category: "technology",
  metadataBase: new URL("https://blog-leegyuha.vercel.app/"),
};

export const viewport = {
  themeColor: "transparent",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getPosts();

  return (
    <html
      lang="ko"
      className={`${inter.className} antialiased`}
      suppressHydrationWarning={true}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();`,
          }}
        />
      </head>

      <body className="dark:text-gray-100 max-w-2xl m-auto">
        {/* 조건부 Website JSON-LD (포스트 페이지가 아닐 때만) */}
        <ConditionalWebsiteJsonLd
          websiteData={{
            "@context": "https://schema.org",
            "@type": "Website",
            name: "LeeGyuHa Blog",
            description:
              "개발자 이규하의 기술 블로그입니다. AI, 웹 개발, 프론트엔드 기술에 대한 인사이트를 공유합니다.",
            url: "https://blog-leegyuha.vercel.app",
            author: {
              "@type": "Person",
              name: "LeeGyuHa",
              url: "https://blog-leegyuha.vercel.app/about",
              sameAs: [
                "https://github.com/LeeGyuHa",
                "https://twitter.com/GyuHa10",
              ],
            },
            publisher: {
              "@type": "Person",
              name: "LeeGyuHa",
            },
            inLanguage: "ko-KR",
            copyrightYear: new Date().getFullYear(),
          }}
        />

        <main className="p-6 pt-3 md:pt-6 min-h-screen">
          <Header posts={posts} />
          {children}
        </main>

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
