import type { CSSProperties, ImgHTMLAttributes, ReactNode } from 'react';

export interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | { src: string };
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  loader?: (props: ImageLoaderProps) => string;
  sizes?: string;
}

// next/image picks `src` from its largest device width. Photo loaders clamp that.
const NEXT_IMAGE_MAX_WIDTH = 3840;

export default function Image({
  src,
  alt,
  fill,
  priority,
  className,
  style,
  loader,
  quality,
  sizes: _sizes,
  ...props
}: ImageProps) {
  const imageSrc = typeof src === 'string' ? src : src.src;
  const width = typeof props.width === 'number' ? props.width : Number(props.width);
  const url =
    loader && Number.isFinite(width)
      ? loader({
          src: imageSrc,
          width: Math.max(width, NEXT_IMAGE_MAX_WIDTH),
          quality: typeof quality === 'number' ? quality : undefined,
        })
      : imageSrc;
  const fillStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
    : undefined;

  return (
    // This module is the next/image stand-in, so the native element is the implementation.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt ?? ''}
      className={className}
      style={fillStyle ? { ...fillStyle, ...style } : style}
      loading={priority ? 'eager' : props.loading}
      {...props}
    />
  );
}

export function ImageResponse({ children }: { children?: ReactNode }) {
  return children ?? null;
}
