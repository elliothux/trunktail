import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { systemStatus, SystemStatus } from '@/lib/bridge/system';
import { useQuery } from '@tanstack/react-query';

const SystemContext = createContext<{
  status: SystemStatus;
} | null>(null);

export function SystemProvider({ children }: PropsWithChildren) {
  const { data: status = SystemStatus.NotRunning } = useQuery({
    queryKey: ['system-status'],
    queryFn: systemStatus,
    refetchInterval: ({ state: { data: status } }) => (status === SystemStatus.Running ? 5000 : 500),
  });

  const value = useMemo(
    () => ({
      status,
    }),
    [status],
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
