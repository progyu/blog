import postsData from "./posts.json";

export type Post = {
  id: string;
  date: string;
  title: string;
};

export const getPosts = async () => {
  const posts = postsData.posts.map((post): Post => {
    return {
      ...post,
    };
  });
  return posts;
};
