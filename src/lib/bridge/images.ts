import { invokeBridge, parseImageReference } from '@/lib/bridge/utils';

export interface ImageInfo {
  references: string[];
  digest: string;
  schemaVersion: number;
  mediaType: string;
  descriptors: ImageDescriptor[];
  parsedReferences: ImageReference[];
}

export interface ImageReference {
  registry: string;
  org?: string;
  repo?: string;
  name: string;
  tag: string;
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

export async function listImages() {
  const images = await invokeBridge<ImageInfo[]>('list_images');
  return images
    .sort((a, b) => {
      const aCreated = a.descriptors[0]?.config?.created;
      const bCreated = b.descriptors[0]?.config?.created;
      return new Date(bCreated || 0).getTime() - new Date(aCreated || 0).getTime();
    })
    .map((image) => ({
      ...image,
      parsedReferences: image.references.map(parseImageReference),
    }));
}

interface SaveImageParams {
  reference: string;
  output: string;
  platform?: Platform;
}

export function saveImage({ platform, ...params }: SaveImageParams) {
  return invokeBridge<ImageInfo>('save_image', {
    ...params,
    // os/arch(/variant)
    platform: platform ? [platform.os, platform.architecture, platform.variant].filter(Boolean).join('/') : undefined,
  });
}

export function loadImage(input: string) {
  return invokeBridge<ImageInfo>('load_image', { input });
}

export function pruneImage() {
  return invokeBridge<ImageInfo[]>('prune_image');
}

interface TagImageParams {
  source: string;
  target: string;
}

export function tagImage(params: TagImageParams) {
  return invokeBridge<ImageInfo>('tag_image', params);
}
