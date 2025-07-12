import { cn } from '@/lib/utils';
import { Button } from '@heroui/button';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { FileRouteTypes, Link, useLocation } from '@tanstack/react-router';
import { openUrl } from '@tauri-apps/plugin-opener';
import { Command, Component, FileArchive, Package } from 'lucide-react';
import { ComponentProps, ComponentType } from 'react';
import { Logo } from './logo';
import { SystemInfo } from './system-info';

const menus: {
  label: string;
  icon: ComponentType<ComponentProps<'svg'>>;
  to?: FileRouteTypes['to'];
  externalLink?: string;
}[] = [
  { label: 'Containers', icon: Package, to: '/containers' },
  // { label: 'Volumes', icon: HardDrive, to: '/volumes' },
  { label: 'Images', icon: FileArchive, to: '/images' },
  // { label: 'Pods', icon: Server, to: '/pods' },
  // { label: 'Services', icon: Server, to: '/services' },
  // { label: 'Machines', icon: Monitor, to: '/machines' },
  // { label: 'Monitor', icon: Activity, to: '/monitor' },
  { label: 'Commands', icon: Command, to: '/commands' },
  {
    label: 'MCP Server',
    icon: Component,
    externalLink: 'https://github.com/elliothux/trunktail/tree/main/packages/mcp-server',
  },
];

interface Props {
  width: number;
  collapsed: boolean;
}

export function Nav({ width, collapsed }: Props) {
  const { pathname } = useLocation();

  return (
    <>
      <div
        className="flex h-14 items-center border-b border-neutral-700 px-4 text-lg font-bold tracking-wide"
        data-tauri-drag-region
      >
        <Logo className="pointer-events-none mt-4 w-20 select-none" />
      </div>
      <ScrollShadow as="nav" className="flex flex-1 shrink grow flex-col items-stretch justify-start gap-0.5 p-2.5">
        {menus.map(({ label, icon: Icon, to, externalLink }) => {
          const isActive = pathname === to;
          const icon = <Icon className="h-5 w-5" />;
          return (
            <Button
              key={label}
              startContent={collapsed ? null : icon}
              as={to != null ? Link : undefined}
              to={to}
              variant={isActive ? 'solid' : 'light'}
              color={isActive ? 'primary' : 'default'}
              className={cn('text-gray-100', collapsed ? 'w-full' : 'justify-start')}
              isIconOnly={collapsed}
              onPress={() => {
                if (externalLink != null) {
                  void openUrl(externalLink);
                }
              }}
            >
              {collapsed ? icon : label}
            </Button>
          );
        })}
      </ScrollShadow>
      <SystemInfo compact={width <= 170} collapsed={collapsed} />
    </>
  );
}
