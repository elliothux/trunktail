import { Nav } from '@/components/nav';
import { PortalRoot } from '@/components/portal';
import { Providers } from '@/components/providers';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { GripVertical, LogOut } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export const Route = createRootRoute({
  component: App,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

function ResizeHandle() {
  return (
    <PanelResizeHandle className="relative">
      <GripVertical className="absolute top-1/2 -left-2.5" size={20} />
    </PanelResizeHandle>
  );
}

function App() {
  return (
    <Providers>
      <div className="h-screen">
        <PanelGroup
          direction="horizontal"
          className="flex w-full border-gray-400 dark:border-gray-800"
          autoSaveId="main-panel-group"
        >
          <Panel className="flex flex-col border-r" minSize={4} maxSize={24}>
            <Nav />
          </Panel>
          <ResizeHandle />
          <Panel className="flex flex-1 flex-col bg-gray-50">
            <PortalRoot
              name="title"
              className="flex h-14 flex-col items-start justify-center border-b px-6 text-lg font-semibold"
              data-tauri-drag-region
            />
            <ScrollShadow className="flex-1 px-2 py-4">
              <Outlet />
            </ScrollShadow>
          </Panel>
          <ResizeHandle />
          <Panel className="flex h-full w-full flex-col border-l" minSize={16} maxSize={36}>
            <PortalRoot
              name="right-panel-title"
              className="flex h-14 items-center border-b border-gray-800 px-4 text-lg font-bold tracking-wide"
              data-tauri-drag-region
            />
            <PortalRoot name="right-panel" className="flex-1 overflow-x-hidden overflow-y-auto p-4" />
            <div className="flex items-center gap-2 border-t border-gray-800 p-4 text-xs text-gray-400">
              <LogOut className="h-5 w-5" />
              <span>Personal use only</span>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </Providers>
  );
}
