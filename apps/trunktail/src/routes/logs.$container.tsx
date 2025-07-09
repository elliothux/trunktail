import { LogLine, Logs } from '@/components/logs';
import { cleanTerminalOutput, createCommand } from '@/utils';
import { createFileRoute } from '@tanstack/react-router';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { message } from '@tauri-apps/plugin-dialog';
import { Child } from '@tauri-apps/plugin-shell';
import { createRef, useEffect, useState } from 'react';
import { Toaster } from 'sonner';

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
  const [logs, setLogs] = useState<LogLine[]>([]);

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
      })
        .then(close)
        .catch(close);
      return;
    }

    const command = createCommand('script', ['-q', '/dev/null', 'container', 'logs', container, '--follow']);
    command.stdout.on('data', (line) =>
      setLogs((prev) => [...prev, { line: cleanTerminalOutput(line), type: 'stdout' }]),
    );
    command.stderr.on('data', (line) =>
      setLogs((prev) => [...prev, { line: cleanTerminalOutput(line), type: 'stderr' }]),
    );
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
    <>
      <Toaster />
      <Logs logs={logs} name={container} live />
    </>
  );
}
