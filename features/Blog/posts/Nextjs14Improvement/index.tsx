import React from 'react';
import BlogTable from '@/features/Blog/components/BlogTable';
import Callout from '@/features/Blog/components/Callout';
import CodeBlock from '@/features/Blog/components/CodeBlock';
import CustomImage from '@/features/Blog/components/CustomImage';
import Reveal from '@/features/Blog/components/Reveal';
import { lazyOnView } from '@/features/Blog/components/LazyOnView';

// Every widget sits below the first screen: its HTML is in the static page, its JS loads on scroll.
const ServerActionFlowVisualizer = lazyOnView(() => import('./widgets/serverActionFlow/components/ServerActionFlowVisualizer'));
const PprTimeline = lazyOnView(() => import('./widgets/pprTimeline/components/PprTimeline'));

export default function Nextjs14Improvement() {
  return (
    <div className="blog-content-static">
      <p>Next.js 14 came out in October 2023 with three ideas: <strong>Turbopack</strong>, a faster bundler; <strong>Server Actions</strong>, which let a form call a server function without an API route; and <strong>Partial Prerendering</strong>, which lets one page be part static and part dynamic. Two major versions later, all three are part of how Next.js 16 works by default, and some of their APIs changed on the way.</p>

      <p>I came to version 14 after a break, from Next.js 12, and the speed of the dev server was the first thing I noticed. This post follows each idea from 14 to 16. You will get:</p>
      <ul>
        <li><strong>What each feature does and why it exists</strong>, with code that runs on Next.js 16.</li>
        <li><strong>What changed since 14</strong>: the flags, hooks and functions you need to rename.</li>
        <li><strong>Two widgets to play with</strong>: a Server Action on the network, and the render modes on one store page.</li>
      </ul>

      <Reveal>
        <h2>From 14 to 16 at a glance</h2>

        <BlogTable>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Next.js 14</th>
              <th>Next.js 15</th>
              <th>Next.js 16</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Turbopack</td>
              <td>Opt-in for <code>next dev --turbo</code></td>
              <td>Stable for <code>next dev</code></td>
              <td>Default for <code>next dev</code> and <code>next build</code></td>
            </tr>
            <tr>
              <td>Server Actions</td>
              <td>Stable, with <code>useFormState</code> from react-dom</td>
              <td>React 19: <code>useActionState</code> from react</td>
              <td>Same API, plus new cache functions</td>
            </tr>
            <tr>
              <td>Request data</td>
              <td><code>cookies()</code> is sync</td>
              <td><code>await cookies()</code>, sync still works with a warning</td>
              <td>Only <code>await cookies()</code></td>
            </tr>
            <tr>
              <td>Partial Prerendering</td>
              <td>Preview, canary only, <code>experimental.ppr</code></td>
              <td>Still experimental, can be turned on per route</td>
              <td>Part of Cache Components: <code>cacheComponents: true</code></td>
            </tr>
          </tbody>
        </BlogTable>
      </Reveal>

      <Reveal>
        <h2>Turbopack: a faster bundler</h2>

        <p>A <strong>bundler</strong> takes your many source files and turns them into the few files a browser can load. Next.js used webpack for this. Every time you save a file, the bundler rebuilds what changed and <strong>Fast Refresh</strong> swaps the new code into the open page without losing its state.</p>

        <p>Turbopack is a bundler written in Rust. It remembers the result of every step it has done, so after a change it redoes only the work that the change touches. That matters when the server starts, on every save, and, since it also builds for production, on every deploy.</p>

        <h3>What I measured</h3>

        <p>This is one cold start on my machine, for a small app with about 20 components, on Next.js 14.1.0, when Turbopack was still opt-in. It is one run, not a benchmark.</p>

        <CustomImage
          src="/image/blogs/nextjs-14-to-16/startupComparision.webp"
          alt="Dev server start: 1.9 s with Turbopack vs 5 s with webpack"
          width={1360}
          height={1024}
        />

        <p>The Next.js team&apos;s own numbers for that version, measured on vercel.com, were up to <strong>53.3% faster</strong> local server start and up to <strong>94.7% faster</strong> code updates with Fast Refresh (<a href="https://nextjs.org/blog/next-14" target="_blank" rel="noopener noreferrer">Next.js 14 release post</a>). For Next.js 16 they report faster production builds and faster Fast Refresh again (<a href="https://nextjs.org/blog/next-16" target="_blank" rel="noopener noreferrer">Next.js 16 release post</a>).</p>

        <h3>Use it in 16</h3>

        <p>There is nothing to turn on: <code>next dev</code> and <code>next build</code> use Turbopack. The <code>--turbo</code> flag from 14 is no longer needed. If something works with webpack and not with Turbopack, keep a script that opts out, so you can compare:</p>

        <CodeBlock language="json" title="package.json" highlight="5">
{`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "dev:webpack": "next dev --webpack"
  }
}`}
        </CodeBlock>

        <Callout variant="warning" title="A custom webpack config does not carry over">
          Turbopack does not run the <code>webpack()</code> function in <code>next.config</code>. If your project has one, move that setup to Turbopack&apos;s own options, or build with <code>--webpack</code> until you do. In version 14, Turbopack also sometimes showed no error where webpack showed a clear one, and a webpack run is still the quickest second opinion. You can see the project I first used it on in the <a href="https://github.com/DaffaAdityaDev/streaming_video" target="_blank" rel="noopener noreferrer">streaming_video repository on GitHub</a>.
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
        <h3>Errors and pending state with useActionState</h3>

        <p>A real form has to show what went wrong. In Next.js 14 you did that with <code>useFormState</code> from <code>react-dom</code>. React 19 renamed it to <strong>useActionState</strong> and moved it to <code>react</code>, and it now also tells you whether the action is still running. The action moves to its own file, so a Client Component can import it, and it gets the previous state as its first argument:</p>

        <CodeBlock language="ts" title="app/actions.ts" highlight="8,13">
{`'use server'

import { revalidatePath } from 'next/cache'

export type CreateState = { error: string | null }

export async function create(
  prevState: CreateState,
  formData: FormData,
): Promise<CreateState> {
  const name = formData.get('name')
  if (typeof name !== 'string' || name.trim() === '') {
    return { error: 'Give the item a name.' }
  }
  // createItem stands for your own database call
  await createItem(name)
  revalidatePath('/')
  return { error: null }
}`}
        </CodeBlock>

        <CodeBlock language="tsx" title="app/create-form.tsx" highlight="3,7,10">
{`'use client'

import { useActionState } from 'react'
import { create } from './actions'

export function CreateForm() {
  const [state, formAction, isPending] = useActionState(create, { error: null })

  return (
    <form action={formAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Create item'}
      </button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  )
}`}
        </CodeBlock>

        <p>The form still works without JavaScript: the server runs the action and renders the page with the returned state.</p>

        <h3>What actions can do</h3>

        <p>You can also call an action as a plain async function, without a form. With TypeScript, its arguments and return value are typed on both sides. Inside the action you can:</p>

        <ul>
          <li>Throw away cached data with <a href="https://nextjs.org/docs/app/api-reference/functions/revalidatePath" target="_blank" rel="noopener noreferrer">revalidatePath()</a> or <a href="https://nextjs.org/docs/app/api-reference/functions/revalidateTag" target="_blank" rel="noopener noreferrer">revalidateTag()</a>. Next.js 16 adds more cache functions next to them, such as <code>updateTag()</code>, so the user sees their own change at once.</li>
          <li>Send the user to another page with <a href="https://nextjs.org/docs/app/api-reference/functions/redirect" target="_blank" rel="noopener noreferrer">redirect()</a>.</li>
          <li>Read and set cookies with <a href="https://nextjs.org/docs/app/api-reference/functions/cookies" target="_blank" rel="noopener noreferrer">cookies()</a>, which you now <code>await</code>.</li>
        </ul>

        <p>In the Client Component that uses the action, React hooks let you:</p>

        <ul>
          <li>Show errors returned by the server and a pending state with <a href="https://react.dev/reference/react/useActionState" target="_blank" rel="noopener noreferrer">useActionState()</a>.</li>
          <li>Show the result before the server confirms it with <a href="https://react.dev/reference/react/useOptimistic" target="_blank" rel="noopener noreferrer">useOptimistic()</a>.</li>
          <li>Read the pending state from a button deep inside the form with <a href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank" rel="noopener noreferrer">useFormStatus()</a>.</li>
        </ul>

        <Callout variant="warning" title="An action is a public endpoint">
          Every Server Action can be called with a POST request by anyone who has its id, and the id is in your page. Since Next.js 15 the ids are hard to guess and actions you never use are left out of the build, but that is not access control, and hiding the button does not protect it either. Check the session at the top of every action, check that this user may do this, and treat the form data as untrusted input. The Next.js team explains the model in <a href="https://nextjs.org/blog/security-nextjs-server-components-actions" target="_blank" rel="noopener noreferrer">How to Think About Security in Next.js</a>.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>Partial Prerendering, now Cache Components</h2>

        <p>Before Partial Prerendering (PPR), Next.js rendered each URL one way. A <strong>static</strong> page (static site generation, <strong>SSG</strong>) is built once at deploy time and served from a cache, so it is fast but the same for everyone. A <strong>dynamic</strong> page (server-side rendering, <strong>SSR</strong>) is rendered on every request, so it can be personal, but even the parts that never change are rendered again for each user. A store page with one personal part, the cart, had to be all dynamic.</p>

        <p>PPR splits the page using three ideas:</p>
        <ul>
          <li>A <strong>Suspense boundary</strong> is a <code>&lt;Suspense&gt;</code> wrapper in React. It shows a fallback, like a grey skeleton, until the part inside is ready.</li>
          <li>The <strong>static shell</strong> is everything outside those boundaries, plus the fallbacks. It is built ahead of time.</li>
          <li><strong>Streaming</strong> means the server sends the response in pieces. The shell goes first, and each dynamic part follows when its data is ready.</li>
        </ul>

        <p>Streaming itself was not new. A dynamic route with Suspense already streamed in Next.js 13, but the server still rendered the shell for each request before it could send it. What PPR changes is where the shell comes from: it is built ahead of time and served from the cache, like a static page. PPR was a preview in 14. In 16 it is how every route renders once you turn on <strong>Cache Components</strong>.</p>

        <h3>The store page</h3>

        <p>You do not learn a new API for the page. You put the dynamic parts inside Suspense:</p>

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

        <p>The cart reads a cookie to find the user&apos;s session. A cookie only exists on a real request, so Next.js cannot know it at build time. That one read is what makes the component dynamic. Since Next.js 15, <code>cookies()</code> returns a promise, and in 16 the old sync form is gone:</p>

        <CodeBlock language="tsx" title="app/cart.tsx" highlight="5">
{`import { cookies } from 'next/headers'
import { getCart } from './data'

export default async function ShoppingCart() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  const cart = await getCart(session)
  return <div>Cart: {cart.items.length} items</div>
}`}
        </CodeBlock>

        <p>The cart streams into its hole as part of the same HTTP response as the shell, with no extra request from the browser. If you already use a <code>loading.js</code> file, that is a Suspense boundary too. Switch between the four modes below and move the latencies to see what the user gets and when.</p>
      </Reveal>

      <PprTimeline />

      <Reveal>
        <h3>Cached data with &apos;use cache&apos;</h3>

        <p>The new products list fetches data too, but it is the same for everyone, so it belongs in the shell. With Cache Components, data that is not cached counts as dynamic, so you say what may be cached with the <strong>&apos;use cache&apos;</strong> directive, and for how long with <code>cacheLife</code>:</p>

        <CodeBlock language="tsx" title="app/new-products.tsx" highlight="5-6">
{`import { cacheLife } from 'next/cache'
import { getNewProducts } from './data'

export default async function NewProducts() {
  'use cache'
  cacheLife('hours')
  const products = await getNewProducts()
  return (
    <section className="new-products">
      {products.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </section>
  )
}`}
        </CodeBlock>

        <p>Every part of the page now has a clear answer: it is static, it is cached with &apos;use cache&apos;, or it reads request data and sits behind Suspense. If a component reads request data outside a Suspense boundary, Next.js reports an error instead of quietly making the whole page dynamic.</p>

        <h3>Turning it on</h3>

        <p>In 14, PPR needed the canary release and the <code>experimental.ppr</code> flag. In 16 the flag is gone, and one stable option turns on Cache Components, with PPR inside it:</p>

        <CodeBlock language="ts" title="next.config.ts" highlight="4">
{`import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig`}
        </CodeBlock>
      </Reveal>

      <Reveal>
        <h2>Smaller changes on the way to 16</h2>

        <ul>
          <li><code>params</code> and <code>searchParams</code> are promises since Next.js 15, like <code>cookies()</code> and <code>headers()</code>. Await them.</li>
          <li><code>fetch</code> requests and <code>GET</code> Route Handlers are no longer cached by default since Next.js 15. You choose what to cache.</li>
          <li>In Next.js 16, <code>middleware.ts</code> is renamed to <code>proxy.ts</code>, the minimum Node.js version is 20.9, and <code>next lint</code> is removed, so you run ESLint yourself.</li>
          <li>Support for the React Compiler is stable in Next.js 16 with <code>reactCompiler: true</code>, so you write less <code>useMemo</code> and <code>useCallback</code> by hand.</li>
          <li>From 14 and still true: <code>next export</code> is replaced by <code>output: &apos;export&apos;</code>, <code>viewport</code> and <code>themeColor</code> go in the <code>viewport</code> export, and <code>next/image</code> uses <code>remotePatterns</code> instead of <code>domains</code>.</li>
        </ul>

        <p>Most of these renames have a codemod. The <a href="https://nextjs.org/docs/app/guides/upgrading/version-16" target="_blank" rel="noopener noreferrer">Next.js 16 upgrade guide</a> lists them.</p>
      </Reveal>

      <Reveal>
        <h2>What to keep</h2>

        <ul>
          <li><strong>Turbopack</strong> is the default bundler for dev and build. Keep <code>--webpack</code> as an escape hatch, not a habit.</li>
          <li><strong>Server Actions</strong> replace one-off API routes and keep forms working before JavaScript loads. Use <code>useActionState</code> for errors and pending state, and check the session inside every action, because each one is a public endpoint.</li>
          <li><strong>Partial Prerendering</strong> lives on in Cache Components: a static shell served at once, &apos;use cache&apos; for shared data, and Suspense around anything personal, such as <code>await cookies()</code>.</li>
        </ul>
      </Reveal>
    </div>
  );
}
