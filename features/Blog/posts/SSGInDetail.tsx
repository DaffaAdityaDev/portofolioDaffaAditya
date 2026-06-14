import React from 'react';
import CodeBlock from '../components/CodeBlock';
import CustomImage from '../components/CustomImage';

export default function SSGInDetail() {
  return (
    <div className="blog-content-static">
      <p>In this blog, We will discuss the Static Site Generation in detail. We will learn how it's making website faster and more scalable. and how it's setting a new standard for web development. how may you ask "Static Site Generation" is making website faster and more scalable?. Most of the websites are built using the traditional server-side rendering (SSR) approach. In SSR, the server generates the HTML for each request. This mean the server has to process the request, fetch the data, and then generate the HTML for each request. This process is time-consuming and resource-intersive. This is where Static Site Generation comes into play.</p>

      <p>There is many way to generate a static site. we can use frameworks like Gatsby, Next.js, Nuxt.js, and many more. In this blog, we will use Next.js to generate a static site. we will discuss the different types of static site generation and how to implement them using Next.js. without further ado, let's get started.</p>

      <h2>Types of Static Site Generation</h2>

      <CustomImage 
        src="/image/blogs/SSGInDetail/SSGStrategy.webp" 
        alt="Image of video Sharing Service" 
      />

      <p>In Next.js, there are two types of static site generation that you can use to pre-render pages:</p>

      <p><strong>1. Static Generation without Data</strong></p>

      <p>By default, Next.js pre-renders every pages using static generation without data. This means that Next.js generates the HTML for each page at build time. This is the fastest way to generate a static site. The HTML is generated once at build time and then served to the client. means that the server does not have to process the request, fetch the data, and then generate the HTML for each request. This makes the website faster and more scalable also it can be cache in CDN (content delivery network). Here is an example of a page that uses static generation without data:</p>

      <CodeBlock className="language-javascript">
{`// pages/index.jsx
export default function Home() {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}`}
      </CodeBlock>

      <p>Note that the <strong>getStaticProps</strong> function is not used in this example. This is because the page does not need any data to be pre-rendered. The HTML is generated once at build time and then served to the client. JSX file that not fetch any data will be pre-rendered using static generation by default.</p>

      <p><strong>2. Static Generation with Data</strong></p>

      <p>In some cases, some pages require fetching external data for pre-rendering. There are two scenerios, and one or both might apply. In each case, you can use function that Next.js provides:</p>

      <ul>
        <li><strong>getStaticProps</strong>: This function is used to fetch the data at build time. The data is then used to pre-render the page. This is useful when you want take data from an external source and pre-render the page. Like fetching blog posts from a CMS (Content Management System) at build time.</li>
        <li><strong>getStaticPaths</strong>: This function is used to specify dynamic routes to pre-render based on the data. This is useful when you want to pre-render a page but don't want to specify all the routes at build time. we can use this function to specify the dynamic routes to pre-render based on the data.</li>
      </ul>

      <p><strong>Sceneraio 1</strong>: Your page content depends on external data</p>

      <p>In this case, you can use the <strong>getStaticProps</strong> function to fetch the data at build time. The data is then used to pre-render the page. Here is an example of a page that uses static generation with data blog posts from a CMS (Content Management System):</p>

      <CodeBlock className="language-javascript">
{`// pages/blog.jsx
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
  // it will receive \`posts\` as a prop at build time
  return {
    props: {
      posts,
    },
  };
}`}
      </CodeBlock>

      <p><strong>When should I used getStaticProps?</strong></p>
      <p>These are the commons considerations for using getStaticProps:</p>

      <ul>
        <li>The data required to render the page is available at build time ahead of a user's request.</li>
        <li>The data comes from a headless CMS.</li>
        <li>The page must be pre-rendered (for SEO) and be very fast to load. <strong>getStaticProps</strong> generates HTML and JSON files, both of which can be cached by a CDN for performance.</li>
        <li>The data can be publicly cached (not user-specific). This condition can be bypassed in certain specific cases by using a Middleware to rewrite the URL or path.</li>
      </ul>

      <p><strong>When does getStaticProps run?</strong></p>

      <p><strong>getStaticProps</strong> always runs on the server and never runs on the client.</p>

      <ul>
        <li><strong>getStaticProps</strong> always run during (Next Build).</li>
        <li><strong>getStaticProps</strong> runs in background when using <strong>fallback: true</strong>.</li>
        <li><strong>getStaticProps</strong> runs at request time when using <strong>fallback: blocking</strong>.</li>
        <li><strong>getStaticProps</strong> runs in background when using <strong>revalidate</strong>.</li>
      </ul>

      <p>when combine with <strong>Incremental Static Regeneration</strong>, <strong>getStaticProps</strong> can be used to update the static page after it has been generated. This is useful when the data changes over time. For example, you can use <strong>getStaticProps</strong> to fetch the latest blog posts from a CMS (Content Management System) and update the static page. consider the following example:</p>

      <CodeBlock className="language-javascript">
{`// pages/blog.jsx
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
}`}
      </CodeBlock>

      <p><strong>Sceneraio 2</strong>: Your page path depends on external data</p>

      <p>Next.js allows you to pre-render pages with dynamic routes. This is useful when you want to pre-render a page but don't want to specify all the routes at build time. You can use the <strong>getStaticPaths</strong> function to specify the dynamic routes to pre-render based on the data.</p>

      <p>For example, you can create file called <strong>[id].jsx</strong> in the <strong>pages/blog</strong> directory. This will be used show the blog post with the specified id. by accessing the URL <strong>/blog/1</strong>, <strong>/blog/2</strong>, and so on. However, which id you want to pre-render at build time might depend on the external data. In this case, you can use the <strong>getStaticPaths</strong> function to specify the dynamic routes to pre-render based on the data. Here is an example of a page that uses static generation with data and dynamic routes:</p>

      <CodeBlock className="language-javascript">
{`// pages/blog/[id].jsx
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
  // params contains the post \`id\`.
  // If the route is like /blog/1, then params.id is 1
  const res = await fetch(\`https://yourblog.com/posts/\${params.id}\`);
  const post = await res.json();

  // Pass post data to the page via props
  return { props: { post } };
}`}
      </CodeBlock>

      <h2>When should I use Static Generation?</h2>

      <p>Currently, this page was using Static generation using data from markdown. This is useful because now this bloggit can be indexed by search engines and can be cached by a CDN. i recommend using static Generation (with and without data) whenever possible because your page can be built once and served by CDN, make it much faster compare to server side rendering.</p>

      <p>You can use Static Generation for many types of pages, including:</p>

      <ul>
        <li>Marketing pages</li>
        <li>Blog posts and portfolio</li>
        <li>E-commerce product listings</li>
        <li>Help and documentation</li>
      </ul>

      <h2>Conclusion</h2>

      <CustomImage 
        src="/image/blogs/SSGInDetail/SSGEnd.webp" 
        alt="Image of video Sharing Service" 
      />

      <p>You should ask yourself: "Can i pre-render this page ahdead of a user's request?" if the answer is yes, then you should choose Static Generation</p>

      <p>On the other side, Static Generation is not a good idea if you cannot pre-render a page ahead of a user's request. For example, if you need to fetch data at request time, or if your page uses client-side data. or maybe you page shows frequently update data like stock price, or maybe you page is a user-specific page like dashboard. In these cases, you should choose Server Side Rendering.</p>

      <p>In cases like that, you can do one of the following:</p>

      <ul>
        <li>Use Server Side Rendering: You can pre-render a page ahead of a user's request. You can use Server Side Rendering to fetch data at request time. It will be slower because the page cannot be cached by a CDN. But it will always be up-to-date.</li>
        <li>Use Static Generation with Client-side data fetching: You can also pre-render a page ahead of a user's request. But you can also fetch data on the client side using JavaScript. it's call <strong>Hydration</strong>. the page will be faster because it can be cached by a CDN. But user may see a loading state while the data is being fetched.</li>
      </ul>
    </div>
  );
}
