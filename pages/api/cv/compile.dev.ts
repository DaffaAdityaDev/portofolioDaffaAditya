import type { NextApiRequest, NextApiResponse } from 'next';
import { allowCvRequest, jsonBody, sendCvError } from '@/features/CvEditor/server/api';
import { assertMain } from '@/features/CvEditor/server/paths';
import { compileCv } from '@/features/CvEditor/server/tectonic';

/** Dev only: compiles a main document and answers the PDF bytes, or 422 with Tectonic's log tail. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowCvRequest(req, res, ['POST'])) return;
  try {
    const result = await compileCv(await assertMain(jsonBody(req).main));
    if (!result.ok) return res.status(422).json({ error: result.error, log: result.log });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(result.pdf);
  } catch (err) {
    return sendCvError(res, err, 'compile');
  }
}
