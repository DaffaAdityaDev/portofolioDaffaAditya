import { GraphQLClient, gql } from "graphql-request";
import BlogCard from "../../components/Blog/BlogCard";
import React from "react";
import Navbar from "../../components/Navbar";
import { getSortedPostsData } from '../../lib/posts'
import Link from 'next/link'
import { IBlogProps } from "../../components/types";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
const Blog = ({ allPostsData }: any) => {
  console.log(allPostsData);
  const allPostsData1 = []

  for (let i = 0; i < 4; i++) {
    allPostsData1.push(allPostsData[0])
  }
  console.log(allPostsData1);
  return (
    <div className="grid grid-cols-12 text-white">
      <div className="col-start-2 col-span-10">
        <Navbar />
      </div>
      <div className="relative flex flex-col justify-center items-center w-full col-start-2 col-span-10 my-8">
        <div className="absolute top-0 left-0 w-full h-full transform translate-y-1/2 -z-10">
          <div className="w-full h-[1px] border border-slate-700 mb-[2px]" />
          <div className="w-full h-[1px] border border-slate-700" />
        </div>
        <div className="bg-slate-900 p-2 text-center rounded-md">
          <p className="font-bold text-2xl">Featured Posts</p>
          <p className="font-thin">Stay Informed with our featured Posts</p>
        </div>
      </div>
      <div className="col-start-2 col-span-10">
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-6">
          {allPostsData1.map(({ id, image, date, title, timeToRead, description } : IBlogProps) => (
            <div key={id}>
              <BlogCard
                id={id}
                image={image}
                title={title}
                description={description}
                date={date}
                timeToRead={timeToRead}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
