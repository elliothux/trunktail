import { invoke } from '@tauri-apps/api/core';

interface BridgeInvokeResponse<T> {
  code: number;
  t: number;
  message?: string;
  data?: T;
}

export async function invokeBridge<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const result = await invoke(command, args);
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
