import React from 'react';
import Seo from '@/components/Seo';
import { ArrowRight } from 'lucide-react';
import { lazyOnView } from '@/components/LazyOnView';
import Footer from '@/components/Layout/LazyFooter';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import PageTitle from '@/components/ui/PageTitle';
import { MARQUEE_TEXT } from '@/constant/constant';

// Below the fold: static HTML, JS loaded as the block nears the viewport.
const Marquee = lazyOnView(() => import('@/components/ui/Marquee'));

export const Custom404Content = () => {
  return (
    <>
      {/* The 404 renders at whatever URL was requested, so no canonical/og:url pointing at /404. */}
      <Seo
        path="/404"
        title="Page Not Found"
        description="The page you are looking for does not exist."
        noindex
        noCanonical
      />

      <div className="min-h-screen bg-background text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative flex flex-col">
        <main className="flex-1 relative flex flex-col items-center justify-center min-h-[80vh] px-4">
          {/* No JS entrance: the message paints with the server HTML instead of waiting for hydration. */}
          <div className="flex flex-col items-center text-center">
            <div>
              <Eyebrow tone="accent">[ 404 {'//'} Not found ]</Eyebrow>
            </div>

            <div className="mt-4">
              <PageTitle size="lg">Page not found</PageTitle>
            </div>

            <p className="mt-6 max-w-md text-sm md:text-base leading-relaxed text-muted-foreground">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="mt-10">
              <Button href="/" className="group">
                Return home
                <ArrowRight size={16} aria-hidden className="transition-transform motion-safe:group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </main>

        {/* Footer Marquee */}
        <Marquee text={MARQUEE_TEXT} border={true} type="light" />
        <Footer />
      </div>
    </>
  );
};

export default Custom404Content;
