'use client';

import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FileJson, Upload, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
      >
        <FileJson className="size-5 text-yellow-400" />
        <span className="font-mono text-sm text-foreground">{fileName}</span>
        {isAnalyzing && (
          <span className="text-xs text-muted-foreground">Analyzing...</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-8"
          onClick={onReset}
          disabled={isAnalyzing}
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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300',
            isDragOver
              ? 'border-yellow-400 bg-yellow-400/5'
              : 'border-border hover:border-yellow-400/50 hover:bg-card/50',
          )}
        >
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-16 md:py-24">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                'flex size-20 items-center justify-center rounded-2xl border transition-colors duration-300',
                isDragOver
                  ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-400'
                  : 'border-border bg-card text-muted-foreground group-hover:border-yellow-400/30 group-hover:text-yellow-400',
              )}
            >
              <FileJson className="size-10" />
            </motion.div>

            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-lg font-semibold text-foreground">
                Drop your package.json here
              </h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Drag and drop your package.json file, or click to browse.
                We'll analyze your dependencies and show what's outdated.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-400"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                <Upload className="size-4" />
                Browse files
              </Button>
            </div>
          </div>

          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 rounded-xl bg-yellow-400/5"
            />
          )}

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
