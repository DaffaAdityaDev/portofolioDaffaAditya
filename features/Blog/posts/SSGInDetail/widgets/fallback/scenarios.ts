import type { FlowScenario, StepTone } from '@/features/Blog/flow/types';
import type {
  FallbackEdgeId,
  FallbackNodeId,
  FallbackScenarioId,
  FallbackStep,
} from '@/features/Blog/posts/SSGInDetail/widgets/fallback/types';

const step = (
  id: string,
  title: string,
  detail: string,
  activeNodes: FallbackNodeId[],
  activeEdges: FallbackEdgeId[],
  labels?: Partial<Record<FallbackNodeId, string>>,
  tone?: StepTone,
): FallbackStep => ({ id, title, detail, activeNodes, activeEdges, labels, tone });

export const FALLBACK_SCENARIOS: Record<FallbackScenarioId, FlowScenario<FallbackStep>> = {
  false: {
    id: 'false',
    label: 'fallback: false',
    summary: 'Only the paths returned at build time exist. Everything else is a 404 until the next build.',
    steps: [
      step(
        'request',
        'A request for an unbuilt page',
        'The post new-post was published in the CMS after the last build. Visitor A opens /blog/new-post. getStaticPaths did not return that slug, so no page was built for it.',
        ['visitorA', 'server'],
        ['a-server'],
        { server: 'not in paths' },
      ),
      step(
        'not-found',
        'Straight to 404',
        'The server answers 404 at once. getStaticProps does not run and the CMS is never asked, even though the post is there.',
        ['visitorA', 'server'],
        ['server-a'],
        { visitorA: '404 Not Found', cms: 'never asked' },
        'error',
      ),
      step(
        'again',
        'Same answer for everyone',
        'Visitor B gets the same 404. The page stays missing until you run next build again and the new slug lands in the paths list.',
        ['visitorB', 'server'],
        ['b-server', 'server-b'],
        { visitorB: '404 Not Found' },
        'error',
      ),
    ],
  },
  true: {
    id: 'true',
    label: 'fallback: true',
    summary:
      'The first visitor gets a loading shell at once, then the full page. Search engine crawlers skip the shell: Next.js treats them as blocking.',
    steps: [
      step(
        'request',
        'A request for an unbuilt page',
        'Visitor A opens /blog/new-post. The page is not in the cache, but fallback is true, so a missing path is not a 404.',
        ['visitorA', 'server', 'cache'],
        ['a-server'],
        { cache: 'miss' },
      ),
      step(
        'shell',
        'Send the fallback shell',
        'The server sends the fallback version of the page straight away: your component with empty props and router.isFallback set to true. Your code shows a skeleton instead of the post.',
        ['visitorA', 'server'],
        ['server-a'],
        { visitorA: 'loading shell' },
      ),
      step(
        'props',
        'Run getStaticProps',
        'Meanwhile the server runs getStaticProps for new-post, which asks the CMS for the post.',
        ['server', 'cms'],
        ['server-cms'],
        { cms: 'GET new-post' },
      ),
      step(
        'store',
        'Save the page',
        'The server saves the HTML and the JSON props in its page cache. From now on /blog/new-post counts as a built page.',
        ['server', 'cache'],
        ['server-cache'],
        { cache: 'HTML + JSON saved' },
        'recovery',
      ),
      step(
        'swap',
        'Swap in the post',
        'The browser of visitor A receives the JSON, and React re-renders with the real props. The skeleton is replaced by the post.',
        ['visitorA', 'server'],
        ['server-a'],
        { visitorA: 'full post' },
        'recovery',
      ),
      step(
        'next',
        'The next visitor',
        'Visitor B gets the full HTML from the cache, with no shell and no wait, like any page from the build.',
        ['visitorB', 'server', 'cache'],
        ['b-server', 'server-b'],
        { visitorB: 'full HTML', cache: 'hit' },
        'recovery',
      ),
    ],
  },
  blocking: {
    id: 'blocking',
    label: "fallback: 'blocking'",
    summary: 'The first visitor waits while the server builds the page, like SSR. Nobody ever sees a loading shell.',
    steps: [
      step(
        'request',
        'A request for an unbuilt page',
        'Visitor A opens /blog/new-post. The page is not in the cache, and the browser waits for an answer.',
        ['visitorA', 'server', 'cache'],
        ['a-server'],
        { visitorA: 'waiting', cache: 'miss' },
      ),
      step(
        'props',
        'Render while the visitor waits',
        'The server runs getStaticProps now and asks the CMS for the post. Visitor A is still waiting: this first request is as slow as SSR.',
        ['visitorA', 'server', 'cms'],
        ['server-cms'],
        { visitorA: 'waiting', cms: 'GET new-post' },
      ),
      step(
        'send',
        'Send the full page',
        'The server sends the finished HTML. Visitor A goes from a blank tab to the full post, with no loading state in between.',
        ['visitorA', 'server'],
        ['server-a'],
        { visitorA: 'full post' },
        'recovery',
      ),
      step(
        'store',
        'Save the page',
        'At the same time the server saves the page in its cache, so the work happens once per path.',
        ['server', 'cache'],
        ['server-cache'],
        { cache: 'HTML + JSON saved' },
        'recovery',
      ),
      step(
        'next',
        'The next visitor',
        'Visitor B gets the cached HTML right away.',
        ['visitorB', 'server', 'cache'],
        ['b-server', 'server-b'],
        { visitorB: 'full HTML', cache: 'hit' },
        'recovery',
      ),
    ],
  },
};

export const FALLBACK_SCENARIO_ORDER: FallbackScenarioId[] = ['false', 'true', 'blocking'];
