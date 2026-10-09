import type { CSSProperties, ImgHTMLAttributes } from 'react';

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | { src: string };
  alt: string;
  fill?: boolean;
  quality?: number;
  priority?: boolean;
};

export default function Image({
  src,
  alt,
  fill,
  quality: _quality,
  priority: _priority,
  style,
  ...props
}: ImageProps) {
  const resolved = typeof src === 'string' ? src : src.src;
  const fillStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
    : undefined;

  return (
    // Storybook has no Next image optimizer. This mock is the stand-in.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolved} alt={alt} style={{ ...fillStyle, ...style }} {...props} />
  );
}
