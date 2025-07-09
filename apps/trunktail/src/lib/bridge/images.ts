import { invokeBridge, parseImageReference } from '@/lib/bridge/utils';

export interface ImageInfo {
  references: string[];
  digest: string;
  schemaVersion: number;
  mediaType: string;
  descriptors: ImageDescriptor[];
  isInfra: boolean;
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

function handleImage(image: ImageInfo): ImageInfo {
  const refs = image.references.map(parseImageReference).sort((a, b) => a.tag.localeCompare(b.tag));
  image.parsedReferences = refs;
  image.isInfra = refs[0].org === 'apple' && refs[0].name === 'vminit';
  return image;
}

export async function listImages() {
  const images = await invokeBridge<ImageInfo[]>('list_images');
  return images
    .sort((a, b) => {
      const aCreated = a.descriptors[0]?.config?.created;
      const bCreated = b.descriptors[0]?.config?.created;
      return new Date(bCreated || 0).getTime() - new Date(aCreated || 0).getTime();
    })
    .map(handleImage);
}

interface SaveImageParams {
  reference: string;
  output: string;
  platform?: Platform;
}

export async function saveImage({ platform, ...params }: SaveImageParams) {
  const image = await invokeBridge<ImageInfo>('save_image', {
    ...params,
    // os/arch(/variant)
    platform: platform ? [platform.os, platform.architecture, platform.variant].filter(Boolean).join('/') : undefined,
  });
  return handleImage(image);
}

export async function loadImage(input: string) {
  const image = await invokeBridge<ImageInfo>('load_image', { input });
  return handleImage(image);
}

export async function pruneImages() {
  const images = await invokeBridge<ImageInfo[]>('prune_images');
  return images.map(handleImage);
}

interface TagImageParams {
  source: string;
  target: string;
}

export async function tagImage(params: TagImageParams) {
  const image = await invokeBridge<ImageInfo>('tag_image', params);
  return handleImage(image);
}

export async function deleteImages(references: string[]) {
  const deleted = await invokeBridge<ImageInfo[]>('delete_images', { references });
  return deleted.map(handleImage);
}
