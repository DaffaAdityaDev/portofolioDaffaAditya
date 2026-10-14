import type { NextApiRequest, NextApiResponse } from 'next';
import { allowCvRequest, jsonBody, sendCvError } from '@/features/CvEditor/server/api';
import { assertMain } from '@/features/CvEditor/server/paths';
import { publishCv } from '@/features/CvEditor/server/publish';

/** Dev only: compiles a main document into the site's resume PDF and regenerates features/Resume/resumePdf.ts. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowCvRequest(req, res, ['POST'])) return;
  try {
    const result = await publishCv(await assertMain(jsonBody(req).main));
    if (!result.ok) return res.status(422).json({ error: result.error, log: result.log });
    return res.status(200).json({ path: result.path, hash: result.hash });
  } catch (err) {
    return sendCvError(res, err, 'publish');
  }
}
