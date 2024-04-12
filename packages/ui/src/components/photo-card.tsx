import Image from 'next/image';
import { Card, CardContent } from './ui/card';

interface ColorCardsProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  width: string;
  popColor?: string;
}

export const ColorCards: React.FC<ColorCardsProps> = ({
  imageUrl,
  imageAlt,
  title,
  width,
  popColor = '#e0dcc6',
}) => {
  return (
    <Card className={`w-[${width}] rounded-lg overflow-hidden shadow-lg`}>
      <img
        alt={imageAlt}
        className="w-full h-auto"
        height="350"
        src={imageUrl}
        style={{
          aspectRatio: '387/350',
          objectFit: 'cover',
        }}
        width="387"
      />
      <Image
        src={imageUrl}
        alt={imageAlt}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
      <CardContent className={`p-10 bg-[${popColor}]`}>
        <p className="text-lg font-semibold ">{title}</p>
      </CardContent>
    </Card>
  );
};
