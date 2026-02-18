import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Marquee from '@/components/atoms/Marquee';

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {children}
      </main>

      <Marquee text="ENGINEERING /// THOUGHTS /// TUTORIALS /// INSIGHTS /// BEST PRACTICES ///" />
      <Footer />
    </div>
  );
};

export default BlogLayout;
