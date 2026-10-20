import React from 'react';

/**
 * Post table. A wide one scrolls inside this wrapper instead of widening the page. The wrapper
 * draws the rounded outer border; `border-hidden` drops the cells' outer edges under it.
 */
const BlogTable: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-6 overflow-x-auto rounded-lg border border-border">
    <table className="border-hidden">{children}</table>
  </div>
);

export default BlogTable;
