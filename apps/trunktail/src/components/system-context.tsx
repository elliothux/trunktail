import { systemStatus, SystemStatus } from '@/lib/bridge/system';
import { createCommand } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getTauriVersion, getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/core';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

interface LatestRelease {
  app: {
    v: string;
    u: string;
    d?: string[];
  };
  cli: {
    v: string;
    u: string;
  };
}

const SystemContext = createContext<{
  status: SystemStatus;
  version: string;
  command: string;
  supported: boolean;
  appInfo?: {
    appVersion: string;
    tauriVersion: string;
  };
  latestRelease?: LatestRelease;
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

  const { data: appInfo } = useQuery({
    queryKey: ['app-version'],
    queryFn: async () => {
      const [appVersion, tauriVersion] = await Promise.all([getVersion(), getTauriVersion()]);
      return { appVersion, tauriVersion };
    },
  });

  const { data: latestRelease } = useQuery({
    queryKey: ['latest-release'],
    queryFn: async () => {
      const req = await fetch('https://trunktail.pages.dev/latest-release.json');
      if (!req.ok) {
        throw new Error('Failed to fetch latest release');
      }
      const data = await req.json();
      return data as LatestRelease;
    },
  });

  const value = useMemo(
    () => ({
      status,
      version,
      command,
      supported: isAppleSilicon,
      appInfo,
      latestRelease,
    }),
    [status, version, command, isAppleSilicon, appInfo, latestRelease],
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
