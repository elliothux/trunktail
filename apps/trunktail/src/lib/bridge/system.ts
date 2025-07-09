import { invoke } from '@tauri-apps/api/core';

export enum SystemStatus {
  Running = 'running',
  NotRunning = 'not_running',
  NotRegistered = 'not_registered',
}

export async function systemStatus(): Promise<SystemStatus> {
  try {
    const status = await invoke<SystemStatus>('system_status');
    return status;
  } catch (error) {
    console.error('Failed to get system status:', error);
    return SystemStatus.NotRunning;
  }
}
