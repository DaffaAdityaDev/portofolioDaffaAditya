import { GraphQLClient, gql } from "graphql-request";
import BlogCard from "../../components/Blog/BlogCard";
import React from "react";
import Navbar from "../../components/Navbar";
import { getSortedPostsData } from '../../lib/posts'
import Link from 'next/link'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
const Blog = ({ allPostsData }: IBlogProps) => {
  console.log(allPostsData);
  return (
    <div className="grid grid-cols-12 text-white">
      <div className="col-start-2 col-span-10">
        <Navbar />
      </div>
      <div className="col-start-2 cols-span-4">
        <p>THE MOST</p>
        <p>Recent Articles</p>
      </div>
      <div className="col-start-2 col-span-10">
        <div className="grid grid-cols-2 gap-4">
          {allPostsData.map(({ id, date, title }) => (
            // <li key={id}>
            //   {title}
              
            //   <br />
            //   {id}
            //   <br />
            //   {date}
            //   <button>
            //     <Link href={`blog/post/${id}`}>Read more</Link>
            //   </button>
            // </li>
            <div key={id}>
              <BlogCard
                
                id={id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
