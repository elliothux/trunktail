import { useSystemOperations } from '@/hooks/use-system-operations';
import { ContainerStatus } from '@/lib/bridge/containers';
import { SystemStatus } from '@/lib/bridge/system';
import { cn } from '@/lib/utils';
import { openWebviewWindow } from '@/utils';
import { Button } from '@heroui/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';
import { useDisclosure } from '@heroui/modal';
import { BookCopy, Ellipsis, Info, Loader2, Play, RotateCcw, Square } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { About } from './about';
import { ContainerStatusIndicator } from './container-status-indicator';
import { useContainerSystem } from './system-context';

export function SystemInfo({ compact, collapsed }: { compact: boolean; collapsed: boolean }) {
  const { status } = useContainerSystem();
  const isRunning = status === SystemStatus.Running;

  const indicator = (
    <>
      <ContainerStatusIndicator status={isRunning ? ContainerStatus.running : ContainerStatus.stopped} />
      <span className={cn('pointer-events-none select-none', compact ? 'capitalize' : null)}>
        {compact ? '' : 'System '}
        {isRunning ? 'running' : ' stopped'}
      </span>
    </>
  );

  return (
    <div className="flex h-12 items-center gap-2 border-t border-gray-600 px-3 text-xs text-gray-400">
      {collapsed ? null : indicator}
      <SystemMenu triggerClassName={collapsed ? 'w-full' : undefined}>{compact ? indicator : null}</SystemMenu>
    </div>
  );
}

function SystemMenu({ triggerClassName, children }: PropsWithChildren<{ triggerClassName?: string }>) {
  const { status, command } = useContainerSystem();
  const { start, isStarting, stop, isStopping, restart, isRestarting } = useSystemOperations();

  const aboutDisclosure = useDisclosure();

  const isRunning = status === SystemStatus.Running;

  return (
    <>
      <Dropdown className="mt-auto" placement="right-end" isDisabled={command === 'unknown'}>
        <DropdownTrigger>
          <Button size="sm" className={cn('ml-auto text-gray-300', triggerClassName)} variant="light" isIconOnly>
            <Ellipsis size={16} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dynamic Actions"
          disabledKeys={[
            'custom',
            isRunning ? '' : 'restart',
            isRestarting ? 'restart' : '',
            isStarting || isStopping || isRestarting ? 'start' : '',
          ]}
        >
          {children != null ? (
            <DropdownItem
              key="custom"
              className="opacity-100"
              classNames={{
                title: 'flex flex-row items-center justify-start gap-[11px] pl-1',
              }}
            >
              {children}
            </DropdownItem>
          ) : null}
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
          <DropdownItem key="about" startContent={<Info size={16} />} onPress={aboutDisclosure.onOpen}>
            About trunktail
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <About disclosure={aboutDisclosure} />
    </>
  );
}
