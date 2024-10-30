---
title: "Static Site Generation: A Revolution in Web Performance"
date: "2024-02-28"
timeToRead: 20
description: "Get a deep dive static site generation, Learn how it's making website faster and more scalable. and how it's
setting a new standard for web development."
image: "/image/blogs/SSGInDetail/SSGThumnail.webp"
production: true
---

In this blog, We will discuss the Static Site Generation in detail. We will learn how it's making website faster and more scalable. and how it's setting a new standard for web development. how may you ask "Static Site Generation" is making website faster and more scalable?. Most of the websites are built using the traditional server-side rendering (SSR) approach. In SSR, the server generates the HTML for each request.
This mean the server has to process the request, fetch the data, and then generate the HTML for each request. This process is time-consuming and resource-intersive. This is where Static Site Generation comes into play.

There is many way to generate a static site. we can use frameworks like Gatsby, Next.js, Nuxt.js, and many more. In this blog, we will use Next.js to generate a static site. we will discuss the different types of static site generation and how to implement them using Next.js. without further ado, let's get started.

## Types of Static Site Generation

![Image of video Sharing Service](/image/blogs/SSGInDetail/SSGStrategy.webp)

In Next.js, there are two types of static site generation that you can use to pre-render pages:

**1. Static Generation without Data**

By default, Next.js pre-renders every pages using static generation without data. This means that Next.js generates the HTML for each page at build time. This is the fastest way to generate a static site. The HTML is generated once at build time and then served to the client. means that the server does not have to process the request, fetch the data, and then generate the HTML for each request. This makes the website faster and more scalable also it can be cache in CDN (content delivery network). Here is an example of a page that uses static generation without data:

```javascript
{/* filePath: pages/index.jsx */}
export default function Home() {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}
```

Note that the **getStaticProps** function is not used in this example. This is because the page does not need any data to be pre-rendered. The HTML is generated once at build time and then served to the client. JSX file that not fetch any data will be pre-rendered using static generation by default.

**2. Static Generation with Data**

In some cases, some pages require fetching external data for pre-rendering. There are two scenerios, and one or both might apply. In each case, you can use function that Next.js provides:

- **getStaticProps**: This function is used to fetch the data at build time. The data is then used to pre-render the page. This is useful when you want take data from an external source and pre-render the page. Like fetching blog posts from a CMS (Content Management System) at build time.
- **getStaticPaths**: This function is used to specify dynamic routes to pre-render based on the data. This is useful when you want to pre-render a page but don't want to specify all the routes at build time. we can use this function to specify the dynamic routes to pre-render based on the data.

**Sceneraio 1**: Your page content depends on external data

In this case, you can use the **getStaticProps** function to fetch the data at build time. The data is then used to pre-render the page. Here is an example of a page that uses static generation with data blog posts from a CMS (Content Management System):

```javascript
{/* filePath: pages/blog.jsx */}
// pages/blog.jsx
// posts will be populated at build time by getStaticProps()
export default function Blogs({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  // call an external API endpoint to get posts
  const res = await fetch("https://yourblog.com/posts");
  const posts = await res.json();

  // By returning { props: { posts } }, the Blog component
  // it will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  };
}
```

**When should I used getStaticProps?**
These are the commons considerations for using getStaticProps:

- The data required to render the page is available at build time ahead of a user's request.
- The data comes from a headless CMS.
- The page must be pre-rendered (for SEO) and be very fast to load. **getStaticProps** generates HTML and JSON files, both of which can be cached by a CDN for performance.
- The data can be publicly cached (not user-specific). This condition can be bypassed in certain specific cases by using a Middleware to rewrite the URL or path.

**When does getStaticProps run?**

**getStaticProps** always runs on the server and never runs on the client.

- **getStaticProps** always run during (Next Build).
- **getStaticProps** runs in background when using **fallback: true**.
- **getStaticProps** runs at request time when using **fallback: blocking**.
- **getStaticProps** runs in background when using **revalidate**.

when combine with **Incremental Static Regeneration**, **getStaticProps** can be used to update the static page after it has been generated. This is useful when the data changes over time. For example, you can use **getStaticProps** to fetch the latest blog posts from a CMS (Content Management System) and update the static page. consider the following example:

```javascript
{/* filePath: pages/blog.jsx */}
export async function getStaticProps() {
  const res = await fetch("https://yourblog.com/posts");
  const posts = await res.json();

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}
```

**Sceneraio 2**: Your page path depends on external data

Next.js allows you to pre-render pages with dynamic routes. This is useful when you want to pre-render a page but don't want to specify all the routes at build time. You can use the **getStaticPaths** function to specify the dynamic routes to pre-render based on the data.

For example, you can create file called **[id].jsx** in the **pages/blog** directory. This will be used show the blog post with the specified id. by accessing the URL **/blog/1**, **/blog/2**, and so on. However, which id you want to pre-render at build time might depend on the external data. In this case, you can use the **getStaticPaths** function to specify the dynamic routes to pre-render based on the data. Here is an example of a page that uses static generation with data and dynamic routes:

```javascript
{/* filePath: pages/blog/[id].jsx */}

// pages/blog/[id].jsx
export default function Blog({ post }) {
  // Render post...
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch("https://yourblog.com/posts");
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /blog/1, then params.id is 1
  const res = await fetch(`https://yourblog.com/posts/${params.id}`);
  const post = await res.json();

  // Pass post data to the page via props
  return { props: { post } };
}
```

## When should I use Static Generation?

Currently, this page was using Static generation using data from markdown. This is useful because now this bloggit can be indexed by search engines and can be cached by a CDN. i recommend using static Generation (with and without data) whenever possible because your page can be built once and served by CDN, make it much faster compare to server side rendering.

You can use Static Generation for many types of pages, including:

- Marketing pages
- Blog posts and portfolio
- E-commerce product listings
- Help and documentation

## Conclusion

![Image of video Sharing Service](/image/blogs/SSGInDetail/SSGEnd.webp)

You should ask yourself: "Can i pre-render this page ahdead of a user's request?" if the answer is yes, then you should choose Static Generation

On the other side, Static Generation is not a good idea if you cannot pre-render a page ahead of a user's request. For example, if you need to fetch data at request time, or if your page uses client-side data. or maybe you page shows frequently update data like stock price, or maybe you page is a user-specific page like dashboard. In these cases, you should choose Server Side Rendering.

In cases like that, you can do one of the following:

- Use Server Side Rendering: You can pre-render a page ahead of a user's request. You can use Server Side Rendering to fetch data at request time. It will be slower because the page cannot be cached by a CDN. But it will always be up-to-date.
- Use Static Generation with Client-side data fetching: You can also pre-render a page ahead of a user's request. But you can also fetch data on the client side using JavaScript. it's call **Hydration**. the page will be faster because it can be cached by a CDN. But user may see a loading state while the data is being fetched.
