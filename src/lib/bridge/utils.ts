import { invoke } from '@tauri-apps/api/core';
import { homeDir } from '@tauri-apps/api/path';
import { ImageDescriptor, ImageReference } from './images';

interface BridgeInvokeResponse<T> {
  code: number;
  t: number;
  message?: string;
  data?: T;
}

export async function invokeBridge<T>(command: string, args?: object): Promise<T> {
  const result = await invoke(
    command,
    args == null
      ? undefined
      : {
          params: JSON.stringify(args),
        },
  );
  if (typeof result !== 'string') {
    throw new Error(`Expected string response from bridge, got ${typeof result}`);
  }

  let response: BridgeInvokeResponse<T>;
  try {
    response = JSON.parse(result);
  } catch (e) {
    throw new Error(`Failed to parse bridge response: ${e instanceof Error ? e.message : String(e)}`);
  }

  if (response.code !== 0 || response.data === undefined) {
    throw new Error(
      `Bridge command "${command}" failed with code ${response.code}: ${response.message || 'Unknown error'}`,
    );
  }

  return response.data;
}

export async function getServicePath(path: string) {
  return `${await homeDir()}/Library/Application Support/com.apple.container${path}`;
}

export function parseImageReference(reference: string): ImageReference {
  const components = reference.split('/');
  if (components.length === 3) {
    // docker.io/library/postgres:latest
    const [name, tag] = components[2].split(':');
    return {
      registry: components[0],
      repo: components[1],
      name,
      tag,
    };
  } else if (components.length === 4) {
    // ghcr.io/apple/containerization/vminit:0.1.0
    const [name, tag] = components[3].split(':');
    return {
      registry: components[0],
      org: components[1],
      repo: components[2],
      name,
      tag,
    };
  }

  throw new Error(`Invalid reference: ${reference}`);
}

export function stringifyImageReference({ registry, org, repo, name, tag }: ImageReference): string {
  return [registry, org, repo, `${name}:${tag}`].filter(Boolean).join('/');
}

export function calcImageSize(descriptors: ImageDescriptor[]) {
  return descriptors.reduce(
    (acc, { descriptor, manifest }) =>
      acc + descriptor.size + manifest.config.size + manifest.layers.reduce((acc, layer) => acc + layer.size, 0),
    0,
  );
}
