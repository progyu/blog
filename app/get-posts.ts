import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

export type Post = {
  id: string;
  date: string;
  title: string;
  content: string;
};

const postRoot = join(process.cwd(), "app/(post)");

const getPostSlugs = () => {
  const dirs = fs.readdirSync(postRoot, { recursive: true });
  const paths = dirs.map(path => path);

  // MDX 파일만 필터링하고 년도/포스트ID 형식으로 변환
  return paths
    .filter((path: string) => {
      // page.mdx 파일만 선택하고, 년도/포스트ID 구조인지 확인
      const parts = path.split("/");
      return (
        parts.length === 3 &&
        parts[2] === "page.mdx" &&
        /^\d{4}$/.test(parts[0])
      ); // 첫 번째 부분이 4자리 년도인지 확인
    })
    .map((path: string) => {
      const parts = path.split("/");
      return `${parts[0]}/${parts[1]}`; // "2025/ai-society-future" 형식으로 반환
    });
};

const getPostBySlug = (slug: string): Post => {
  const [_, id] = slug.split("/");
  const fullPath = join(postRoot, `${slug}/page.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    id,
    title: data.title,
    date: data.date,
    content,
  };
};

export const getPosts = async () => {
  const posts = getPostSlugs().map(getPostBySlug);

  return posts;
};
