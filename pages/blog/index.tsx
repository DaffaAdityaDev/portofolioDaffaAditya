import BlogCard from "../../components/Blog/BlogCard";
import React from "react";
import Navbar from "../../components/Navbar";
import { getSortedPostsData } from "../../lib/posts";
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
  // console.log(allPostsData);
  const allPostsData1 = [];

  for (let i = 0; i < 4; i++) {
    allPostsData1.push(allPostsData[0]);
  }
  // console.log(allPostsData1);
  return (
    <div className="grid grid-cols-12 text-white">
      <div className="col-span-10 col-start-2">
        <Navbar />
      </div>
      <div className="relative col-span-10 col-start-2 my-8 flex w-full flex-col items-center justify-center">
        <div className="absolute left-0 top-0 -z-10 h-full w-full translate-y-1/2 transform">
          <div className="mb-[2px] h-[1px] w-full border border-slate-700" />
          <div className="h-[1px] w-full border border-slate-700" />
        </div>
        <div className="rounded-md bg-slate-900 p-2 text-center">
          <p className="text-2xl font-bold">Featured Posts</p>
          <p className="font-thin">Stay Informed with our featured Posts</p>
        </div>
      </div>
      <div className="col-span-10 col-start-2">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-1">
          {allPostsData.map(
            ({
              id,
              image,
              date,
              title,
              timeToRead,
              description,
            }: IBlogProps) => (
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
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
