import type { CSSProperties, ImgHTMLAttributes } from 'react';

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

// Photo loaders ask for a width. Use the largest device width so the rendition stays sharp.
const MAX_IMAGE_WIDTH = 3840;

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
          width: Math.max(width, MAX_IMAGE_WIDTH),
          quality: typeof quality === 'number' ? quality : undefined,
        })
      : imageSrc;
  const fillStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
    : undefined;

  return (
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
