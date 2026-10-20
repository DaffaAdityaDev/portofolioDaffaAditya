import React from 'react';
import Callout from '@/features/Blog/components/Callout';
import CodeBlock from '@/features/Blog/components/CodeBlock';
import Reveal from '@/features/Blog/components/Reveal';
import { lazyOnView } from '@/features/Blog/components/LazyOnView';
import BlogTable from '@/features/Blog/components/BlogTable';

// Every widget sits below the first screen: its HTML is in the static page, its JS loads on scroll.
const FallbackModesVisualizer = lazyOnView(() => import('./widgets/fallback/components/FallbackModesVisualizer'));
const RevalidationTimeline = lazyOnView(() => import('./widgets/revalidation/components/RevalidationTimeline'));

export default function SSGInDetail() {
  return (
    <div className="blog-content-static">
      <p>When a page is rendered on request, the server repeats the same work for every visitor: fetch the data, build the HTML, send it back. If 1,000 people open the same blog post, that work happens 1,000 times, and the result is the same every time.</p>

      <p>Static Site Generation (SSG) moves that work to build time. The HTML is made once, stored, and served as a plain file. You will see:</p>
      <ul>
        <li>when a page needs <strong>getStaticProps</strong>, <strong>getStaticPaths</strong>, or neither,</li>
        <li>how <strong>ISR</strong> keeps built pages up to date, on a timer or when your CMS says so,</li>
        <li>what <strong>fallback</strong> does for pages you did not build,</li>
        <li>and when SSG is the wrong choice.</li>
      </ul>

      <p>The examples use the Next.js <strong>Pages Router</strong>. If you use the App Router, the ideas are the same, and a table near the end maps each name to its App Router version.</p>

      <Reveal>
        <h2>Rendering on every request vs once</h2>

        <p>Building the HTML on each request is called server-side rendering (SSR).</p>

        <p>Think of a restaurant. SSR cooks each dish after the customer orders it. SSG cooks the whole menu before the doors open, so every customer is served at once. That only works if every customer wants the same dish.</p>

        <p>So for each page, ask one question: <strong>can I build this page before anyone asks for it?</strong></p>
        <ul>
          <li><strong>Yes:</strong> the page is the same for every visitor and the data exists ahead of time. Blog posts, docs, marketing pages and product listings fit. Use SSG: the page loads fast and search engines get the full HTML.</li>
          <li><strong>No:</strong> the page depends on who is asking, or the data changes every few seconds. Dashboards, carts and stock prices fit here. The last sections cover what to use instead.</li>
        </ul>
      </Reveal>

      <Reveal>
        <h2>Pages with no data</h2>

        <p>This is the default. If a page has no getServerSideProps or getInitialProps, Next.js renders its HTML during <strong>next build</strong> and serves that file as it is.</p>

        <CodeBlock language="tsx" title="pages/about.tsx">
{`export default function About() {
  return <h1>About this blog</h1>;
}`}
        </CodeBlock>

        <p>The server does no work per request, so the page can sit on a CDN (content delivery network): a set of servers around the world that keep copies of your files, so each visitor is served from one nearby.</p>
      </Reveal>

      <Reveal>
        <h2>Pages that need data: getStaticProps</h2>

        <p>Most pages need data from somewhere else, such as posts from a headless CMS (a content management system that only serves data, with no pages of its own). <strong>getStaticProps</strong> fetches that data at build time and passes it to your page as props. It always runs on the server, never in the browser, so it can use secrets and talk to a database directly.</p>

        <p>All samples in this post read the CMS through one small helper. It fails loudly when the CMS answers with an error, so a broken build tells you why instead of crashing on an HTML error page it tried to parse as JSON.</p>

        <CodeBlock language="ts" title="lib/cms.ts">
{`export interface Post {
  slug: string;
  title: string;
  body: string;
}

const CMS_URL = process.env.CMS_URL;

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(\`\${CMS_URL}/posts\`);
  if (!res.ok) throw new Error(\`CMS /posts answered \${res.status}\`);
  return res.json();
}

// A missing post is a normal answer, not an error.
export async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(\`\${CMS_URL}/posts/\${encodeURIComponent(slug)}\`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(\`CMS /posts/\${slug} answered \${res.status}\`);
  return res.json();
}`}
        </CodeBlock>

        <p>The blog index then lists every post:</p>

        <CodeBlock language="tsx" title="pages/blog/index.tsx">
{`import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getPosts, type Post } from '@/lib/cms';

export const getStaticProps: GetStaticProps<{ posts: Post[] }> = async () => {
  const posts = await getPosts();
  return { props: { posts } };
};

export default function Blog({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>{post.title}</li>
      ))}
    </ul>
  );
}`}
        </CodeBlock>

        <p>During the build, Next.js writes 2 files for this page: the HTML, and a JSON file with the props. The JSON is used when a visitor reaches the page from another page of your site through a Next.js <strong>&lt;Link&gt;</strong>, so the browser only downloads the data, not the whole page again. A CDN can cache both.</p>
      </Reveal>

      <Reveal>
        <h2>Pages whose URLs come from data: getStaticPaths</h2>

        <p>One post per page means a dynamic route: a file like <strong>pages/blog/[slug].tsx</strong>, where the slug (the readable last part of the URL, like new-post) decides which post to show. To build these pages ahead of time, Next.js has to know every slug during the build. The list lives in the CMS, so you cannot write it by hand.</p>

        <p><strong>getStaticPaths</strong> returns that list. Next.js then calls getStaticProps once per path to fetch each post.</p>

        <CodeBlock language="tsx" title="pages/blog/[slug].tsx">
{`import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getPost, getPosts, type Post } from '@/lib/cms';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  return {
    // Route params must be strings.
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    // Any slug not in this list gets a 404.
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ post: Post }, { slug: string }> = async ({ params }) => {
  const post = await getPost(params!.slug);
  // The post was deleted in the CMS: answer 404 instead of crashing.
  if (!post) return { notFound: true };
  return { props: { post } };
};

export default function BlogPost({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}`}
        </CodeBlock>

        <h3>Pages you did not build: fallback</h3>

        <p>You publish a new post after the build. Someone opens its URL. What happens depends on <strong>fallback</strong>, the second value getStaticPaths returns:</p>
        <ul>
          <li><strong>false:</strong> the visitor gets a 404 until you build again. Good for small sites that rebuild on every change.</li>
          <li><strong>true:</strong> the visitor gets a loading version of the page right away, and the full page once getStaticProps finishes. Good when you have too many pages to build them all.</li>
          <li><strong>&apos;blocking&apos;:</strong> the visitor waits while the server builds the page, then gets the full page. No loading state, but the first visit is as slow as SSR.</li>
        </ul>

        <p>With true or &apos;blocking&apos;, the page is saved after the first request, and every later visitor gets it from the cache. Replay each mode below.</p>
      </Reveal>

      <FallbackModesVisualizer />

      <Reveal>
        <p>With <strong>fallback: true</strong>, your component renders once with empty props. Check <strong>router.isFallback</strong> first, or the code will crash on the missing post:</p>

        <CodeBlock language="tsx" title="pages/blog/[slug].tsx" highlight="6-7">
{`import { useRouter } from 'next/router';
// Other imports, getStaticProps and getStaticPaths (now with fallback: true) as above.

export default function BlogPost({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  // The first visitor of an unbuilt page sees this until the props arrive.
  if (router.isFallback) return <p>Loading post...</p>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}`}
        </CodeBlock>

        <p>Search engine crawlers never get the loading version: for them, Next.js handles <strong>fallback: true</strong> like &apos;blocking&apos;, so they always read the full page.</p>
      </Reveal>

      <Reveal>
        <h2>Keeping pages fresh with ISR</h2>

        <p>The catch with SSG is that a page only changes when you build again. Fallback adds new pages, but it never updates a page that already exists. Fix a typo in the CMS, and the site keeps the typo.</p>

        <p>Incremental Static Regeneration (ISR) fixes that. Add <strong>revalidate</strong>, a number of seconds, to what getStaticProps returns:</p>

        <CodeBlock language="tsx" title="pages/blog/index.tsx" added="5">
{`export const getStaticProps: GetStaticProps<{ posts: Post[] }> = async () => {
  const posts = await getPosts();
  return {
    props: { posts },
    revalidate: 60,
  };
};`}
        </CodeBlock>

        <p>Here is what happens after the build:</p>
        <ol>
          <li>For 60 seconds, every visitor gets the cached page.</li>
          <li>After that, the next visitor <strong>still gets the cached page</strong>, now stale. Their request starts a rebuild in the background.</li>
          <li>When the rebuild succeeds, the new page replaces the old one, and the next visitors get it. If it fails, the old page stays.</li>
        </ol>

        <p>So revalidate is not &quot;update every 60 seconds&quot;. Nothing happens without a visitor, and the visitor who starts the rebuild gets the old version. Move the CMS edit and the revalidate time below, and compare ISR with SSG and SSR.</p>
      </Reveal>

      <RevalidationTimeline />

      <Reveal>
        <p>A shorter revalidate means fewer stale visitors and more server renders. A longer one means the opposite.</p>

        <h3>On-demand revalidation</h3>

        <p>A timer guesses when the content changed. Your CMS knows. Most headless CMSs can call a URL when content is published, a so-called webhook. Point it at an API route that rebuilds exactly the pages that changed:</p>

        <CodeBlock language="ts" title="pages/api/revalidate.ts">
{`import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only the CMS knows this secret, so nobody else can trigger rebuilds.
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  // The body shape depends on your CMS. Here it sends the slug of the changed post.
  const slug = req.body?.slug;
  if (typeof slug !== 'string') {
    return res.status(400).json({ message: 'Missing slug' });
  }

  // allSettled waits for both, so you can answer with one clear status even if one path fails.
  const results = await Promise.allSettled([
    res.revalidate('/blog'),
    res.revalidate(\`/blog/\${slug}\`),
  ]);
  if (results.some((result) => result.status === 'rejected')) {
    // The last good version of a failed page keeps being served.
    return res.status(500).json({ message: 'Revalidation failed' });
  }
  return res.json({ revalidated: true });
}`}
        </CodeBlock>

        <p>Pass the real path, such as <strong>/blog/new-post</strong>, not the file name <strong>/blog/[slug]</strong>. If you only revalidate on demand, you can leave revalidate out of getStaticProps: pages then change only when the CMS calls. Keeping a long revalidate as well is a safety net for a webhook that never arrives.</p>

        <p>On-demand revalidation only rebuilds paths that can exist. With <strong>fallback: false</strong>, as in the [slug] sample above, a new post&apos;s URL stays a 404 until the next build, and revalidating it fails. To publish new posts without a rebuild, set fallback to &apos;blocking&apos; or true.</p>

        <Callout variant="warning" title="ISR and fallback need a server">
          ISR, on-demand revalidation and fallback true or &apos;blocking&apos; all run code after the build, so they need a running Next.js server or a host that supports them. A pure static export (<strong>output: &apos;export&apos;</strong> in next.config) only supports plain SSG with fallback false.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>When SSG is the wrong choice</h2>

        <p>If the answer to &quot;can I build this before anyone asks?&quot; is no, you have 2 options.</p>

        <p><strong>Server-side rendering with getServerSideProps.</strong> The server fetches the data and builds the page on every request. The page is always current. By default nothing is cached, so each visit costs a render. If the page is the same for everyone, you can still let a CDN cache it for a short time with a header:</p>

        <CodeBlock language="tsx" title="pages/prices.tsx" highlight="5">
{`import type { GetServerSideProps } from 'next';
import { getPrices } from '@/lib/prices';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return { props: { prices: await getPrices() } };
};`}
        </CodeBlock>

        <p>Never do that for a page that is personal to one user, or one visitor&apos;s page will be served to the next.</p>

        <p><strong>A static page with client-side fetching.</strong> Build the shared part of the page with SSG, and let the browser fetch the personal or live part with JavaScript after it loads. The page appears fast from the CDN, and the visitor sees a short loading state where the live data goes. This fits a public page with a small personal corner, such as a product page with &quot;your cart&quot; in the header.</p>
      </Reveal>

      <Reveal>
        <h2>SSG, ISR, SSR and CSR side by side</h2>

        <BlogTable>
          <thead>
            <tr>
              <th>Approach</th>
              <th>HTML is built</th>
              <th>Data is as fresh as</th>
              <th>Good for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SSG</td>
              <td>Once, at build time</td>
              <td>The last build</td>
              <td>Docs, marketing pages, blogs that rebuild on publish</td>
            </tr>
            <tr>
              <td>ISR</td>
              <td>At build time, then again in the background</td>
              <td>The revalidate time, or the last CMS webhook</td>
              <td>CMS-backed blogs, product listings, news</td>
            </tr>
            <tr>
              <td>SSR</td>
              <td>On every request</td>
              <td>The request</td>
              <td>Per-user pages, search results, live data</td>
            </tr>
            <tr>
              <td>CSR (client-side rendering)</td>
              <td>The shell at build time, the data in the browser</td>
              <td>The browser&apos;s fetch</td>
              <td>Personal or live parts of an otherwise public page</td>
            </tr>
          </tbody>
        </BlogTable>
      </Reveal>

      <Reveal>
        <h2>The same ideas in the App Router</h2>

        <p>The App Router (the <strong>app</strong> folder) has no getStaticProps or getStaticPaths. Pages are async server components (components that run only on the server) that fetch their own data, and caching is set where you fetch. The concepts map like this:</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Pages Router</th>
              <th>App Router</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>getStaticProps</td>
              <td>An async page component that fetches its data. The page is prerendered at build time as long as it does not read request data such as cookies or headers.</td>
            </tr>
            <tr>
              <td>getStaticPaths</td>
              <td><strong>generateStaticParams</strong>, which returns an array like [{'{'} slug: &apos;a&apos; {'}'}]</td>
            </tr>
            <tr>
              <td>revalidate: 60</td>
              <td><strong>export const revalidate = 60</strong> in the page, or <strong>fetch(url, {'{'} next: {'{'} revalidate: 60 {'}'} {'}'})</strong></td>
            </tr>
            <tr>
              <td>fallback: false</td>
              <td><strong>export const dynamicParams = false</strong></td>
            </tr>
            <tr>
              <td>fallback: true or &apos;blocking&apos;</td>
              <td><strong>dynamicParams = true</strong>, the default. Unknown params are rendered on demand and cached.</td>
            </tr>
            <tr>
              <td>res.revalidate(&apos;/blog/x&apos;)</td>
              <td><strong>revalidatePath(&apos;/blog/x&apos;)</strong> in a route handler (the App Router version of an API route) or a server action (a server function you call from a form or button)</td>
            </tr>
          </tbody>
        </BlogTable>

        <Callout variant="note" title="Cache Components">
          Next.js 16 also has an opt-in mode, <strong>cacheComponents</strong> in next.config, where you mark cached code with the &apos;use cache&apos; directive instead. The table above describes the default setup.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>What to keep</h2>
        <ul>
          <li><strong>Build ahead whenever the page is the same for everyone.</strong> getStaticProps for the data, getStaticPaths for the list of URLs.</li>
          <li><strong>Add revalidate or on-demand revalidation when content changes.</strong> Remember that the first visitor after the timer still gets the old page.</li>
          <li><strong>Use SSR or client fetching only for per-user or live data,</strong> and keep the rest of the page static.</li>
        </ul>
      </Reveal>
    </div>
  );
}
