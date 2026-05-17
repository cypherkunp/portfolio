'use client';

import { AlertTriangle, Calendar, CheckCircle, Package } from 'lucide-react';
import { motion } from 'motion/react';

import { Card, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  totalPackages: number;
  outdatedCount: number;
  upToDateCount: number;
  averageAge: number | null;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.4, ease: 'easeOut' as const },
  }),
};

export function StatsCards({
  totalPackages,
  outdatedCount,
  upToDateCount,
  averageAge,
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Total packages',
      value: totalPackages,
      icon: Package,
      accent: 'text-foreground',
      iconBg: 'bg-muted',
    },
    {
      label: 'Outdated',
      value: outdatedCount,
      icon: AlertTriangle,
      accent: 'text-yellow-400',
      iconBg: 'bg-yellow-400/10',
    },
    {
      label: 'Up to date',
      value: upToDateCount,
      icon: CheckCircle,
      accent: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10',
    },
    {
      label: 'Avg. age',
      value: averageAge !== null ? `${averageAge}d` : '—',
      icon: Calendar,
      accent: 'text-muted-foreground',
      iconBg: 'bg-muted',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                <stat.icon className={`size-5 ${stat.accent}`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold tabular-nums ${stat.accent}`}>
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-[11px]">{stat.label}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
