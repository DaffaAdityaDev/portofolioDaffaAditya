import React from 'react';

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default HomeLayout;
