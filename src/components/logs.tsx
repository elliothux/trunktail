import { cn } from '@/lib/utils';
import { ArrowDownToLine, ClipboardCopy, Loader2 } from 'lucide-react';
import { Button } from '@heroui/button';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { toast } from 'sonner';
import { confirm } from '@tauri-apps/plugin-dialog';
import { openPathWithFinder } from '@/utils';
import { useEffect, useRef } from 'react';

export interface LogLine {
  line: string;
  type: 'stdout' | 'stderr';
}

interface LogsProps {
  logs: LogLine[];
  live?: boolean;
  name: string;
}

export function Logs({ logs, name, live }: LogsProps) {
  const getText = () => logs.map((i) => i.line).join('');

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [logs]);

  return (
    <>
      <div
        className="h-screen w-screen overflow-scroll bg-gray-950 px-6 pt-8 pb-12 font-mono text-xs leading-relaxed whitespace-pre-wrap"
        ref={ref}
      >
        {logs.map(({ line, type }, i) => (
          <p key={i} className={cn('py-0.5', type === 'stderr' ? 'text-red-400' : 'text-[#0f0]')}>
            {line}
          </p>
        ))}
        {live ? (
          <div className="flex items-center justify-start gap-2 py-2 text-gray-400 select-none">
            <Loader2 className="animate-spin" size={16} />
            <p>Waiting for logs...</p>
          </div>
        ) : null}
      </div>
      <div className="fixed right-4 bottom-4 flex gap-2">
        <Button
          size="sm"
          onPress={async () => {
            const path = await save({
              title: 'Save logs',
              canCreateDirectories: true,
              defaultPath: `~/Downloads/${name}_logs`,
            });
            if (!path) {
              return;
            }
            await writeTextFile(path, getText());
            const viewInFinder = await confirm(`Saved at ${path}`, {
              title: 'Logs saved',
              kind: 'info',
              okLabel: 'View in Finder',
            });
            if (viewInFinder) {
              void openPathWithFinder(path);
            }
          }}
          isIconOnly
        >
          <ArrowDownToLine size={14} />
        </Button>
        <Button
          size="sm"
          onPress={async () => {
            await writeText(getText());
            toast.success('Copied to clipboard');
          }}
          isIconOnly
        >
          <ClipboardCopy size={14} />
        </Button>
      </div>
    </>
  );
}
