import { POSTS_DATA } from '@/features/Blog/constants';
import type { PostData } from '@/types/blog';

const isPublished = (post: PostData): boolean => post.production !== false;

/** Newest first; posts from the same day by id, so the order never depends on the list's order. */
const byDateDesc = (a: PostData, b: PostData): number =>
  b.date.localeCompare(a.date) || a.id.localeCompare(b.id);

export function getSortedPostsData(limit?: number): PostData[] {
  const sortedPosts = POSTS_DATA.filter(isPublished).sort(byDateDesc);
  return limit ? sortedPosts.slice(0, limit) : sortedPosts;
}

export function getAllPostIds() {
  return POSTS_DATA.filter(isPublished).map((post) => ({ params: { id: post.id } }));
}

export function getPostData(id: string): PostData | undefined {
  return POSTS_DATA.find((post) => post.id === id);
}
