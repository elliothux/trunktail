import { Nav } from '@/components/nav';
import { PortalRoot } from '@/components/portal';
import { Providers } from '@/components/providers';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { GripVertical } from 'lucide-react';
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
          className="flex w-full border-r-gray-400 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
          autoSaveId="main-panel-group"
        >
          <Panel className="flex flex-col border-r" minSize={4} maxSize={24}>
            <Nav />
          </Panel>
          <ResizeHandle />
          <Panel className="flex flex-1 flex-col">
            <Outlet />
          </Panel>
          <ResizeHandle />
          <Panel className="border-l" minSize={16} maxSize={36}>
            <PortalRoot name="right-panel" className="flex h-full w-full flex-col" />
          </Panel>
        </PanelGroup>
      </div>
    </Providers>
  );
}
