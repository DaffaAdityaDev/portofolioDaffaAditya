import Head from 'next/head';
import dynamic from 'next/dynamic';

/**
 * Local CV editor at /cv in dev; see pageExtensions in next.config.js. Production builds still compile this file as
 * /cv.dev, so it 404s there and the editor import is dropped. Rendered without the site shell (BARE_PAGE_ROUTES).
 */
export const getStaticProps = () => (process.env.NODE_ENV === 'production' ? { notFound: true as const } : { props: {} });

const CvEditor =
  process.env.NODE_ENV === 'production' ? () => null : dynamic(() => import('@/features/CvEditor/components/CvEditor'), { ssr: false });

export default function CvEditorPage() {
  return (
    <>
      <Head>
        <title>CV editor</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <CvEditor />
    </>
  );
}
