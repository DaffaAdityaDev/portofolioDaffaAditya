import React from 'react';
import Head from 'next/head';

/**
 * Every blog banner and hero is 1280x720 with a 640px copy next to it, in WebP and AVIF:
 * banner.webp, banner-640.webp, banner.avif, banner-640.avif (`bun run blog:avif` writes the AVIF copies).
 * Other images get no variants.
 */
const WIDTH = 1280;
const HEIGHT = 720;
const BLOG_WEBP = /^\/image\/blogs\/.+\.webp$/;

const srcSet = (src: string, ext: string) => {
  const base = src.replace(/\.webp$/, '');
  return `${base}-640.${ext} 640w, ${base}.${ext} ${WIDTH}w`;
};

interface BlogPictureProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes' | 'width' | 'height'> {
  src: string;
  alt: string;
  sizes: string;
  /** Above the fold: preload the AVIF from the head at high priority (React doesn't preload an <img> inside <picture>). */
  preload?: boolean;
}

/** A blog banner or hero: AVIF with the WebP as fallback, both at 640 and 1280px. */
const BlogPicture: React.FC<BlogPictureProps> = ({ src, alt, sizes, preload = false, ...imgProps }) => {
  const variants = BLOG_WEBP.test(src);
  const avifSrcSet = variants ? srcSet(src, 'avif') : undefined;

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
          srcSet={variants ? srcSet(src, 'webp') : undefined}
          sizes={variants ? sizes : undefined}
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
