import { useContainerSystem } from './system-context';
import { SystemStatus } from '@/lib/bridge/system';
import { ContainerStatusIndicator } from './container-status-indicator';
import { ContainerStatus } from '@/lib/bridge/containers';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { Button } from '@heroui/button';
import { Ellipsis, Play, RotateCcw, Square, BookCopy, Info, Loader2 } from 'lucide-react';
import { useSystemOperations } from '@/hooks/use-system-operations';
import { openWebviewWindow } from '@/utils';

export function SystemInfo() {
  const { status } = useContainerSystem();
  const isRunning = status === SystemStatus.Running;
  return (
    <div className="flex items-center gap-2 border-t border-gray-800 px-3 h-12 text-xs text-gray-400">
      <ContainerStatusIndicator status={isRunning ? ContainerStatus.running : ContainerStatus.stopped} />
      <span className="pointer-events-none select-none">{isRunning ? 'System running' : 'System stopped'}</span>
      <SystemMenu />
    </div>
  );
}

function SystemMenu() {
  const { status } = useContainerSystem();
  const { start, isStarting, stop, isStopping, restart, isRestarting } = useSystemOperations();

  const isRunning = status === SystemStatus.Running;
  return (
    <Dropdown className="mt-auto" placement="right-end">
      <DropdownTrigger>
        <Button size="sm" className="ml-auto" variant="light" isIconOnly>
          <Ellipsis size={16} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions">
        <DropdownItem
          key="start"
          color={isRunning ? 'danger' : 'default'}
          variant={isRunning ? 'flat' : 'solid'}
          startContent={
            isStarting || isStopping ? (
              <Loader2 className="animate-spin" size={16} />
            ) : isRunning ? (
              <Square size={16} />
            ) : (
              <Play size={16} />
            )
          }
          onPress={() => {
            if (isStarting || isStopping || isRestarting) {
              return;
            }
            isRunning ? stop() : start();
          }}
        >
          {isRunning ? 'Stop server' : 'Start server'}
        </DropdownItem>
        <DropdownItem
          key="restart"
          startContent={isRestarting ? <Loader2 className="animate-spin" size={16} /> : <RotateCcw size={16} />}
          onPress={() => {
            if (isStarting || isStopping || isRestarting) {
              return;
            }
            restart();
          }}
        >
          Restart server
        </DropdownItem>
        <DropdownItem
          key="logs"
          startContent={<BookCopy size={16} />}
          onPress={() => {
            openWebviewWindow({
              url: `${window.location.origin}/system-logs`,
              viewId: 'system-logs',
              title: 'Container server logs',
            });
          }}
        >
          View logs
        </DropdownItem>
        <DropdownItem key="about" startContent={<Info size={16} />}>
          About trunktail
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
