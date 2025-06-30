import { ContainerInfo, deleteContainer, killContainer, startContainer, stopContainer } from '@/lib/bridge/containers';
import { getServicePath } from '@/lib/bridge/utils';
import { openPathWithFinder } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { confirm, message } from '@tauri-apps/plugin-dialog';
import { Command } from '@tauri-apps/plugin-shell';
import { useCallback } from 'react';
import { toast } from 'sonner';

export function useContainerOperations({ status, configuration: { id }, networks: [network] }: ContainerInfo) {
  const queryClient = useQueryClient();
  const update = useCallback(
    (info: ContainerInfo) => {
      queryClient.setQueryData(['containers'], (old: ContainerInfo[]) => {
        return old.map((i) => (i.configuration.id === id ? info : i));
      });
    },
    [queryClient, id],
  );

  const { mutate: onStart, isPending: isStarting } = useMutation({
    mutationFn: () => startContainer(id),
    onSuccess: (container) => {
      update(container);
      toast.success('Container started');
    },
    onError: (e: unknown) => {
      void message(e == null ? 'Unknown error' : e instanceof Error ? e.message : e.toString(), {
        kind: 'warning',
        title: 'Failed to start container',
      });
    },
  });

  const { mutate: onStop, isPending: isStopping } = useMutation({
    mutationFn: () => stopContainer(id),
    onSuccess: (container) => {
      update(container);
      toast.success('Container stopped');
    },
    onError: (e: unknown) => {
      console.log('e', e);
      void message(e == null ? 'Unknown error' : e instanceof Error ? e.message : e.toString(), {
        kind: 'warning',
        title: 'Failed to stop container',
      });
    },
  });

  const { mutate: onKill, isPending: isKilling } = useMutation({
    mutationFn: () => killContainer(id),
    onSuccess: (container) => {
      update(container);
      toast.success('Container killed');
    },
    onError: (e: unknown) => {
      void message(e == null ? 'Unknown error' : e instanceof Error ? e.message : e.toString(), {
        kind: 'warning',
        title: 'Failed to kill container',
      });
    },
  });

  const { mutate: onDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteContainer(id),
    onSuccess: (container) => {
      update(container);
      toast.success('Container deleted');
    },
    onError: (e: unknown) => {
      void message(e == null ? 'Unknown error' : e instanceof Error ? e.message : e.toString(), {
        kind: 'warning',
        title: 'Failed to delete container',
      });
    },
  });

  const onOpenFolder = useCallback(async () => {
    const path = await getServicePath(`/containers/${id}`);
    void openPathWithFinder(path);
  }, [id]);

  const onDeleteConfirm = useCallback(async () => {
    confirm('Are you sure you want to delete this container?', {
      title: 'Delete container',
      kind: 'error',
    }).then((result) => {
      if (result) {
        onDelete();
      }
    });
  }, [onDelete]);

  const onOpenLogs = useCallback(async () => {
    const viewId = `log-viewer-${id}`;
    const existing = await WebviewWindow.getByLabel(viewId);
    if (existing) {
      await existing.destroy();
    }

    const win = new WebviewWindow(viewId, {
      url: `${window.location.origin}/logs/${id}`,
      center: true,
      width: 800,
      height: 600,
      resizable: true,
      title: `Logs - ${id}`,
    });
    win.once('tauri://created', () => {
      console.log('created');
      win.show();
    });
    win.once('tauri://error', (e) => {
      console.error('Failed to create login window:', e);
    });
  }, [id]);

  const onOpenTerminal = useCallback(async () => {
    const command = `container exec --tty --interactive ${id} sh`;
    const result = await Command.create('osascript', [
      '-e',
      `tell application "Terminal" to activate`,
      '-e',
      `tell application "Terminal" to do script "${command}"`,
    ]).execute();
    if (result.code !== 0) {
      toast.error('Failed to open terminal');
    }
  }, [id]);

  const address = network?.address.split('/')[0];

  return {
    onStart,
    onStop,
    onKill,
    onOpenFolder,
    onDeleteConfirm,
    onOpenLogs,
    onOpenTerminal,
    isStarting,
    isStopping,
    isKilling,
    isDeleting,
    address,
  };
}
