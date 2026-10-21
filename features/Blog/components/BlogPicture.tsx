import React from 'react';
import Head from 'next/head';

/**
 * Every blog banner and hero is one 1280x720 WebP with AVIF copies at 1280 and 640px next to it:
 * banner.webp, banner.avif, banner-640.avif (`bun run blog:avif` writes the AVIFs). The WebP is only the
 * fallback for browsers without AVIF, so it has no smaller copy. Other images get no variants.
 */
const WIDTH = 1280;
const HEIGHT = 720;
const BLOG_WEBP = /^\/image\/blogs\/.+\.webp$/;

const avifSrcSetOf = (src: string) => {
  const base = src.replace(/\.webp$/, '');
  return `${base}-640.avif 640w, ${base}.avif ${WIDTH}w`;
};

interface BlogPictureProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes' | 'width' | 'height'> {
  src: string;
  alt: string;
  sizes: string;
  /** Above the fold: preload the AVIF from the head at high priority (React doesn't preload an <img> inside <picture>). */
  preload?: boolean;
}

/** A blog banner or hero: AVIF at 640 and 1280px, with the 1280px WebP as fallback. */
const BlogPicture: React.FC<BlogPictureProps> = ({ src, alt, sizes, preload = false, ...imgProps }) => {
  const avifSrcSet = BLOG_WEBP.test(src) ? avifSrcSetOf(src) : undefined;

  return (
    <>
      {preload && avifSrcSet && (
        // Browsers without AVIF skip a preload whose type they can't decode and load the WebP from the <img>.
        <Head>
          <link rel="preload" as="image" type="image/avif" imageSrcSet={avifSrcSet} imageSizes={sizes} fetchPriority="high" />
        </Head>
      )}
      <picture className="contents">
        {avifSrcSet && <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />}
        <img
          src={src}
          alt={alt}
          width={WIDTH}
          height={HEIGHT}
          fetchPriority={preload ? 'high' : undefined}
          {...imgProps}
        />
      </picture>
    </>
  );
};

export default BlogPicture;
