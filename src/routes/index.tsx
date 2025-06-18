import { createFileRoute } from '@tanstack/react-router';
import { invoke } from '@tauri-apps/api/core';
import {
  Activity,
  Boxes,
  Bug,
  ChevronDown,
  ChevronRight,
  Command,
  Database,
  FileText,
  Folder,
  HardDrive,
  Link2,
  LogOut,
  Monitor,
  Server,
  Terminal,
  Trash2,
  UserCircle,
} from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: Home,
});

const dockerGroups = [
  {
    label: 'spot-ingestor',
    running: true,
    children: [
      {
        name: 'cache',
        image: 'redis:7-alpine',
        icon: <Database className="h-4 w-4 text-cyan-400" />,
        status: 'running',
      },
      {
        name: 'db',
        image: 'timescale/timescaledb-ha:pg17',
        icon: <Database className="h-4 w-4 text-purple-400" />,
        status: 'running',
      },
    ],
  },
  {
    label: 'farming',
    running: false,
    children: [
      {
        name: 'supabase_db_farming',
        image: 'public.ecr.aws/supabase/postgres:15.6.1.139',
        icon: <Database className="h-4 w-4 text-blue-400" />,
        status: 'stopped',
      },
      {
        name: 'supabase_kong_farming',
        image: 'public.ecr.aws/supabase/kong:2.8.1',
        icon: <Server className="h-4 w-4 text-green-400" />,
        status: 'stopped',
      },
      {
        name: 'supabase_pg_meta_farming',
        image: 'public.ecr.aws/supabase/postgres-meta:v0.84.2',
        icon: <Database className="h-4 w-4 text-gray-400" />,
        status: 'stopped',
      },
      {
        name: 'supabase_studio_farming',
        image: 'public.ecr.aws/supabase/studio:20241202-71e5240',
        icon: <Monitor className="h-4 w-4 text-blue-300" />,
        status: 'stopped',
      },
    ],
  },
  {
    label: 'predict',
    running: false,
    children: [
      {
        name: 'supabase_auth_predict',
        image: 'public.ecr.aws/supabase/gotrue:v2.164.0',
        icon: <UserCircle className="h-4 w-4 text-indigo-400" />,
        status: 'stopped',
      },
      {
        name: 'supabase_db_predict',
        image: 'public.ecr.aws/supabase/postgres:15.6.1.139',
        icon: <Database className="h-4 w-4 text-blue-400" />,
        status: 'stopped',
      },
    ],
  },
];

const leftMenu = [
  { label: 'Containers', icon: <Boxes className="h-5 w-5" />, active: true },
  { label: 'Volumes', icon: <HardDrive className="h-5 w-5" /> },
  { label: 'Images', icon: <FileText className="h-5 w-5" /> },
  { label: 'Pods', icon: <Server className="h-5 w-5" /> },
  { label: 'Services', icon: <Server className="h-5 w-5" /> },
  { label: 'Machines', icon: <Monitor className="h-5 w-5" /> },
  { label: 'Activity Monitor', icon: <Activity className="h-5 w-5" /> },
  { label: 'Commands', icon: <Command className="h-5 w-5" /> },
];

function Home() {
  const [selected, setSelected] = useState({ group: 0, child: 0 });
  const group = dockerGroups[selected.group];
  const item = group.children[selected.child];

  return (
    <div className="flex h-[100vh] w-full bg-gray-900 text-gray-100">
      {/* 左侧菜单栏 */}
      <aside className="flex w-56 flex-col border-r border-gray-800 bg-gray-950">
        <div
          className="flex h-14 items-center border-b border-gray-800 px-4 text-lg font-bold tracking-wide"
          data-tauri-drag-region
        >
          <span className="mr-2">{leftMenu[0].icon}</span> Containers
        </div>
        <nav className="flex-1 py-2">
          {leftMenu.map((item, i) => (
            <div
              key={item.label}
              className={`flex cursor-pointer items-center gap-3 rounded px-4 py-2 transition hover:bg-gray-800 ${item.active ? 'bg-gray-800 font-semibold' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div
          className="flex items-center gap-2 border-t border-gray-800 p-4 text-xs text-gray-400"
          onClick={() => {
            void ping();
          }}
        >
          <UserCircle className="h-6 w-6" /> elliot@coca...
        </div>
      </aside>

      {/* 中间内容区 */}
      <main className="flex flex-1 flex-col bg-gray-900">
        <div
          className="flex h-14 items-center border-b border-gray-800 px-6 text-lg font-semibold"
          data-tauri-drag-region
        >
          Containers <span className="ml-2 text-xs font-normal text-gray-400">2 running</span>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {dockerGroups.map((group, gi) => (
            <div key={group.label} className="mb-2">
              <div className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-300">
                {group.children.length > 0 ? (
                  gi === selected.group ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                ) : null}
                <span>{group.label}</span>
              </div>
              <div className="ml-6">
                {group.children.map((child, ci) => (
                  <div
                    key={child.name}
                    className={`flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-gray-800 ${gi === selected.group && ci === selected.child ? 'bg-gray-800' : ''}`}
                    onClick={() => setSelected({ group: gi, child: ci })}
                  >
                    <div className="flex items-center gap-2">
                      {child.icon}
                      <div>
                        <div className="text-sm font-medium">{child.name}</div>
                        <div className="text-xs text-gray-400">{child.image}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-gray-500 hover:text-blue-400" />
                      <Folder className="h-4 w-4 text-gray-500 hover:text-blue-400" />
                      <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 右侧详情区 */}
      <aside className="flex w-80 flex-col border-l border-gray-800 bg-gray-950">
        <div
          className="flex h-14 items-center border-b border-gray-800 px-4 text-lg font-bold tracking-wide"
          data-tauri-drag-region
        >
          Info
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <div className="text-xs text-gray-400">ID</div>
            <div className="font-mono text-sm">c39ef046811a</div>
          </div>
          <div className="mb-4">
            <div className="text-xs text-gray-400">Status</div>
            <div className="text-sm text-green-400">Up 49 seconds</div>
          </div>
          <div className="mb-4">
            <div className="text-xs text-gray-400">Image</div>
            <div className="text-sm">redis:7-alpine</div>
          </div>
          <div className="mb-4">
            <div className="text-xs text-gray-400">Domain</div>
            <a href="#" className="text-sm text-blue-400 hover:underline">
              cache.spot-ingestor.org...
            </a>
          </div>
          <div className="mb-4">
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 rounded bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700">
                <FileText className="h-4 w-4" /> Logs
              </button>
              <button className="flex items-center gap-2 rounded bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700">
                <Bug className="h-4 w-4" /> Debug
              </button>
              <button className="flex items-center gap-2 rounded bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700">
                <Terminal className="h-4 w-4" /> Terminal
              </button>
              <button className="flex items-center gap-2 rounded bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700">
                <Folder className="h-4 w-4" /> Files
              </button>
            </div>
          </div>
          <div className="mb-4">
            <div className="text-xs text-gray-400">Ports</div>
            <a href="#" className="text-sm text-blue-400 hover:underline">
              6379
            </a>
          </div>
          <div className="mb-4">
            <div className="text-xs text-gray-400">Mounts</div>
            <a href="#" className="text-sm text-blue-400 hover:underline">
              /data
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-gray-800 p-4 text-xs text-gray-400">
          <LogOut className="h-5 w-5" /> Personal use only
        </div>
      </aside>
    </div>
  );
}

async function ping() {
  try {
    const result = await invoke<string>('ping_async');
    console.log('Result from Rust:', result);
    return result;
  } catch (error) {
    console.error('Failed to call ping_async:', error);
  }
}
