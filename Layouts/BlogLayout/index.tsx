import React, { PropsWithChildren } from "react";

const BlogLayout = (props: PropsWithChildren) => {
  return (
    <div className="">
      <h1 className="text-3xl font-bold">Blog</h1>
      {props.children}
    </div>
  );
};

export default BlogLayout;
