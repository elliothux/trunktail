import { cn } from '@/lib/utils';
import { Snippet } from '@heroui/snippet';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  className?: string;
}

export function SnippetText({ className, children }: Props) {
  return (
    <Snippet
      className={cn('text-sm', className)}
      classNames={{
        pre: 'overflow-scroll scrollbar-hide grow-0 shrink',
        copyButton: 'min-w-6 w-6 h-6 opacity-30 hover:opacity-100',
      }}
      size="sm"
      symbol=""
    >
      {children}
    </Snippet>
  );
}
