import { ContainerStatusIndicator } from '@/components/container-status-indicator';
import { useContainerOperations } from '@/hooks/use-container-operations';
import { ContainerInfo } from '@/lib/bridge/containers';
import { Button } from '@heroui/button';
import { BookCopy, ChevronRight, FileText, Terminal } from 'lucide-react';
import { useMemo } from 'react';
import { DetailRow } from './ui/detail-row';

interface Props {
  container: ContainerInfo;
}

export function ContainerDetail({
  container: {
    status,
    networks: [network],
    configuration: { id, image },
  },
  container,
}: Props) {
  const { onOpenFolder, onOpenLogs, onOpenTerminal } = useContainerOperations(container);

  const operationItems = useMemo(
    () => [
      {
        label: 'Logs',
        icon: BookCopy,
        action: onOpenLogs,
      },
      {
        label: 'Terminal',
        icon: Terminal,
        action: onOpenTerminal,
      },
      {
        label: 'Files',
        icon: FileText,
        action: onOpenFolder,
      },
    ],
    [onOpenFolder, onOpenLogs, onOpenTerminal],
  );

  console.log(container);

  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mt-2">
        <DetailRow label="ID" copyable>
          {id}
        </DetailRow>
        <DetailRow label="Status">
          <div className="flex flex-row items-center justify-start gap-2">
            <ContainerStatusIndicator status={status} className="mt-0.5" />
            <p>{status}</p>
          </div>
        </DetailRow>
        <DetailRow label="Image" copyable>
          {image.reference}
        </DetailRow>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {operationItems.map(({ label, icon: Icon, action }) => (
          <Button
            key={label}
            className="justify-between"
            startContent={<Icon className="h-5 w-5" />}
            endContent={<ChevronRight className="ml-auto h-5 w-5 text-gray-400" />}
            onPress={action}
          >
            {label}
          </Button>
        ))}
      </div>

      {network ? (
        <>
          <h3 className="mt-6 text-lg font-semibold">Network</h3>
          <div className="mt-2">
            <DetailRow label="Address" copyable>
              {network.address.split('/')[0]}
            </DetailRow>
            <DetailRow label="Hostname" copyable>
              {network.hostname}
            </DetailRow>
            <DetailRow label="Gateway" copyable>
              {network.gateway}
            </DetailRow>
            <DetailRow label="Network" copyable>
              {network.network}
            </DetailRow>
          </div>
        </>
      ) : null}

      {/* <div className="flex-1">
        <h3 className="text-lg font-semibold">Mounts</h3>
        <div className="mt-2 flex flex-col gap-1">
          {mounts.map((mount, i) => (
            <span key={i} className="truncate font-mono text-sm text-blue-600 dark:text-blue-400">
              {mount.destination}
            </span>
          ))}
        </div>
      </div> */}
    </div>
  );
}
