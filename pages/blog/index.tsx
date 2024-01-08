import { GraphQLClient, gql } from "graphql-request";
import BlogCard from "../../components/BlogCard/BlogCard";
import React from "react";
import Navbar from "../../components/Navbar";
import QUEARYALLBLOG from "../../Middleware/get-blog-api";

const graphcms = new GraphQLClient(
  "https://api-ap-northeast-1.graphcms.com/v2/cl4il4eos41je01z69eikf0ly/master",
);

export async function getStaticProps() {
  const { posts } = await graphcms.request(QUEARYALLBLOG);
  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}

const Blog = ({ posts }: any) => {
  return (
    <div className="">
      <Navbar />
      {posts.map((post: any) => (
        <div className="" key={post.title}>
          <BlogCard
            title={post.title}
            author={post.author}
            key={post.id}
            datePublished={post.datePublished}
            slug={post.slug}
          />
        </div>
      ))}
    </div>
  );
};

export default Blog;
