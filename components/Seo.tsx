import React from 'react';
import Head from 'next/head';
import { siteConfig, TITLE_SUFFIX } from '@/config/metadata.config';

interface SeoImage {
  /** Path or absolute URL. */
  src: string;
  /** Pixel size, emitted as og:image:width/height only when given. */
  width?: number;
  height?: number;
  alt?: string;
}

interface SeoProps {
  /** Path on this site, starting with '/'. Becomes the canonical and og:url. */
  path: string;
  /** Page title without the site name: rendered as `${title} | ${siteConfig.name}`. */
  title: string;
  /** Use `title` as the whole <title>, without the site-name suffix (the home page). */
  fullTitle?: boolean;
  description: string;
  /** Path or absolute URL of a 1200x630 image, or an object with its size and alt. Defaults to the site image. */
  image?: string | SeoImage;
  type?: 'website' | 'article';
  /** ISO date, for articles. */
  publishedTime?: string;
  /** Extra JSON-LD, already shaped as a schema.org object (or a list of them). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
  /** Skip canonical and og:url, for pages served at any URL (the 404). */
  noCanonical?: boolean;
  /** <meta name="author">. */
  author?: string;
}

const DEFAULT_IMAGE: SeoImage = {
  src: siteConfig.ogImage,
  width: siteConfig.ogImageWidth,
  height: siteConfig.ogImageHeight,
  alt: siteConfig.ogImageAlt,
};

const absolute = (pathOrUrl: string): string =>
  /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${siteConfig.url}${pathOrUrl}`;

/** The default image's known size and alt also apply when a page passes its path as a plain string. */
const resolveImage = (image: string | SeoImage | undefined): SeoImage => {
  if (!image || image === siteConfig.ogImage) return DEFAULT_IMAGE;
  return typeof image === 'string' ? { src: image } : image;
};

/** Title, description, canonical, Open Graph and Twitter tags for one page, with absolute URLs. */
const Seo: React.FC<SeoProps> = ({
  path,
  title: pageTitle,
  fullTitle,
  description,
  image,
  type = 'website',
  publishedTime,
  jsonLd,
  noindex,
  noCanonical,
  author,
}) => {
  const title = fullTitle ? pageTitle : `${pageTitle}${TITLE_SUFFIX}`;
  const url = absolute(path);
  const { src, width, height, alt = title } = resolveImage(image);
  const imageUrl = absolute(src);
  const { twitterHandle } = siteConfig;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {author && <meta name="author" content={author} />}
      {!noCanonical && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex" />}

      <meta property="og:type" content={type} />
      {!noCanonical && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      {width && height && (
        <>
          <meta property="og:image:width" content={String(width)} />
          <meta property="og:image:height" content={String(height)} />
        </>
      )}
      <meta property="og:image:alt" content={alt} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={alt} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}

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
