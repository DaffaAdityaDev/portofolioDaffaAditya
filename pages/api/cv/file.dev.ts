import { promises as fs } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { allowCvRequest, jsonBody, sendCvError } from '@/features/CvEditor/server/api';
import { CvPathError, resolveExistingCvPath, resolveWritableCvPath } from '@/features/CvEditor/server/paths';

/** Dev only: GET reads a .tex/.cls file in cv-src, PUT saves (or creates) a .tex file there. */

const MAX_CONTENT_CHARS = 1_000_000;

export const config = { api: { bodyParser: { sizeLimit: '2mb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowCvRequest(req, res, ['GET', 'PUT'])) return;
  try {
    if (req.method === 'GET') {
      const abs = await resolveExistingCvPath(req.query.path, 'read');
      if (!abs) throw new CvPathError('File not found', 404);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ content: await fs.readFile(abs, 'utf8') });
    }

    const { path: rel, content } = jsonBody(req);
    if (typeof content !== 'string') return res.status(400).json({ error: 'Missing content' });
    if (content.length > MAX_CONTENT_CHARS) return res.status(413).json({ error: 'File is too large' });
    await fs.writeFile(await resolveWritableCvPath(rel), content, 'utf8');
    return res.status(204).end();
  } catch (err) {
    return sendCvError(res, err, 'file');
  }
}
