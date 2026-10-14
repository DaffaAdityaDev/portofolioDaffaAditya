import type { NextApiRequest, NextApiResponse } from 'next';
import { allowCvRequest, sendCvError } from '@/features/CvEditor/server/api';
import { listCvFiles } from '@/features/CvEditor/server/paths';

/** Dev only: the editable .tex/.cls files in cv-src (main documents first) and the main documents. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowCvRequest(req, res, ['GET'])) return;
  try {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(await listCvFiles());
  } catch (err) {
    return sendCvError(res, err, 'files');
  }
}
