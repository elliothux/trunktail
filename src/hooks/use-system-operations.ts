import { useMutation } from '@tanstack/react-query';
import { Command } from '@tauri-apps/plugin-shell';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { SystemStatus } from '@/lib/bridge/system';
import { toast } from 'sonner';
import { message } from '@tauri-apps/plugin-dialog';

const startCommand = () => Command.create('container', ['system', 'start']);
const stopCommand = () => Command.create('container', ['system', 'stop']);

export function useSystemOperations() {
  const queryClient = useQueryClient();

  const setSystemStatus = useCallback(
    (status: SystemStatus) => {
      queryClient.setQueryData(['system-status'], status);
    },
    [queryClient],
  );

  const {
    mutate: start,
    mutateAsync: startAsync,
    isPending: isStarting,
  } = useMutation({
    mutationFn: async () => {
      const command = startCommand();
      const result = await command.execute();
      if (result.code !== 0) {
        throw new Error(result.stderr);
      }
    },
    onSuccess: () => {
      toast.success('System started');
      setSystemStatus(SystemStatus.Running);
    },
    onError: (error: unknown) => {
      void message(error instanceof Error ? error.message : 'Unknown error', {
        title: 'Failed to start system',
        kind: 'error',
      });
    },
  });

  const {
    mutate: stop,
    mutateAsync: stopAsync,
    isPending: isStopping,
  } = useMutation({
    mutationFn: async () => {
      const command = stopCommand();
      const result = await command.execute();
      if (result.code !== 0) {
        throw new Error(result.stderr);
      }
    },
    onSuccess: () => {
      toast.success('System stopped');
      setSystemStatus(SystemStatus.NotRunning);
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
      toast.success('System restarted');
      setSystemStatus(SystemStatus.Running);
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
