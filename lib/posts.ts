import { POSTS_DATA } from '@/features/Blog/constants';
import type { PostData } from 'types/blog';

export function getSortedPostsData(limit?: number): PostData[] {
  // Filter out posts where production is false
  const productionPosts = POSTS_DATA.filter(post => post.production !== false);

  // Sort posts by date
  const sortedPosts = productionPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  return limit ? sortedPosts.slice(0, limit) : sortedPosts;
}

export function getAllPostIds() {
  const productionPosts = POSTS_DATA.filter(post => post.production !== false);

  return productionPosts.map((post) => {
    return {
      params: {
        id: post.id,
      },
    };
  });
}

export async function getPostData(id: string) {
  const post = POSTS_DATA.find((p) => p.id === id);
  if (!post) {
    throw new Error(`Post not found: ${id}`);
  }
  return post;
}

export function getPostsCount() {
  const allPosts = getSortedPostsData();
  return allPosts.length;
}
