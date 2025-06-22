import { Portal } from '@/components/portal';
import { createFileRoute } from '@tanstack/react-router';
import {
  Bug,
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  Folder,
  Link2,
  Monitor,
  Server,
  Terminal,
  Trash2,
  UserCircle,
} from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/containers/')({
  component: ContainersPage,
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

function ContainersPage() {
  const [selected, setSelected] = useState({ group: 0, child: 0 });
  const group = dockerGroups[selected.group];
  const item = group.children[selected.child];

  return (
    <>
      <Portal name="title">
        <p>Containers</p>
        <p className="text-xs font-normal text-gray-400">2 running</p>
      </Portal>

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

      <Portal name="right-panel-title">Info</Portal>
      <Portal name="right-panel">
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
      </Portal>
    </>
  );
}
