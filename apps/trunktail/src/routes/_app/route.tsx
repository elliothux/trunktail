import { Nav } from '@/components/nav';
import { PortalRoot } from '@/components/portal';
import { Providers } from '@/components/providers';
import { StartScreen } from '@/components/start-screen';
import { useContainerSystem } from '@/components/system-context';
import { SystemStatus } from '@/lib/bridge/system';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { openUrl } from '@tauri-apps/plugin-opener';
import { ExternalLink, Github, GripVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useLocalStorage } from 'usehooks-ts';

export const Route = createFileRoute('/_app')({
  component: () => (
    <Providers>
      <App />
    </Providers>
  ),
});

function ResizeHandle() {
  return (
    <PanelResizeHandle className="relative">
      <GripVertical className="absolute top-1/2 -left-2.5" size={20} />
    </PanelResizeHandle>
  );
}

const minWidth = 156;
const maxWidth = 256;
const collapsedWidth = 64;

function NavPanel() {
  const [size, setSize] = useLocalStorage('nav-panel-size', 20);
  const [collapsed, setCollapsed] = useState(size <= 5);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  const width = (size / 100) * windowWidth;
  const minSize = Math.ceil((minWidth / windowWidth) * 100);
  const maxSize = Math.ceil((maxWidth / windowWidth) * 100);
  const collapsedSize = Math.ceil((collapsedWidth / windowWidth) * 100);

  return (
    <Panel
      className="flex flex-col border-r"
      maxSize={maxSize}
      minSize={minSize}
      collapsedSize={collapsedSize}
      defaultSize={size}
      onResize={setSize}
      onCollapse={() => setCollapsed(true)}
      onExpand={() => setCollapsed(false)}
      collapsible
    >
      <Nav width={width} collapsed={collapsed} />
    </Panel>
  );
}

function App() {
  const { status } = useContainerSystem();

  return (
    <div className="h-screen">
      <PanelGroup
        direction="horizontal"
        className="flex w-full border-gray-400 dark:border-gray-800"
        autoSaveId="main-panel-group"
      >
        <NavPanel />
        <ResizeHandle />
        {status === SystemStatus.Running ? (
          <>
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
            <Panel className="flex h-full w-full flex-col border-l" minSize={22} maxSize={40}>
              <PortalRoot
                name="right-panel-title"
                className="flex h-14 items-center border-b border-gray-800 px-4 text-lg font-bold tracking-wide"
                data-tauri-drag-region
              />
              <PortalRoot name="right-panel" className="flex-1 overflow-x-hidden overflow-y-auto p-4" />
              <div
                className="flex h-12 cursor-pointer items-center gap-2 border-t border-gray-800 px-4 text-xs text-gray-400 hover:text-gray-800"
                onClick={() => {
                  openUrl('https://github.com/elliothux/trunktail');
                }}
              >
                <Github size={16} />
                <span>Github</span>
                <ExternalLink size={16} className="ml-auto" />
              </div>
            </Panel>
          </>
        ) : (
          <Panel className="flex flex-1 flex-col bg-gray-50">
            <StartScreen />
          </Panel>
        )}
      </PanelGroup>
    </div>
  );
}
