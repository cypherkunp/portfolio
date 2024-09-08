import React from 'react';
import { Card, CardContent } from './ui/card';

interface CompanyCardProps {
  name: string;
  Icon: React.ElementType;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ name, Icon }) => (
  <Card className={'group relative overflow-hidden !bg-neutral-800'}>
    <CardContent className="md:py-15 flex items-center justify-center gap-x-2 px-2 py-10">
      <Icon className="h-2 w-2 rounded-full bg-rose-400 md:h-4 md:w-4" />
      <h3 className="text-lg font-semibold text-white lg:text-sm">{name}</h3>
    </CardContent>
    <div
      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity
        duration-300 group-hover:opacity-100"
    />
  </Card>
);

export default CompanyCard;
