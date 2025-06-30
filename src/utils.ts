import { Command } from '@tauri-apps/plugin-shell';

export function openPathWithFinder(path: string) {
  return Command.create('open', ['-R', path], {
    cwd: '/',
  }).execute();
}
