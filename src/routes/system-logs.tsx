import { createFileRoute } from '@tanstack/react-router';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { createRef, useEffect, useState } from 'react';
import { Child, Command } from '@tauri-apps/plugin-shell';
import { LogLine, Logs } from '@/components/logs';
import { Toaster } from 'sonner';
import { message } from '@tauri-apps/plugin-dialog';
import { cleanTerminalOutput } from '@/utils';

export const Route = createFileRoute('/system-logs')({
  component: SystemLogsPage,
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

function SystemLogsPage() {
  const [logs, setLogs] = useState<LogLine[]>([]);

  useEffect(() => {
    void (async () => {
      const win = getCurrentWindow();
      const close = () => {
        console.log('Closing logs window');
        void win.close().catch((e) => {
          console.error('Failed to close window:', e);
        });
      };

      const result = await Command.create('script', ['-q', '/dev/null', 'container', 'system', 'logs']).execute();
      if (result.code !== 0) {
        void message(result.stderr || 'Unknown error', {
          kind: 'error',
          title: 'Failed to get system logs',
        })
          .then(close)
          .catch(close);
        return;
      }
      setLogs([
        {
          line: cleanTerminalOutput(result.stdout) + '\n\n',
          type: 'stdout',
        },
      ]);

      const command = Command.create('script', ['-q', '/dev/null', 'container', 'system', 'logs', '--follow']);
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
    })();
  }, []);

  return (
    <>
      <Toaster />
      <Logs logs={logs} name="container-server-logs" live />
    </>
  );
}
