import { OperationButton } from '@/components/ui/operation-button';
import { ContainerInfo, deleteContainer, killContainer, startContainer, stopContainer } from '@/lib/bridge/containers';
import { getServicePath } from '@/lib/bridge/utils';
import { Button } from '@heroui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Menu } from '@tauri-apps/api/menu';
import { confirm, message } from '@tauri-apps/plugin-dialog';
import { openUrl } from '@tauri-apps/plugin-opener';
import { Folder, Link, Play, Square, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

interface Props {
  container: ContainerInfo;
  active: boolean;
  onSelect: (image: ContainerInfo) => void;
}

export function ContainerItem({
  container: {
    status,
    configuration: {
      id,
      image: { reference },
    },
    networks: [network],
  },
  container,
  active,
  onSelect,
}: Props) {
  const [name, tag] = reference.split(':');

  console.log('container', container);

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
      message(e == null ? 'Unknown error' : e instanceof Error ? e.message : e.toString(), {
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
      message(e == null ? 'Unknown error' : e instanceof Error ? e.message : e.toString(), {
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
      message(e == null ? 'Unknown error' : e instanceof Error ? e.message : e.toString(), {
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
      message(e == null ? 'Unknown error' : e instanceof Error ? e.message : e.toString(), {
        kind: 'warning',
        title: 'Failed to delete container',
      });
    },
  });

  const onOpenFolder = useCallback(async () => {
    const path = await getServicePath(`/containers/${id}`);
    invoke('show_folder', { path }).then((result) => {
      console.log('result', result);
    });
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

  const address = network?.address.split('/')[0];

  const menus = useMemo(() => {
    const running = status === 'running';
    return Menu.new({
      items: [
        {
          id: running ? 'Stop' : 'Start',
          text: running ? 'Stop' : 'Start',
          action: () => {
            if (running) {
              onStop();
            } else {
              onStart();
            }
          },
        },
        {
          id: 'Open link',
          text: 'Open link',
          action: () => {
            openUrl(`https://${address}`);
          },
          enabled: !!address,
        },
        {
          id: 'Open folder',
          text: 'Open folder',
          action: onOpenFolder,
        },
        {
          id: 'Kill',
          text: 'Kill',
          action: () => {
            onKill();
          },
          enabled: status === 'running',
        },
        {
          id: 'Delete',
          text: 'Delete',
          action: onDeleteConfirm,
          enabled: status !== 'running',
        },
      ],
    });
  }, [status, id, address, onStart, onStop, onKill, onDelete, isStarting, isStopping, isKilling, isDeleting]);

  useEffect(() => {
    const unlisten = listen<string>('menu-event', (event) => {
      if (!event.payload.startsWith('ctx')) return;
      switch (event.payload) {
        default:
          console.log('Unimplemented application menu id:', event.payload);
      }
    });

    return () => {
      unlisten.then((unlisten) => unlisten());
    };
  }, []);

  return (
    <Button
      as="section"
      className="mb-1 flex w-full items-center justify-between px-4"
      variant={active ? 'solid' : 'light'}
      color={active ? 'primary' : 'default'}
      onPress={() => onSelect(container)}
      onContextMenu={async (event) => {
        event.preventDefault();
        (await menus).popup().catch((e) => {
          console.error('Failed to open context menu:', e);
        });
      }}
      size="lg"
    >
      <div>
        <p className="text-sm">{id}</p>
        <p className="text-muted-foreground text-xs opacity-80">
          {name}:<span className="text-muted-foreground">{tag}</span>
        </p>
      </div>
      <div className="flex items-center space-x-1">
        <OperationButton
          title="Link"
          active={active}
          icon={Link}
          onClick={() => openUrl(`https://${address}`)}
          disabled={!address}
        />
        <OperationButton title="Folder" active={active} icon={Folder} onClick={onOpenFolder} />
        <OperationButton
          title={status === 'running' ? 'Stop container' : 'Start container'}
          active={active}
          isLoading={isStarting || isStarting}
          icon={status === 'running' ? Square : Play}
          onClick={status === 'running' ? onStop : onStart}
        />
        <OperationButton
          title="Delete"
          active={active}
          disabled={status === 'running'}
          icon={Trash2}
          onClick={onDeleteConfirm}
        />
      </div>
    </Button>
  );
}
