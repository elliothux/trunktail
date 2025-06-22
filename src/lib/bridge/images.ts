import { invokeBridge } from '@/lib/bridge/utils';

export interface ImageInfo {
  reference: string;
  digest: string;
  schemaVersion: number;
  mediaType: string;
  descriptors: ImageDescriptor[];
}

export interface ImageDescriptor {
  descriptor: OCIDescriptor;
  config: OCIImage;
  manifest: OCIManifest;
}

export interface OCIDescriptor {
  platform: Platform;
  digest: string;
  mediaType: string;
  size: number;
  annotations?: OCIAnnotations;
}

export interface OCIManifest {
  schemaVersion: number;
  config: {
    size: number;
    digest: string;
    mediaType: string;
  };
  mediaType: string;
  layers: {
    size: number;
    digest: string;
    mediaType: string;
  }[];
  annotations?: OCIAnnotations;
}

export interface OCIImage {
  rootfs: {
    type: string;
    diff_ids: string[];
  };
  config: OCIImageConfig;
  os: string;
  architecture: string;
  variant?: string;
  history?: OCIImageHistory[];
  created?: string;
}

export interface OCIImageConfig {
  Labels?: OCIAnnotations;
  Cmd?: string[];
  Entrypoint?: string[];
  WorkingDir?: string;
  Env?: string[];
  StopSignal?: string;
}

export interface OCIImageHistory {
  comment: string;
  created: string;
  created_by: string;
  empty_layer?: boolean;
}

export type OCIAnnotations = {
  maintainer?: string;
  'org.opencontainers.image.version': string;
  'org.opencontainers.image.url': string;
  'org.opencontainers.image.base.digest': string;
  'org.opencontainers.image.source': string;
  'org.opencontainers.image.revision': string;
  'com.docker.official-images.bashbrew.arch': string;
  'org.opencontainers.image.base.name': string;
  'org.opencontainers.image.created': string;
  'org.opencontainers.image.title'?: string;
  'org.opencontainers.image.description'?: string;
  'org.opencontainers.image.licenses'?: string;
} & Record<string, string>;

export interface Platform {
  variant?: string;
  architecture: string;
  os: string;
}

export function listImages() {
  return invokeBridge<ImageInfo[]>('list_images');
}
