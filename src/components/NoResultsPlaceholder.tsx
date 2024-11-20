import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface NoResultsPlaceholderProps {
  message?: string;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
}

export function NoResultsPlaceholder({
  message = 'No results found.',
  className,
}: NoResultsPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center py-8',
        className
      )}
    >
      <div className="relative w-full max-w-[250px] h-auto aspect-[250/160]">
        <Image
          src="/Looking.svg"
          alt="Looking illustration"
          fill
          className="rounded object-contain"
          priority
        />
      </div>
      <p className="text-sm text-muted-foreground sm:text-base">{message}</p>
    </div>
  );
}
