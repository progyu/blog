import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import readingTime from "reading-time";

export type Post = {
  id: string;
  date: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  updatedAt?: string;
  readingTime: number;
  tags?: string[];
};

const postRoot = join(process.cwd(), "src/posts");

const getPostSlugs = () => {
  const dirs = fs.readdirSync(postRoot, { recursive: true });
  const paths = dirs.map(path => path);

  // MDX 파일만 필터링하고 년도/포스트ID 형식으로 변환
  return paths
    .filter(path => path.split("/").length === 2)
    .map(path => path.replace(/\.mdx$/, ""));
};

const getPostBySlug = (slug: string): Post => {
  const [_, id] = slug.split("/");
  const fullPath = join(postRoot, `${slug}.mdx`); // .mdx 확장자 직접 추가
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // reading-time 라이브러리로 읽기 시간 계산
  const time = Math.ceil(readingTime(content).minutes);

  return {
    id,
    date: data.date,
    slug,
    title: data.title,
    description: data.description,
    content,
    updatedAt: data.updatedAt,
    readingTime: time,
    tags: data.tags,
  };
};

export const getPosts = async () => {
  const posts = getPostSlugs().map(getPostBySlug);

  return posts;
};
