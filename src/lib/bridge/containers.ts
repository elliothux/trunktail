import { Platform } from '@/lib/bridge/images';
import { invokeBridge } from '@/lib/bridge/utils';

export interface ContainerInfo {
  status: ContainerStatus;
  networks: ContainerNetwork[];
  configuration: ContainerConfig;
}

export interface ContainerConfig {
  networks: string[];
  mounts: ContainerFileSystem[];
  runtimeHandler: string;
  hostname: string;
  rosetta: boolean;
  platform: Platform;
  id: string;
  resources: ContainerResources;
  image: ContainerImage;
  sysctls: Record<string, string>;
  initProcess: ContainerInitProcess;
  labels: Record<string, string>;
  dns: ContainerDNS;
}

export enum ContainerStatus {
  unknown = 'unknown',
  stopped = 'stopped',
  running = 'running',
}

export interface ContainerNetwork {
  hostname: string;
  gateway: string;
  address: string;
  network: string;
}

export interface ContainerResources {
  cpus: number;
  memoryInBytes: number;
}

export interface ContainerImage {
  reference: string;
  descriptor: {
    mediaType: string;
    size: number;
    digest: string;
  };
}

export interface ContainerInitProcess {
  supplementalGroups: number[];
  rlimits: {
    // Values include standard Rlimit resource types, i.e. RLIMIT_NPROC, RLIMIT_NOFILE, ...
    limit: String;
    soft: number;
    hard: number;
  }[];
  terminal: boolean;
  executable: string;
  environment: string[];
  user: {
    id: {
      uid: number;
      guid: number;
    };
  };
  workingDirectory: string;
  arguments: string[];
}

export interface ContainerDNS {
  domain?: string;
  options: string[];
  searchDomains: string[];
  nameservers: string[];
}

type FSType =
  | {
      block: {
        format: string;
        cache: 'on' | 'off' | 'auto';
        sync: 'full' | 'fsync' | 'nosync';
      };
    }
  | { virtiofs: Record<string, never> } // TODO: add virtiofs
  | { tmpfs: Record<string, never> }; // TODO: add tmpfs

export interface ContainerFileSystem {
  type: FSType;
  source: string;
  destination: string;
  options: string[];
}

export function listContainers() {
  return invokeBridge<ContainerInfo[]>('list_containers');
}
