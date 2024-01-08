import React from "react";

function HomeLayout({ children }: any) {
  return (
    <div className="container">
      <h1 className="text-sky-400">hio</h1>
      {children}
    </div>
  );
}

export default HomeLayout;
