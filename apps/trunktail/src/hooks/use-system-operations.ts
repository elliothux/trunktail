import { SystemStatus } from '@/lib/bridge/system';
import { createCommand } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from '@tauri-apps/plugin-dialog';
import { useCallback } from 'react';
import { toast } from 'sonner';

const startCommand = () => createCommand('container', ['system', 'start']);
const stopCommand = () => createCommand('container', ['system', 'stop']);

export function useSystemOperations() {
  const queryClient = useQueryClient();

  const setSystemStatus = useCallback(
    (status: SystemStatus) => {
      queryClient.setQueryData(['system-status'], status);
    },
    [queryClient],
  );

  const { mutate: start, isPending: isStarting } = useMutation({
    mutationFn: async () => {
      const command = startCommand();
      const result = await command.execute();
      if (result.code !== 0) {
        throw new Error(result.stderr);
      }
    },
    onSuccess: () => {
      setSystemStatus(SystemStatus.Running);
      toast.success('System started');
    },
    onError: (error: unknown) => {
      void message(error instanceof Error ? error.message : 'Unknown error', {
        title: 'Failed to start system',
        kind: 'error',
      });
    },
  });

  const { mutate: stop, isPending: isStopping } = useMutation({
    mutationFn: async () => {
      const command = stopCommand();
      const result = await command.execute();
      if (result.code !== 0) {
        throw new Error(result.stderr);
      }
    },
    onSuccess: () => {
      setSystemStatus(SystemStatus.NotRunning);
      toast.success('System stopped');
    },
    onError: (error: unknown) => {
      void message(error instanceof Error ? error.message : 'Unknown error', {
        title: 'Failed to stop system',
        kind: 'error',
      });
    },
  });

  const { mutate: restart, isPending: isRestarting } = useMutation({
    mutationFn: async () => {
      const stopResult = await stopCommand().execute();
      const startResult = await startCommand().execute();
      if (startResult.code !== 0 || stopResult.code !== 0) {
        throw new Error(startResult.stderr || stopResult.stderr);
      }
    },
    onSuccess: () => {
      setSystemStatus(SystemStatus.Running);
      toast.success('System restarted');
    },
    onError: (error: unknown) => {
      void message(error instanceof Error ? error.message : 'Unknown error', {
        title: 'Failed to restart system',
        kind: 'error',
      });
    },
  });

  return {
    start,
    isStarting,
    stop,
    isStopping,
    restart,
    isRestarting,
  };
}
