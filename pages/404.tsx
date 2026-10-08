import type { NextPage } from 'next';
import Head from 'next/head';
import Custom404Content from '@/features/Custom404';

const Custom404: NextPage = () => {
  return (
    <>
      <Custom404Content />
      {/* Title and description come from Custom404Content. No Seo here: the 404 renders at whatever
          URL was requested, so a canonical/og:url to /404 would contradict noindex. */}
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
    </>
  );
};

export default Custom404;
