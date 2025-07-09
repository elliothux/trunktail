import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { message } from '@tauri-apps/plugin-dialog';
import { Command, SpawnOptions } from '@tauri-apps/plugin-shell';

const COMMAND_PATH = [
  '/opt/homebrew/bin',
  '/usr/local/bin',
  '/usr/local/sbin',
  '/usr/bin',
  '/usr/sbin',
  '/bin',
  '/sbin',
  '/opt/bin',
  '/opt/local/bin',
  '/opt/local/sbin',
  '/snap/bin',
]
  .filter(Boolean)
  .join(':');

export function createCommand(program: string, args: string | string[] = [], options: SpawnOptions = {}) {
  return Command.create(program, args, {
    env: { PATH: COMMAND_PATH },
    cwd: '/',
    ...options,
  });
}

export function openPathWithFinder(path: string) {
  return createCommand('open', ['-R', path], {
    cwd: '/',
  }).execute();
}

interface OpenWebviewWindowProps {
  url: string;
  viewId: string;
  title: string;
}

export async function openWebviewWindow({ url, viewId, title }: OpenWebviewWindowProps) {
  const existing = await WebviewWindow.getByLabel(viewId);
  if (existing) {
    await existing.destroy();
  }

  const win = new WebviewWindow(viewId, {
    url,
    center: true,
    width: 800,
    height: 600,
    resizable: true,
    title,
  });
  win.once('tauri://created', () => {
    win.show();
  });
  win.once('tauri://error', (e) => {
    void message(e instanceof Error ? e.message : 'Unknown error', {
      kind: 'error',
      title: 'Failed to open window',
    });
    win.destroy();
  });
}

export function cleanTerminalOutput(text: string): string {
  return text
    .replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '')
    .replace(/\x1b\([0-9;]*[a-zA-Z]/g, '')
    .replace(/\x1b\)[0-9;]*[a-zA-Z]/g, '')
    .replace(/\x1b[=#][0-9;]*[a-zA-Z]/g, '')
    .replace(/\x1b[><]/g, '')
    .replace(/\x9b[0-9;?]*[a-zA-Z]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/\^[A-Z@[\\\]^_]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
