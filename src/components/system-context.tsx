import { systemStatus, SystemStatus } from '@/lib/bridge/system';
import { createCommand } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

const SystemContext = createContext<{
  status: SystemStatus;
  version: string;
  command: string;
  supported: boolean;
} | null>(null);

export function SystemProvider({ children }: PropsWithChildren) {
  const { data: status = SystemStatus.NotRunning } = useQuery({
    queryKey: ['system-status'],
    queryFn: systemStatus,
    refetchInterval: ({ state: { data: status } }) => (status === SystemStatus.Running ? 5000 : 500),
  });

  const { data: version = 'unknown' } = useQuery({
    queryKey: ['system-version'],
    queryFn: async () => {
      const result = await createCommand('container', ['--version']).execute();
      if (result.code !== 0) {
        throw new Error('Failed to get system version');
      }
      const version = result.stdout.split('version')[1]?.trim();
      if (!version) {
        throw new Error('Failed to get system version');
      }
      return version;
    },
  });

  const { data: command = 'unknown' } = useQuery({
    queryKey: ['system-command'],
    queryFn: async () => {
      const result = await createCommand('command', ['-v', 'container']).execute();
      if (result.code !== 0) {
        throw new Error('Failed to get system command');
      }
      return result.stdout.trim();
    },
  });

  const { data: isAppleSilicon = false } = useQuery({
    queryKey: ['system-arch'],
    queryFn: async () => {
      const result = await invoke('is_apple_silicon');
      return typeof result === 'boolean' ? result : false;
    },
  });

  const value = useMemo(
    () => ({
      status,
      version,
      command,
      supported: isAppleSilicon,
    }),
    [status, version, command, isAppleSilicon],
  );

  return <SystemContext value={value}>{children}</SystemContext>;
}

export function useContainerSystem() {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useContainerSystem must be used within a SystemProvider');
  }
  return context;
}
