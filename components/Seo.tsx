import React from 'react';
import Head from 'next/head';
import { siteConfig } from '@/config/metadata.config';

interface SeoProps {
  /** Path on this site, starting with '/'. Becomes the canonical and og:url. */
  path: string;
  title: string;
  description: string;
  /** Path or absolute URL of a 1200x630 image. Defaults to the site image. */
  image?: string;
  type?: 'website' | 'article';
  /** ISO date, for articles. */
  publishedTime?: string;
  /** Extra JSON-LD, already shaped as a schema.org object. */
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}

const absolute = (pathOrUrl: string): string =>
  /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${siteConfig.url}${pathOrUrl}`;

/** Title, description, canonical, Open Graph and Twitter tags for one page, with absolute URLs. */
const Seo: React.FC<SeoProps> = ({
  path,
  title,
  description,
  image = siteConfig.ogImage,
  type = 'website',
  publishedTime,
  jsonLd,
  noindex,
}) => {
  const url = absolute(path);
  const imageUrl = absolute(image);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && (
        <script
          type="application/ld+json"
          // JSON.stringify escapes quotes; '<' is escaped so the script cannot be closed early.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
    </Head>
  );
};

export default Seo;
