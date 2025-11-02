'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Code, Database, Globe, Package, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

interface Project {
  name: string;
  url: string;
  description?: string;
  icon?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  default: Building2,
  code: Code,
  globe: Globe,
  package: Package,
  zap: Zap,
  database: Database,
};

const ProjectBlock: React.FC = () => {
  const t = useTranslations('HomePage.clientBlock');
  const projects = (t.raw('list') as unknown as Project[]) || [];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => {
        const IconComponent = iconMap[project.icon || 'default'] || iconMap.default;

        return (
          <Link
            key={project.url}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group relative flex items-start gap-3 rounded-lg p-3 transition-colors',
              'hover:bg-neutral-100/80 dark:hover:bg-neutral-800/40',
            )}
          >
            <div className="flex-shrink-0 pt-0.5">
              <IconComponent className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold leading-tight text-neutral-900 dark:text-neutral-100">
                {project.name}
              </h3>
              {project.description && (
                <p className="mt-0.5 text-xs leading-snug text-neutral-600 dark:text-neutral-400">
                  {project.description}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProjectBlock;
