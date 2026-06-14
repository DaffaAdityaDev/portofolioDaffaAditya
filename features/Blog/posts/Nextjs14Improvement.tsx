import React from 'react';
import CodeBlock from '../components/CodeBlock';
import CustomImage from '../components/CustomImage';

export default function Nextjs14Improvement() {
  return (
    <div className="blog-content-static">
      <p>For couple of month i was working with outsite of Next.js, now i'm back to Next.js and i'm really excited to see the new features and improvements in Next.js 14. last time i was working with Next.js 12 and i was really impressed with the performance and the developer experience.</p>

      <p>it was really fun to work with Next.js project. not only that is also powerful and flexible to build SSR (Server Side Rendering) and SSG (Static Site Generation) website. in nextjs 14, there have been a lot of improvements and new features. Like Turbopack, Server Action and more. In this blog, we will discuss following new features and improvements in Next.js 14.</p>

      <ul>
        <li>Turbopack</li>
        <li>Server Action</li>
        <li>Improved Image Component</li>
      </ul>

      <p>so let's get started.</p>

      <h2>Turbopack</h2>

      <p>since the introduction of Turbopack(alpha) i was test it and i was fast but also lack of many features and debugging tools so i back to tipical webpack bundler. but for last couple of weeks i was using Turbopack more often and i was good impression this far the debuging tools are better and the performance is so good it make DX (Developer Experience) better. check my project that i build using Turbopack <a href="https://github.com/DaffaAdityaDev/streaming_video" target="_blank" rel="noopener noreferrer">here</a>, sometimes Turbopack can miss some key error that make debugging harder often i have to switch back to webpack bundler to debug the error. but i'm sure that the Turbopack team will fix this issue soon. but for performance Turbopack is really good. is beat the webpack bundler in term of performance.</p>

      <CustomImage 
        src="/image/blogs/nextjs14Improvement/startupComparision.webp" 
        alt="Image of comparision" 
      />

      <p>as you can see in the image above, the startup time of the project that build using Turbopack is faster than the project that build using webpack bundler. okay you say is not a big deal it's just a few second. but i remind you my project is not a big project, it's just have couple of pages and only have Twenty components. but it will be a big deal if you have a big project if you normal will take 50 second to start the project, with Turbopack it will take 20 second to start the project. that's a big deal. and it will make the developer experience better, in official blog nextjs said that Turbopack with 5,000 tests passsing for APP & Page Router it 53% faster local server start time. but again i remind you that Turbopack is relative new may is still lack of costumization and debugging tools. to use Turbopack you can add to your project</p>

      <CodeBlock className="language-json">
{`{
  "scripts": {
    "dev": "next dev",
    "dev:turbo": "next dev --turbo"
  }
}`}
      </CodeBlock>

      <p>also code updates are 2x faster with Turbopack. it will reduce time to wait for the code to be updated in the browser. expecially when you have heavy component that take time to be updated in the browser. it will make the developer experience better for sure.</p>

      <h2>Server Action</h2>

      <p>Now server Action is stable, In App Router is build on the React canary channel. React Canaries is Incremental Feature Rollout Outside Meta, As of next 14 it's has upgrated to the lastest React canary, which includes stable Server Actions. These example Form before Server Action using API Routes and await fetch.</p>

      <p>first you have to create a API Route to handle the form submission.</p>

      <CodeBlock className="language-javascript">
{`// pages/api/submit.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  const data = req.body
  const id = await createItem(data)
  res.status(200).json({ id })
}`}
      </CodeBlock>

      <p>Then, in client-side code, you can use the fetch API to send the data to the server:</p>

      <CodeBlock className="language-javascript">
{`// pages/index.tsx
import { FormEvent } from 'react'

export default function Page() {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    alert(\`Item created with id: \${data.id}\`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" />
      <button type="submit">Create Item</button>
    </form>
  )
}`}
      </CodeBlock>

      <p>Now with Server Action, you can use 'use server' to handle the form submission inside the function, The previous example can be simplified to one file:</p>

      <CodeBlock className="language-javascript">
{`// app/page.tsx
export default function Page() {
  async function handleSubmitAction(formData: FormData) {
    'use server'
    const id = await createItem(formData)
  }

  return (
    <form onSubmit={handleSubmitAction}>
      <input name="name" type="text" />
      <button type="submit">Create Item</button>
    </form>
  )
}`}
      </CodeBlock>

      <p>Server Action gona feel familiar for any developer who have previously used server-centric frameworks in the past. It's build on web fundamentals like forms and the <a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener noreferrer">FormData API</a>. It's also a great way to handle form submission in Next.js.</p>

      <p>You can also call them directly as a function. without a form. When using Typescript, this gives you full end-to-end type safety. between the client and server. Mutating data, re-rendering the page, or redirecting can happen in one network roundtrip, ensuring the correct data is displayed on the client, even if upstream provider is slow. Server Action is deeply integrated into the entire App Router. mean you can:</p>

      <ul>
        <li>Revalidate cached data with <a href="https://nextjs.org/docs/app/api-reference/functions/revalidatePath" target="_blank" rel="noopener noreferrer">revalidatePath()</a> or <a href="https://nextjs.org/docs/app/api-reference/functions/revalidateTag" target="_blank" rel="noopener noreferrer">revalidateTag()</a></li>
        <li>Redirect to different routes through <a href="https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function" target="_blank" rel="noopener noreferrer">redirect()</a></li>
        <li>Set and read cookies through cookies()</li>
        <li>Handle optimistic UI updated with <a href="https://react.dev/reference/react/useOptimistic" target="_blank" rel="noopener noreferrer">useOptimistic</a></li>
        <li>Catch and display error from the server with useFormState</li>
        <li>Display loading states on the client with useFormStatus</li>
      </ul>

      <p>I recommend you read official documentation about Form and Mutations with server Actions with Security model and best practices for Server Components and Server Actions.</p>

      <h2>Partial Prerendering</h2>

      <CustomImage 
        src="/image/blogs/nextjs14Improvement/partialPrerendering.webp" 
        alt="Image of comparision" 
      />

      <p>You may know rendering strategy like Server-side rendering (SSR), static-site generation (SSG), and incremental static revalidation (ISR). in Partial Prerendering, you can use the best of both worlds. where is defined by your Suspense boundaries. Here's how it works les't make example following ecommerce page:</p>

      <CodeBlock className="language-javascript">
{`// pages/page.tsx
import { Suspense } from 'react'
import { Cart } from '@components/cart'
import { CartSkeleton } from '@components/cart-skeleton'
import { ProductList } from '@components/product-list'
import { ProductListSkeleton } from '@components/product-list-skeleton'

export default function Page() {
  return (
    <Main>
      <Header>
        <h1>My Ecommerce Site</h1>
        <Suspense fallback={<CartSkeleton />}>
          <Cart />
        </Suspense>
      </Header>
      <Banner />
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
      <Footer />
    </Main>
  )
}`}
      </CodeBlock>

      <p>With Partial Prerendering enabled, this page generates a static shell based on your <strong>&lt;Suspense/&gt;</strong> boundaries. The fallback from React Suspense is prerendered.</p>

      <p>Suspense fallbacks in the shell are then replaced with dynamic components, like reading cookies to determine the cart, or showing a banner base on the user. Since <strong>&lt;Cart/&gt;</strong> read from cookies to look at the user session, this component is then streamed in as part of the same HTTP request as the static shell. There are no extra network roundtrips needed.</p>

      <CodeBlock className="language-javascript">
{`// components/cart.tsx
import { cookies } from 'next/cookies'

export function Cart() {
  const getCookies = cookies.get('session')
  const cart = getCookies.cart
  return <div>Cart: {cart}</div>
}`}
      </CodeBlock>

      <h2>conclusion</h2>

      <p>As we delve into the world of Next.js 14, it's clear that this release is not just a minor update it's a leap forward in web development. With features like Turbopack, Server Actions, and Partial Prerendering, Next.js 14 is pushing the boundaries of what's possible in web development.</p>

      <p>Turbopack, with its impressive performance gains, is a game-changer for developers looking to optimize their build times. Its integration into the Next.js ecosystem promises a smoother and more efficient development experience, making it a must-have for any Next.js project.</p>

      <p>Server Actions, now stable and deeply integrated into the App Router, offer a seamless way to handle form submissions and data mutations. This feature simplifies the development process, making it easier to manage server-side logic directly from the client side.</p>

      <p>Partial Prerendering, on the other hand, is a revolutionary approach to rendering, allowing developers to leverage the best of both SSR and SSG. This feature provides the flexibility to prerender parts of a page while dynamically loading others, offering a balance between performance and user experience.</p>

      <p>As we look to the future, it's evident that Next.js is continuously evolving, adapting to the needs of developers and the web. With each new release, the framework becomes more powerful, more intuitive, and more capable of meeting the demands of modern web applications.</p>

      <p>Whether you're a seasoned developer or just starting your journey with Next.js, this release is a testament to the framework's commitment to innovation and excellence. It's an exciting time to be part of the Next.js community, and we can't wait to see what the future holds.</p>

      <p>as reminder this feature is still cutting edge and may need improvement especially Partial Prerendering which is still in <strong>Preview</strong>. but it's really promising and i'm really excited to see the future of Next.js.</p>

      <p>Happy hacking!</p>
    </div>
  );
}
