import { GraphQLClient } from "graphql-request";
import React from 'react';
import { QUERYSLUGBLOG, SLUGLIST } from "../../Middleware/get-blog-api";

const graphcms = new GraphQLClient("https://api-ap-northeast-1.graphcms.com/v2/cl4il4eos41je01z69eikf0ly/master");

export async function getStaticPaths() {
    const { posts } = await graphcms.request(SLUGLIST);
    return {
        paths: posts.map((post: any) => ({ params: { slug: post.slug } })),
        fallback: false,
    }
}

export async function getStaticProps({params}: any) {
    const slug = params.slug;
    const data = await graphcms.request(QUERYSLUGBLOG, {slug});
    const post = data.post;
    return {
        props: {
            post
        },
        revalidate: 10,
    }
}

const BlogPost = ({post}: any) => {
  return (
    <main>
        {!post.coverPhoto.url ? <div>noting</div> : (
            <div>
                <img src={post.coverPhoto.url} alt="" />
                <div dangerouslySetInnerHTML={{ __html: post.content.html }} />
            </div>
        )}
        
    </main>
  )
}

export default BlogPost