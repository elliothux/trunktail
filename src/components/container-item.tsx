import { ContainerStatusIndicator } from '@/components/container-status-indicator';
import { ImageIcon } from '@/components/image-icon';
import { OperationButton } from '@/components/ui/operation-button';
import { useContainerOperations } from '@/hooks/use-container-operations';
import { ContainerInfo } from '@/lib/bridge/containers';
import { Button } from '@heroui/button';
import { Menu } from '@tauri-apps/api/menu';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { openUrl } from '@tauri-apps/plugin-opener';
import { Ellipsis, Link, Play, Square, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
  container: ContainerInfo;
  active: boolean;
  onSelect: (id: string) => void;
}

export function ContainerItem({
  container: {
    status,
    configuration: {
      id,
      image: {
        descriptor: { digest },
        parsedReference: { name, tag, org },
      },
    },
    networks: [network],
  },
  container,
  active,
  onSelect,
}: Props) {
  const {
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
  } = useContainerOperations(container);

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
            void openUrl(`https://${address}`);
          },
          enabled: !!address,
        },
        {
          id: 'Copy link',
          text: 'Copy link',
          action: () => {
            void writeText(`https://${address}`);
          },
          enabled: !!address,
        },
        {
          id: 'View files',
          text: 'View files',
          action: onOpenFolder,
        },
        {
          id: 'View logs',
          text: 'View logs',
          action: onOpenLogs,
        },
        {
          id: 'Open terminal',
          text: 'Open terminal',
          action: onOpenTerminal,
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
  }, [status, id, address, onStart, onStop, onKill, isStarting, isStopping, isKilling, isDeleting]);

  const onOpenMenu = async () => {
    (await menus).popup().catch((e: unknown) => {
      console.error('Failed to open context menu:', e);
    });
  };

  return (
    <Button
      as="section"
      className="mb-1 flex w-full items-center justify-start px-4"
      variant={active ? 'solid' : 'light'}
      color={active ? 'primary' : 'default'}
      onPress={() => onSelect(id)}
      onContextMenu={(e) => {
        e.preventDefault();
        void onOpenMenu();
      }}
      size="lg"
    >
      <ImageIcon name={name} org={org} digest={digest} />
      <div>
        <div className="flex flex-row items-center justify-start gap-1.5">
          <ContainerStatusIndicator status={status} className="mt-0.5" />
          <p className="text-sm">{id}</p>
        </div>
        <p className="text-muted-foreground text-xs opacity-75">
          {name}:<span className="text-muted-foreground">{tag}</span>
        </p>
      </div>
      <div className="ml-auto flex items-center space-x-1">
        <OperationButton
          title="Link"
          active={active}
          icon={Link}
          onClick={() => openUrl(`https://${address}`)}
          disabled={!address}
        />
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
        <OperationButton active={active} icon={Ellipsis} onClick={onOpenMenu} />
      </div>
    </Button>
  );
}
