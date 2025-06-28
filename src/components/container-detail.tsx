import { ContainerInfo } from '@/lib/bridge/containers';
import { Button } from '@heroui/button';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { BookCopy, Bug, ChevronRight, FileText, Terminal } from 'lucide-react';
import { useCallback } from 'react';
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
  const onViewLogs = useCallback(async () => {
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

  const operationItems = [
    { label: 'Logs', icon: BookCopy, action: onViewLogs },
    { label: 'Debug', icon: Bug },
    { label: 'Terminal', icon: Terminal },
    { label: 'Files', icon: FileText },
  ];

  console.log(container);

  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mt-2">
        <DetailRow label="ID" copyable>
          {id}
        </DetailRow>
        <DetailRow label="Status">{status}</DetailRow>
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
