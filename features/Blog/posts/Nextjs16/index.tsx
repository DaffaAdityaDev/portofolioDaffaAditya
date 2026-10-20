import React from 'react';
import BlogTable from '@/features/Blog/components/BlogTable';
import Callout from '@/features/Blog/components/Callout';
import CodeBlock from '@/features/Blog/components/CodeBlock';
import CustomImage from '@/features/Blog/components/CustomImage';
import Reveal from '@/features/Blog/components/Reveal';
import { lazyOnView } from '@/features/Blog/components/LazyOnView';

// Every widget sits below the first screen: its HTML is in the static page, its JS loads on scroll.
const ServerActionFlowVisualizer = lazyOnView(() => import('@/features/Blog/widgets/serverActionFlow/components/ServerActionFlowVisualizer'));
const PprTimeline = lazyOnView(() => import('@/features/Blog/widgets/pprTimeline/components/PprTimeline'));

export default function Nextjs16() {
  return (
    <div className="blog-content-static">
      <p>Next.js 16 rests on three ideas. <strong>Turbopack</strong> is the bundler behind <code>next dev</code> and <code>next build</code>. <strong>Server Actions</strong> let a form call a server function without an API route. <strong>Cache Components</strong> let one page be part static and part dynamic, so the parts that never change are served from the cache while the personal parts stream in.</p>

      <p>This post walks through each one with code that runs on Next.js 16 and the App Router. You will get:</p>
      <ul>
        <li><strong>What each feature does and why it exists</strong>, explained from the ground up.</li>
        <li><strong>The code you write day to day</strong>: an actions file, a form with <code>useActionState</code>, and a page with a static shell and dynamic holes.</li>
        <li><strong>Two widgets to play with</strong>: a Server Action on the network, and four ways to render one store page.</li>
      </ul>

      <Reveal>
        <h2>Turbopack: the default bundler</h2>

        <p>A <strong>bundler</strong> takes your many source files and turns them into the few files a browser can load. Every time you save a file, the bundler rebuilds what changed and <strong>Fast Refresh</strong> swaps the new code into the open page without losing its state.</p>

        <p>Turbopack is a bundler written in Rust. It remembers the result of every step it has done, so after a change it redoes only the work that the change touches. In Next.js 16 it runs both the dev server and the production build, so the same bundler handles your first <code>next dev</code>, every save, and every deploy. The Next.js team reports faster production builds and faster Fast Refresh with it in the <a href="https://nextjs.org/blog/next-16" target="_blank" rel="noopener noreferrer">Next.js 16 release post</a>.</p>

        <h3>What it means day to day</h3>

        <ul>
          <li>There is nothing to turn on. <code>next dev</code> and <code>next build</code> use Turbopack with no flag.</li>
          <li>Most CSS, Tailwind, TypeScript and image setups work as they are, because Next.js configures them for Turbopack itself.</li>
          <li>If a build error looks odd, a webpack run is a quick second opinion. Keep a script for it:</li>
        </ul>

        <CodeBlock language="json" title="package.json" highlight="5">
{`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "dev:webpack": "next dev --webpack"
  }
}`}
        </CodeBlock>

        <Callout variant="warning" title="Opt out only for a custom webpack config">
          Turbopack does not run the <code>webpack()</code> function in <code>next.config</code>. If your project has one, either move that setup to Turbopack&apos;s own <code>turbopack</code> options, such as loader rules and aliases, or run <code>next dev --webpack</code> and <code>next build --webpack</code> until you can. Without a custom webpack config, there is no reason to opt out.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>Server Actions: forms without an API route</h2>

        <p>The classic way to save a form takes two files. First, an API route that runs on the server:</p>

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

        <p>The <code>&apos;use server&apos;</code> line marks <code>create</code> as a <strong>Server Action</strong>: the function runs only on the server, and its code never reaches the browser. Next.js gives the browser a reference to it instead, an id it can send to ask the server to run it. You pass the function to the form&apos;s <code>action</code> prop, not to <code>onSubmit</code>. The <code>revalidatePath(&apos;/&apos;)</code> call tells Next.js that this page shows old data, so the response to the form carries the new page.</p>

        <p>Because it is a real form with a real action, it also works before the page&apos;s JavaScript has loaded. This is called <strong>progressive enhancement</strong>: the plain HTML works on its own, and JavaScript makes it faster once it arrives. Pick a scenario below and step through what happens on the network.</p>
      </Reveal>

      <ServerActionFlowVisualizer />

      <Reveal>
        <h3>An actions file and useActionState</h3>

        <p>A real form has to show what went wrong and whether it is still saving. Put the actions in their own file with <code>&apos;use server&apos;</code> at the top, so every export is an action and a Client Component can import them. An action used with <strong>useActionState</strong> gets the previous state as its first argument and returns the next one:</p>

        <CodeBlock language="ts" title="app/actions.ts" highlight="1,8,13">
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

        <p>The hook comes from <code>react</code> and returns three things: the latest state, an action to pass to the form, and <code>isPending</code>, which is true while the action runs:</p>

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
          <li>Throw away cached data with <a href="https://nextjs.org/docs/app/api-reference/functions/revalidatePath" target="_blank" rel="noopener noreferrer">revalidatePath()</a> or <a href="https://nextjs.org/docs/app/api-reference/functions/revalidateTag" target="_blank" rel="noopener noreferrer">revalidateTag()</a>, or with <code>updateTag()</code> when the user should see their own change on the very next render.</li>
          <li>Send the user to another page with <a href="https://nextjs.org/docs/app/api-reference/functions/redirect" target="_blank" rel="noopener noreferrer">redirect()</a>.</li>
          <li>Read and set cookies with <a href="https://nextjs.org/docs/app/api-reference/functions/cookies" target="_blank" rel="noopener noreferrer">cookies()</a>, which returns a promise you <code>await</code>.</li>
        </ul>

        <p>In the Client Component that uses the action, React hooks let you:</p>

        <ul>
          <li>Show errors returned by the server and a pending state with <a href="https://react.dev/reference/react/useActionState" target="_blank" rel="noopener noreferrer">useActionState()</a>.</li>
          <li>Show the result before the server confirms it with <a href="https://react.dev/reference/react/useOptimistic" target="_blank" rel="noopener noreferrer">useOptimistic()</a>.</li>
          <li>Read the pending state from a button deep inside the form with <a href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank" rel="noopener noreferrer">useFormStatus()</a>.</li>
        </ul>

        <h3>Security: an action is a public endpoint</h3>

        <p>Next.js does some of the work for you:</p>

        <ul>
          <li>Actions are only called with <code>POST</code>, and Next.js checks that the request&apos;s origin matches your host, which blocks most cross-site form posts.</li>
          <li>Action ids are hard to guess, and actions that nothing in your app uses are left out of the build.</li>
          <li>Values an inline action closes over are encrypted before they are sent to the browser and back.</li>
        </ul>

        <Callout variant="warning" title="None of that is access control">
          Anyone who has an action&apos;s id can call it with their own data, and the id is in your page. Hiding the button does not protect it. Check the session at the top of every action, check that this user may do this, and treat the form data as untrusted input. The Next.js team explains the model in <a href="https://nextjs.org/blog/security-nextjs-server-components-actions" target="_blank" rel="noopener noreferrer">How to Think About Security in Next.js</a>.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>Cache Components: a static shell with dynamic holes</h2>

        <p>There are two classic ways to render a URL. A <strong>static</strong> page (static site generation, <strong>SSG</strong>) is built once at deploy time and served from a cache, so it is fast but the same for everyone. A <strong>dynamic</strong> page (server-side rendering, <strong>SSR</strong>) is rendered on every request, so it can be personal, but even the parts that never change are rendered again for each user. A store page with one personal part, the cart, would have to be all dynamic.</p>

        <p>Cache Components split the page instead, using three ideas:</p>
        <ul>
          <li>A <strong>Suspense boundary</strong> is a <code>&lt;Suspense&gt;</code> wrapper in React. It shows a fallback, like a grey skeleton, until the part inside is ready.</li>
          <li>The <strong>static shell</strong> is everything outside those boundaries, plus the fallbacks. It is built ahead of time and served from the cache.</li>
          <li><strong>Streaming</strong> means the server sends the response in pieces. The shell goes first, and each dynamic part follows when its data is ready.</li>
        </ul>

        <p>This way of rendering is called <strong>Partial Prerendering</strong> (PPR), and with Cache Components on, every route in the App Router renders like this.</p>

        <CustomImage
          src="/image/blogs/nextjs-16-turbopack-server-actions-cache-components/cache-components.webp"
          alt="A store page whose header, banner and product list come from a cached static shell, while the cart and recommendations stream into Suspense holes"
          caption="The static shell is served at once; dynamic holes stream in"
          width={1600}
          height={900}
        />

        <h3>Turning it on</h3>

        <p>One option in the config turns on Cache Components:</p>

        <CodeBlock language="ts" title="next.config.ts" highlight="4">
{`import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig`}
        </CodeBlock>

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

        <p>The cart reads a cookie to find the user&apos;s session. A cookie only exists on a real request, so Next.js cannot know it at build time. That one read is what makes the component dynamic. <code>cookies()</code>, <code>headers()</code> and the other request APIs return promises, so you <code>await</code> them:</p>

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

        <p>The cart streams into its hole as part of the same HTTP response as the shell, with no extra request from the browser. A <code>loading.js</code> file is a Suspense boundary too. Switch between the four modes below and move the latencies to see what the user gets and when.</p>
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

        <p>&apos;use cache&apos; works on a component, a plain async function, or a whole file. You can also tag a cached entry with <code>cacheTag</code>, so an action can throw it away with <code>revalidateTag</code> or <code>updateTag</code> when the data changes.</p>

        <p>Every part of the page has a clear answer:</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Part</th>
              <th>What it does</th>
              <th>Where it renders</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Header, banner</td>
              <td>No data, or data known at build time</td>
              <td>Static shell</td>
            </tr>
            <tr>
              <td>New products</td>
              <td>Shared data, marked <code>&apos;use cache&apos;</code></td>
              <td>Static shell, refreshed per <code>cacheLife</code></td>
            </tr>
            <tr>
              <td>Cart, recommendations</td>
              <td>Reads <code>await cookies()</code> or uncached data</td>
              <td>A Suspense hole, streamed on each request</td>
            </tr>
          </tbody>
        </BlogTable>

        <p>If a component reads request data or uncached data outside a Suspense boundary, Next.js reports an error instead of quietly making the whole page dynamic. The fix is always one of the three rows above: cache it, or wrap it in Suspense.</p>
      </Reveal>

      <Reveal>
        <h2>Smaller things worth knowing in 16</h2>

        <ul>
          <li><code>params</code> and <code>searchParams</code> are promises, like <code>cookies()</code> and <code>headers()</code>. Await them in pages, layouts and <code>generateMetadata</code>.</li>
          <li><code>fetch</code> requests and <code>GET</code> Route Handlers are not cached by default. You choose what to cache, with &apos;use cache&apos; or the fetch options.</li>
          <li>Request interception lives in <code>proxy.ts</code>, with an exported <code>proxy</code> function, at the root of the project.</li>
          <li>The minimum Node.js version is 20.9, and there is no <code>next lint</code> command, so you run ESLint directly.</li>
          <li>Support for the React Compiler is stable. Turn it on with <code>reactCompiler: true</code> and you write less <code>useMemo</code> and <code>useCallback</code> by hand.</li>
        </ul>
      </Reveal>

      <Reveal>
        <h2>What to keep</h2>

        <ul>
          <li><strong>Turbopack</strong> is the default bundler for dev and build. Reach for <code>--webpack</code> only if you have a custom webpack config.</li>
          <li><strong>Server Actions</strong> replace one-off API routes and keep forms working before JavaScript loads. Put them in an actions file, use <code>useActionState</code> for errors and <code>isPending</code>, and check the session inside every action, because each one is a public endpoint.</li>
          <li><strong>Cache Components</strong> give each page a static shell served at once, &apos;use cache&apos; with <code>cacheLife</code> for shared data, and Suspense around anything personal, such as <code>await cookies()</code>.</li>
        </ul>
      </Reveal>
    </div>
  );
}
