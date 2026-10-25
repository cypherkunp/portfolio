import type { CSSProperties, ImgHTMLAttributes, ReactNode } from 'react';

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | { src: string };
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  loader?: unknown;
  sizes?: string;
};

export type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function Image({
  src,
  alt,
  fill,
  priority,
  className,
  style,
  loader: _loader,
  quality: _quality,
  sizes: _sizes,
  ...props
}: ImageProps) {
  const url = typeof src === 'string' ? src : src.src;
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
