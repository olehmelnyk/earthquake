import React from 'react';
import Image from 'next/image';

export type NextImageProps = {
  readonly src: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
  readonly className?: string;
};

export const NextImage: React.FC<NextImageProps> = ({
  src,
  alt,
  width = 200,
  height = 200,
  className,
}) => {
  // Check if we're in Storybook environment
  const isStorybook = typeof window !== 'undefined' && window.location.href.includes('viewMode=story');

  // In Storybook, use a regular img tag instead of Next.js Image
  if (isStorybook) {
    return (
      <div className="relative" style={{ width, height }}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`max-w-full ${className ?? ''}`}
          style={{ objectFit: 'cover' }}
        />
      </div>
    );
  }

  // In real app, use Next.js Image
  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        unoptimized={true}
      />
    </div>
  );
};

export default NextImage;