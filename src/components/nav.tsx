import { Button } from '@heroui/button';
import { FileRouteTypes, Link, useLocation } from '@tanstack/react-router';
import { Activity, Boxes, Command, FileText, HardDrive, Monitor, Server, UserCircle } from 'lucide-react';
import { ComponentProps, ComponentType } from 'react';

const menus: {
  label: string;
  icon: ComponentType<ComponentProps<'svg'>>;
  to: FileRouteTypes['to'];
}[] = [
  { label: 'Containers', icon: Boxes, to: '/containers' },
  { label: 'Volumes', icon: HardDrive, to: '/volumes' },
  { label: 'Images', icon: FileText, to: '/images' },
  { label: 'Pods', icon: Server, to: '/pods' },
  { label: 'Services', icon: Server, to: '/services' },
  { label: 'Machines', icon: Monitor, to: '/machines' },
  { label: 'Monitor', icon: Activity, to: '/monitor' },
  { label: 'Commands', icon: Command, to: '/commands' },
];

export function Nav() {
  const { pathname } = useLocation();
  console.log('pathname', pathname);

  return (
    <>
      <div
        className="flex h-14 items-center border-b border-gray-800 px-4 text-lg font-bold tracking-wide"
        data-tauri-drag-region
      >
        Dashboard
      </div>
      <nav className="grid grid-cols-1 gap-0.5 p-2.5">
        {menus.map(({ label, icon: Icon, to }) => {
          const isActive = pathname === to;
          return (
            <Button
              key={label}
              startContent={<Icon className="h-5 w-5" />}
              as={Link}
              to={to}
              variant={isActive ? 'solid' : 'light'}
              className="justify-start"
            >
              {label}
            </Button>
          );
        })}
      </nav>
      <div className="mt-auto flex items-center gap-2 border-t border-gray-800 p-4 text-xs text-gray-400">
        <UserCircle className="h-6 w-6" /> elliot@coca...
      </div>
    </>
  );
}
