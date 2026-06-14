import React from 'react';
import Image from 'next/image';

interface CustomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, width = 1200, height = 675 }) => {
  return (
    <div className="my-8 border border-neutral-800 bg-[#0a0a0a] p-2">
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        className="w-full h-auto object-cover rounded"
        loading="lazy"
      />
      {alt && <div className="mt-2 text-center text-xs font-mono text-neutral-600 uppercase">{alt}</div>}
    </div>
  );
};

export default CustomImage;
