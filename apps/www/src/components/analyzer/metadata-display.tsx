'use client';

import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

import type { ProjectMetadata } from '@/hooks/use-package-analyzer';
import { Badge } from '@/components/ui/badge';

interface MetadataDisplayProps {
  metadata: ProjectMetadata;
}

function formatAuthor(author: ProjectMetadata['author']): string {
  if (!author) return '';
  if (typeof author === 'string') return author;
  const parts = [author.name, author.email ? `<${author.email}>` : ''].filter(Boolean);
  return parts.join(' ');
}

function getRepoUrl(repository: ProjectMetadata['repository']): string | null {
  if (!repository) return null;
  if (typeof repository === 'string') return repository;
  const url = repository.url || '';
  return url
    .replace(/^git\+/, '')
    .replace(/^ssh:\/\/git@github\.com/, 'https://github.com')
    .replace(/^git:\/\//, 'https://')
    .replace(/\.git$/, '') || null;
}

function MetadataField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground">{children}</span>
    </div>
  );
}

export function MetadataDisplay({ metadata }: MetadataDisplayProps) {
  const repoUrl = getRepoUrl(metadata.repository);
  const authorText = formatAuthor(metadata.author);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap items-start gap-6 rounded-lg border border-border bg-card px-5 py-4 md:gap-10"
    >
      <MetadataField label="Name">
        <span className="font-mono font-semibold">{metadata.name}</span>
      </MetadataField>

      <MetadataField label="Version">
        <Badge variant="outline" className="font-mono text-xs">
          v{metadata.version}
        </Badge>
      </MetadataField>

      {metadata.license && (
        <MetadataField label="License">
          {metadata.license}
        </MetadataField>
      )}

      {authorText && (
        <MetadataField label="Author">
          {authorText}
        </MetadataField>
      )}

      {metadata.description && (
        <MetadataField label="Description">
          <span className="max-w-xs text-muted-foreground">{metadata.description}</span>
        </MetadataField>
      )}

      {repoUrl && (
        <MetadataField label="Repository">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-yellow-400 transition-colors hover:text-yellow-500"
          >
            {repoUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            <ExternalLink className="size-3" />
          </a>
        </MetadataField>
      )}
    </motion.div>
  );
}
