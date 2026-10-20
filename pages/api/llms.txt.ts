import { buildLlmsTxt, plainTextRoute } from '@/lib/llms';

// Served at /llms.txt through a rewrite in next.config.js (https://llmstxt.org).
export default plainTextRoute(buildLlmsTxt);
