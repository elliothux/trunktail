import { Button } from '@heroui/button';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { FileRouteTypes, Link, useLocation } from '@tanstack/react-router';
import { Command, FileArchive, Package } from 'lucide-react';
import { ComponentProps, ComponentType } from 'react';
import { Logo } from './logo';
import { SystemInfo } from './system-info';

const menus: {
  label: string;
  icon: ComponentType<ComponentProps<'svg'>>;
  to: FileRouteTypes['to'];
}[] = [
  { label: 'Containers', icon: Package, to: '/containers' },
  // { label: 'Volumes', icon: HardDrive, to: '/volumes' },
  { label: 'Images', icon: FileArchive, to: '/images' },
  // { label: 'Pods', icon: Server, to: '/pods' },
  // { label: 'Services', icon: Server, to: '/services' },
  // { label: 'Machines', icon: Monitor, to: '/machines' },
  // { label: 'Monitor', icon: Activity, to: '/monitor' },
  { label: 'Commands', icon: Command, to: '/commands' },
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
        className="flex h-14 items-center border-b border-gray-800 px-4 text-lg font-bold tracking-wide"
        data-tauri-drag-region
      >
        <Logo className="pointer-events-none mt-4 w-20 select-none" />
      </div>
      <ScrollShadow as="nav" className="flex flex-1 shrink grow flex-col items-stretch justify-start gap-0.5 p-2.5">
        {menus.map(({ label, icon: Icon, to }) => {
          const isActive = pathname === to;
          const icon = <Icon className="h-5 w-5" />;
          return (
            <Button
              key={label}
              startContent={collapsed ? null : icon}
              as={Link}
              to={to}
              variant={isActive ? 'solid' : 'light'}
              className={collapsed ? 'w-full' : 'justify-start'}
              isIconOnly={collapsed}
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
