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
      <GripVertical className="absolute top-1/2 -left-2.5 text-gray-200" size={20} />
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
      className="relative flex flex-col border-r border-neutral-700"
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
    <div className="relative h-screen w-full">
      <div className="dark w-ful absolute top-0 right-0 z-0 h-full bg-black/75">
        <img src="/bg.png" className="rounded-large relative z-10 -translate-x-1/2 opacity-50" alt="bg" />
      </div>

      <PanelGroup direction="horizontal" className="relative flex w-full" autoSaveId="main-panel-group">
        <NavPanel />
        <ResizeHandle />
        {status === SystemStatus.Running ? (
          <>
            <Panel className="flex flex-1 flex-col">
              <PortalRoot
                name="title"
                className="flex h-14 flex-col items-start justify-center border-b border-neutral-700 px-6 text-lg font-semibold text-gray-300"
                data-tauri-drag-region
              />
              <ScrollShadow className="flex-1 px-2 py-4">
                <Outlet />
              </ScrollShadow>
            </Panel>
            <ResizeHandle />
            <Panel className="flex h-full w-full flex-col border-l border-neutral-700" minSize={22} maxSize={40}>
              <PortalRoot
                name="right-panel-title"
                className="flex h-14 items-center border-b border-neutral-700 px-4 text-lg font-bold tracking-wide text-gray-300"
                data-tauri-drag-region
              />
              <PortalRoot name="right-panel" className="flex-1 overflow-x-hidden overflow-y-auto p-4" />
              <div
                className="flex h-12 cursor-pointer items-center gap-2 border-t border-neutral-700 px-4 text-xs text-gray-400 hover:text-white"
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
          <Panel className="flex flex-1 flex-col">
            <StartScreen />
          </Panel>
        )}
      </PanelGroup>
    </div>
  );
}
