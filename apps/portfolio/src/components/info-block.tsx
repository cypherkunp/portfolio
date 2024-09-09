import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { BackgroundGlow } from './background-glow';

interface InfoBlockProps {
  title: string;
  highlight: string;
  description: string;
  avatarUrl: string;
  avatarAlt: string;
}

export default function InfoBlock({
  title,
  highlight,
  description,
  avatarUrl,
  avatarAlt,
}: InfoBlockProps) {
  return (
    <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-start md:gap-16">
      <Avatar className="z-10 size-36 md:size-32">
        <AvatarImage alt={avatarAlt} src={avatarUrl} />
        <AvatarFallback>{avatarAlt[0]}</AvatarFallback>
      </Avatar>
      <div className="flex max-w-[350px] flex-col items-start gap-2 md:items-start">
        <h1 className="text-2xl font-semibold text-white ">{title}</h1>
        <p className="text-md font-bold text-white ">{highlight}</p>
        <p className="md:text-md text-sm text-white md:text-left ">{description}</p>
      </div>
    </div>
  );
}
