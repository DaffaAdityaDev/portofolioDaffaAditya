import { NextApiRequest, NextApiResponse } from 'next';
import { getSortedPostsData } from '../../lib/posts';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { skip, limit } = req.query;
  const skipNum = parseInt(skip as string, 10);
  const limitNum = parseInt(limit as string, 10);

  const allPosts = getSortedPostsData();
  const paginatedPosts = allPosts.slice(skipNum, skipNum + limitNum);

  res.status(200).json(paginatedPosts);
}
