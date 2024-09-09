import React from 'react';
import { Card, CardContent } from './ui/card';

interface CompanyCardProps {
  name: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ name, Icon }) => (
  <Card className={'group relative overflow-hidden !bg-neutral-800'}>
    <CardContent className="md:py-15 flex flex-col items-center justify-center gap-y-4 px-0 py-10">
      <Icon className="h-2 w-2 md:h-4 md:w-4" />
      <p className="text-xs font-semibold text-white lg:text-xs">{name}</p>
    </CardContent>
    <div
      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity
        duration-300 group-hover:opacity-100"
    />
  </Card>
);

export default CompanyCard;
