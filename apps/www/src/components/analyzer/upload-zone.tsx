'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { cn } from '@repo/ui/lib/utils';
import { FileJson, Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  fileName: string | null;
  isAnalyzing: boolean;
  onReset: () => void;
}

export function UploadZone({ onFileUpload, fileName, isAnalyzing, onReset }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileUpload(file);
    },
    [onFileUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileUpload(file);
      if (inputRef.current) inputRef.current.value = '';
    },
    [onFileUpload],
  );

  if (fileName) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-border flex items-center gap-3 rounded-sm border px-4 py-3"
      >
        <FileJson className="size-4 shrink-0 text-yellow-500" />
        <span className="text-foreground min-w-0 truncate text-sm">{fileName}</span>
        {isAnalyzing && <span className="text-muted-foreground shrink-0 text-xs">Analyzing…</span>}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-8 shrink-0"
          onClick={onReset}
          disabled={isAnalyzing}
          aria-label="Remove file"
        >
          <X className="size-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dropzone"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'group relative cursor-pointer overflow-hidden rounded-sm border border-dashed transition-colors duration-200',
            isDragOver
              ? 'border-yellow-500 bg-yellow-400/5'
              : 'border-border hover:border-yellow-500/60',
          )}
        >
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground flex items-center gap-2 text-base font-bold tracking-tight">
                <FileJson className="size-4 shrink-0 text-neutral-500" aria-hidden />
                Drop your package.json here
              </h3>
              <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-relaxed">
                Drag and drop a file, or browse. We&apos;ll list your dependencies and flag what is
                out of date.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-fit shrink-0 gap-2 border-neutral-700 text-neutral-200 hover:border-yellow-500/60 hover:bg-neutral-800/60 hover:text-neutral-100"
              onClick={e => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <Upload className="size-4" />
              Browse files
            </Button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
