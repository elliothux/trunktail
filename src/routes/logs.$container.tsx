import { cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { message } from '@tauri-apps/plugin-dialog';
import { Child, Command } from '@tauri-apps/plugin-shell';
import { Loader2 } from 'lucide-react';
import { createRef, useEffect, useState } from 'react';

export const Route = createFileRoute('/logs/$container')({
  component: LogsPage,
});

const win = getCurrentWindow();
const process = createRef<Promise<Child>>();

void win.onCloseRequested((e) => {
  if (process.current != null) {
    console.log('unlisten closeRequested', e);
    e.preventDefault();
    process.current.then((p) => {
      p.kill()
        .then(() => {
          void win.close();
        })
        .catch((e) => {
          console.error('Failed to kill process:', e);
          void win.close();
        });
    });
  }
});

// TODO: use virtual list for performance with large logs
function LogsPage() {
  const { container } = Route.useParams();
  const [logs, setLogs] = useState<{ line: string; type: 'stdout' | 'stderr' }[]>([]);

  useEffect(() => {
    const win = getCurrentWindow();
    const close = () => {
      console.log('Closing logs window');
      void win.close().catch((e) => {
        console.error('Failed to close window:', e);
      });
    };

    if (!container) {
      void message('Missing container id', {
        kind: 'error',
        title: 'Error',
      }).then(close);
      return;
    }

    const command = Command.create('script', ['-q', '/dev/null', 'container', 'logs', container, '--follow']);
    command.stdout.on('data', (line) => setLogs((prev) => [...prev, { line, type: 'stdout' }]));
    command.stderr.on('data', (line) => setLogs((prev) => [...prev, { line, type: 'stderr' }]));
    process.current = command.spawn();

    return () => {
      if (process.current != null) {
        process.current.then((p) => {
          process.current = null;
          return p.kill();
        });
      }
    };
  }, [container]);

  return (
    <div className="h-screen w-screen overflow-scroll bg-gray-950 px-6 pt-8 pb-12 font-mono text-xs leading-relaxed whitespace-pre-wrap">
      {logs.map(({ line, type }, i) => (
        <p key={i} className={cn('py-0.5', type === 'stderr' ? 'text-red-400' : 'text-[#0f0]')}>
          {line}
        </p>
      ))}
      <div className="flex items-center justify-start gap-2 py-2 text-gray-400 select-none">
        <Loader2 className="animate-spin" size={16} />
        <p>Waiting for logs...</p>
      </div>
    </div>
  );
}
