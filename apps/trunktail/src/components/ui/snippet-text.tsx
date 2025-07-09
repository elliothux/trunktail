import { cn } from '@/lib/utils';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { Check, Copy } from 'lucide-react';
import { PropsWithChildren, useRef, useState } from 'react';

interface Props extends PropsWithChildren {
  className?: string;
}

export function SnippetText({ className, children }: Props) {
  const [copied, setCopied] = useState(false);

  const timer = useRef<number | null>(null);

  return (
    <div
      className={cn('cursor-pointer text-sm', className)}
      onClick={async () => {
        if (copied) {
          return;
        }
        await writeText(children?.toString() ?? '');
        setCopied(true);
        if (timer.current) {
          clearTimeout(timer.current);
        }
        timer.current = window.setTimeout(() => {
          setCopied(false);
        }, 1000 * 2);
      }}
    >
      <span className="break-all text-gray-800">{children}</span>
      <span> </span>
      {copied ? (
        <Check className="inline text-green-500" size={16} />
      ) : (
        <Copy className="inline text-gray-500" size={14} />
      )}
    </div>
  );
}
