import { buildLlmsFullTxt, plainTextRoute } from '@/lib/llms';

// Served at /llms-full.txt through a rewrite in next.config.js: /llms.txt with every detail expanded.
export default plainTextRoute(buildLlmsFullTxt);
