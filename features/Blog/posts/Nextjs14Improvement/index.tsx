import React from 'react';
import Callout from '../../components/Callout';
import CodeBlock from '../../components/CodeBlock';
import CustomImage from '../../components/CustomImage';
import Reveal from '../../components/Reveal';
import { lazyOnView } from '../../components/LazyOnView';

// Every widget sits below the first screen: its HTML is in the static page, its JS loads on scroll.
const ServerActionFlowVisualizer = lazyOnView(() => import('./widgets/serverActionFlow/components/ServerActionFlowVisualizer'));
const PprTimeline = lazyOnView(() => import('./widgets/pprTimeline/components/PprTimeline'));

export default function Nextjs14Improvement() {
  return (
    <div className="blog-content-static">
      <p>Next.js 14 came out in October 2023 with three things worth knowing: <strong>Turbopack</strong>, a faster bundler for the dev server; <strong>Server Actions</strong>, which let a form call a server function without an API route; and <strong>Partial Prerendering</strong>, which lets one page be part static and part dynamic. For each one you get what it does, why it exists, and code that works.</p>

      <p>I came to version 14 after a break. The last version I had used was Next.js 12, so the speed of the dev server was the first thing I noticed, and that is where this post starts.</p>

      <Callout variant="note" title="Updated October 2026">
        The code in this post is written for Next.js 14. The current version is Next.js 16, and four things have changed since:
        <ul className="!mt-3 !mb-0 !text-neutral-300">
          <li><strong>Turbopack</strong> became stable for <code>next dev</code> in Next.js 15, and in Next.js 16 it is the default for both <code>next dev</code> and <code>next build</code>. Pass <code>--webpack</code> to opt out.</li>
          <li><strong>Partial Prerendering</strong> lost its <code>experimental.ppr</code> flag in Next.js 16. It lives on inside Cache Components: set <code>cacheComponents: true</code> and the static shell plus Suspense holes work as below. The new <code>&apos;use cache&apos;</code> directive is how you choose what else to cache.</li>
          <li><strong>useFormState</strong> is now <code>useActionState</code>, imported from <code>react</code>, since React 19.</li>
          <li><strong>cookies() and headers()</strong> became async in Next.js 15, and Next.js 16 removed the old sync form, so you write <code>await cookies()</code>.</li>
        </ul>
      </Callout>

      <Reveal>
        <h2>Turbopack: a faster bundler</h2>

        <p>A <strong>bundler</strong> takes your many source files and turns them into the few files a browser can load. Next.js used webpack for this. Every time you save a file, the bundler rebuilds what changed and <strong>Fast Refresh</strong> swaps the new code into the open page without losing its state.</p>

        <p>Turbopack is a new bundler written in Rust. It remembers the result of every step it has done, so after a change it redoes only the work that the change touches. In development this matters twice: when the server starts, and on every save.</p>

        <h3>What I measured</h3>

        <p>This is one cold start on my machine, for a small app with about 20 components, on Next.js 14.1.0. It is one run, not a benchmark.</p>

        <CustomImage
          src="/image/blogs/nextjs14Improvement/startupComparision.webp"
          alt="Dev server start: 1.9 s with Turbopack vs 5 s with webpack"
          width={1360}
          height={1024}
        />

        <p>The official numbers come from the Next.js team, measured on vercel.com, a large Next.js app: up to <strong>53.3% faster</strong> local server start and up to <strong>94.7% faster</strong> code updates with Fast Refresh. At the time, 5,000 integration tests for <code>next dev</code> passed with Turbopack, about 90% of the suite. The source is the <a href="https://nextjs.org/blog/next-14" target="_blank" rel="noopener noreferrer">Next.js 14 release post</a>.</p>

        <h3>Try it</h3>

        <p>In Next.js 14, Turbopack is opt-in with the <code>--turbo</code> flag. I kept both scripts, so I could switch:</p>

        <CodeBlock language="json" title="package.json" highlight="4">
{`{
  "scripts": {
    "dev": "next dev",
    "dev:turbo": "next dev --turbo"
  }
}`}
        </CodeBlock>

        <Callout variant="warning" title="It missed some errors">
          In version 14, Turbopack sometimes showed no error where webpack showed a clear one. When something broke and I could not see why, I stopped the server and ran <code>npm run dev</code> to get webpack&apos;s message. You can see the project I used it on in the <a href="https://github.com/DaffaAdityaDev/streaming_video" target="_blank" rel="noopener noreferrer">streaming_video repository on GitHub</a>.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>Server Actions: forms without an API route</h2>

        <p>Before Server Actions, a form that saves data needed two files. First, an API route that runs on the server:</p>

        <CodeBlock language="ts" title="pages/api/submit.ts">
{`import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // The page sends JSON, so Next.js has already parsed it
  const data = req.body
  // createItem stands for your own database call
  const id = await createItem(data)
  res.status(200).json({ id })
}`}
        </CodeBlock>

        <p>Then a page whose submit handler stops the browser and calls that route with <code>fetch</code>:</p>

        <CodeBlock language="tsx" title="pages/index.tsx">
{`import { FormEvent } from 'react'

export default function Page() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    })

    const data = await response.json()
    // ...update the page yourself
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Create item</button>
    </form>
  )
}`}
        </CodeBlock>

        <h3>The same form with &apos;use server&apos;</h3>

        <p>In the App Router, the same form fits in one file:</p>

        <CodeBlock language="tsx" title="app/page.tsx" highlight="5,8,12">
{`import { revalidatePath } from 'next/cache'

export default function Page() {
  async function create(formData: FormData) {
    'use server'
    // createItem stands for your own database call
    await createItem(formData)
    revalidatePath('/')
  }

  return (
    <form action={create}>
      <input type="text" name="name" />
      <button type="submit">Create item</button>
    </form>
  )
}`}
        </CodeBlock>

        <p>The <code>&apos;use server&apos;</code> line marks <code>create</code> as a <strong>Server Action</strong>: the function runs only on the server, and its code never reaches the browser. Next.js gives the browser a reference to it instead, an id it can send to ask the server to run it. You pass the function to the form&apos;s <code>action</code> prop, not to <code>onSubmit</code>. The <code>revalidatePath(&apos;/&apos;)</code> call tells Next.js that this page now shows old data, so the response to the form carries the new page.</p>

        <p>Because it is a real form with a real action, it also works before the page&apos;s JavaScript has loaded. This is called <strong>progressive enhancement</strong>: the plain HTML works on its own, and JavaScript makes it faster once it arrives. Pick a scenario below and step through what happens on the network.</p>
      </Reveal>

      <ServerActionFlowVisualizer />

      <Reveal>
        <h3>What actions can do</h3>

        <p>You can also call an action as a plain async function, without a form. With TypeScript, its arguments and return value are typed on both sides. Inside the action, the Next.js 14 API lets you:</p>

        <ul>
          <li>Throw away cached data with <a href="https://nextjs.org/docs/app/api-reference/functions/revalidatePath" target="_blank" rel="noopener noreferrer">revalidatePath()</a> or <a href="https://nextjs.org/docs/app/api-reference/functions/revalidateTag" target="_blank" rel="noopener noreferrer">revalidateTag()</a>.</li>
          <li>Send the user to another page with <a href="https://nextjs.org/docs/app/api-reference/functions/redirect" target="_blank" rel="noopener noreferrer">redirect()</a>.</li>
          <li>Read and set cookies with <a href="https://nextjs.org/docs/app/api-reference/functions/cookies" target="_blank" rel="noopener noreferrer">cookies()</a>.</li>
        </ul>

        <p>In the Client Component that uses the action, React hooks let you:</p>

        <ul>
          <li>Show the result before the server confirms it with <a href="https://react.dev/reference/react/useOptimistic" target="_blank" rel="noopener noreferrer">useOptimistic()</a>.</li>
          <li>Show errors returned by the server with <a href="https://react.dev/reference/react-dom/hooks/useFormState" target="_blank" rel="noopener noreferrer">useFormState()</a> (now useActionState).</li>
          <li>Show a pending state while the form submits with <a href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank" rel="noopener noreferrer">useFormStatus()</a>.</li>
        </ul>

        <p>The full guide for this version is <a href="https://nextjs.org/docs/14/app/building-your-application/data-fetching/server-actions-and-mutations" target="_blank" rel="noopener noreferrer">Server Actions and Mutations</a> in the Next.js 14 docs.</p>

        <Callout variant="warning" title="An action is a public endpoint">
          Every Server Action can be called with a POST request by anyone who knows its id, and the id is in your page. Hiding the button does not protect it. Check the session at the top of every action, check that this user may do this, and treat the form data as untrusted input. The Next.js team explains the model in <a href="https://nextjs.org/blog/security-nextjs-server-components-actions" target="_blank" rel="noopener noreferrer">How to Think About Security in Next.js</a>.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>Partial Prerendering (preview in 14)</h2>

        <p>Before Partial Prerendering (PPR), Next.js rendered each URL one way. A <strong>static</strong> page (static site generation, <strong>SSG</strong>) is built once at deploy time and served from a cache, so it is fast but the same for everyone. A <strong>dynamic</strong> page (server-side rendering, <strong>SSR</strong>) is rendered on every request, so it can be personal, but even the parts that never change are rendered again for each user. A store page with one personal part, the cart, had to be all dynamic.</p>

        <p>PPR splits the page using three ideas:</p>
        <ul>
          <li>A <strong>Suspense boundary</strong> is a <code>&lt;Suspense&gt;</code> wrapper in React. It shows a fallback, like a grey skeleton, until the part inside is ready.</li>
          <li>The <strong>static shell</strong> is everything outside those boundaries, plus the fallbacks. It is built ahead of time.</li>
          <li><strong>Streaming</strong> means the server sends the response in pieces. The shell goes first, and each dynamic part follows when its data is ready.</li>
        </ul>

        <p>Streaming itself was not new. A dynamic route with Suspense already streamed in Next.js 13, but the server still rendered the shell for each request before it could send it. What PPR changes is where the shell comes from: it is built ahead of time and served from the cache, like a static page.</p>

        <h3>The store page</h3>

        <p>You do not learn a new API. You put the dynamic parts inside Suspense:</p>

        <CodeBlock language="tsx" title="app/page.tsx" highlight="13-15,18-20">
{`import { Suspense } from 'react'
import Banner from './banner'
import ShoppingCart from './cart'
import Recommendations from './recommendations'
import NewProducts from './new-products'
import { CartSkeleton, ProductListSkeleton } from './skeletons'

export default function Page() {
  return (
    <main>
      <header>
        <h1>My Store</h1>
        <Suspense fallback={<CartSkeleton />}>
          <ShoppingCart />
        </Suspense>
      </header>
      <Banner />
      <Suspense fallback={<ProductListSkeleton />}>
        <Recommendations />
      </Suspense>
      <NewProducts />
    </main>
  )
}`}
        </CodeBlock>

        <p>When a request comes in, the static shell goes out at once. Each fallback marks a hole that the server fills later in the same response:</p>

        <CodeBlock language="html" title="The static shell">
{`<main>
  <header>
    <h1>My Store</h1>
    <div class="cart-skeleton">
      <!-- Hole -->
    </div>
  </header>
  <div class="banner" />
  <div class="product-list-skeleton">
    <!-- Hole -->
  </div>
  <section class="new-products" />
</main>`}
        </CodeBlock>

        <h3>The dynamic cart</h3>

        <p>The cart reads a cookie to find the user&apos;s session. A cookie only exists on a real request, so Next.js cannot know it at build time. That one read is what makes the component dynamic:</p>

        <CodeBlock language="tsx" title="app/cart.tsx" highlight="6">
{`import { cookies } from 'next/headers'
import { getCart } from './data'

export default async function ShoppingCart() {
  // From Next.js 15: (await cookies()).get('session')
  const session = cookies().get('session')?.value
  const cart = await getCart(session)
  return <div>Cart: {cart.items.length} items</div>
}`}
        </CodeBlock>

        <p>The cart streams into its hole as part of the same HTTP response as the shell, with no extra request from the browser. If you already use a <code>loading.js</code> file, that is a Suspense boundary too, so those routes need no changes. Switch between the four modes below and move the latencies to see what the user gets and when.</p>
      </Reveal>

      <PprTimeline />

      <Reveal>
        <h3>Turning it on in 14</h3>

        <p>PPR was a preview in Next.js 14 and not meant for production. You needed the canary release (the prerelease build, installed with <code>npm install next@canary</code>) and an experimental flag:</p>

        <CodeBlock language="js" title="next.config.js" highlight="3">
{`module.exports = {
  experimental: {
    ppr: true,
  },
}`}
        </CodeBlock>
      </Reveal>

      <Reveal>
        <h2>Smaller changes</h2>

        <ul>
          <li>The minimum Node.js version is 18.17.</li>
          <li>The <code>next export</code> command is removed. Set <code>output: &apos;export&apos;</code> in <code>next.config.js</code> instead.</li>
          <li><code>ImageResponse</code>, for generated social images, moved from <code>next/server</code> to <code>next/og</code>.</li>
          <li>The <code>viewport</code>, <code>colorScheme</code> and <code>themeColor</code> metadata options are deprecated. Use the new <code>viewport</code> export or <code>generateViewport</code>.</li>
          <li>In <code>next/image</code>, <code>onLoadingComplete</code> is deprecated in favour of <code>onLoad</code>, and the <code>domains</code> option in favour of <code>remotePatterns</code>.</li>
        </ul>
      </Reveal>

      <Reveal>
        <h2>What to keep</h2>

        <ul>
          <li><strong>Turbopack</strong> makes the dev server start and refresh faster.</li>
          <li><strong>Server Actions</strong> replace one-off API routes and keep forms working before JavaScript loads. Each one is a public endpoint, so check the session inside it.</li>
          <li><strong>Partial Prerendering</strong> lets you serve a static shell at once and stream the personal parts behind Suspense.</li>
        </ul>

        <p>The note at the top lists what changed after Next.js 14.</p>
      </Reveal>
    </div>
  );
}
