import React from 'react';

/** Post table. A wide one scrolls inside this wrapper instead of widening the page. */
const BlogTable: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-6 overflow-x-auto">
    <table>{children}</table>
  </div>
);

export default BlogTable;
