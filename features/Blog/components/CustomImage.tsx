import React from 'react';
import Image from 'next/image';

interface CustomImageProps {
  src: string;
  alt: string;
  /**
   * Intrinsic pixel size of the file. The box reserves this aspect ratio before the
   * image loads, so pass the real size or it shifts (the default is 16:9).
   */
  width?: number;
  height?: number;
  /** Text under the image. Defaults to the alt text. */
  caption?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, width = 1200, height = 675, caption = alt }) => {
  return (
    <div className="my-8 rounded-lg border border-border bg-background p-2">
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        sizes="(min-width: 768px) 68ch, 100vw"
        className="w-full h-auto object-cover rounded"
        loading="lazy"
      />
      {caption && <div className="mt-2 text-center text-xs font-mono text-neutral-500 uppercase">{caption}</div>}
    </div>
  );
};

export default CustomImage;
