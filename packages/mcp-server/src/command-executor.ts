import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import type { CommandResult } from './types.js';

const execAsync = promisify(exec);

export class CommandExecutor {
  private readonly containerPath: string;
  private readonly debug: boolean;

  constructor(containerPath: string = 'container', debug: boolean = false) {
    this.containerPath = containerPath;
    this.debug = debug;
  }

  /**
   * Execute a container CLI command and return structured result
   */
  async execute(
    args: string[],
    options: {
      timeout?: number;
      cwd?: string;
      env?: Record<string, string>;
      parseJson?: boolean;
    } = {},
  ): Promise<CommandResult> {
    const { timeout = 30000, cwd = process.cwd(), env = {}, parseJson = false } = options;

    const command = [this.containerPath, ...args].join(' ');

    if (this.debug) {
      console.log(`[CommandExecutor] Executing: ${command}`);
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout,
        cwd,
        env: { ...process.env, ...env },
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      });

      let data: any = undefined;
      if (parseJson && stdout.trim()) {
        try {
          data = JSON.parse(stdout);
        } catch (parseError) {
          console.warn('[CommandExecutor] Failed to parse JSON output:', parseError);
          // Continue with raw output
        }
      }

      return {
        success: true,
        output: stdout,
        error: stderr || undefined,
        exitCode: 0,
        data,
      };
    } catch (error: any) {
      if (this.debug) {
        console.error(`[CommandExecutor] Error executing command:`, error);
      }

      return {
        success: false,
        output: error.stdout || '',
        error: error.stderr || error.message || 'Unknown error',
        exitCode: error.code || 1,
      };
    }
  }

  /**
   * Execute a streaming command (useful for logs, build output, etc.)
   */
  async executeStreaming(
    args: string[],
    onData: (data: string, isError?: boolean) => void,
    options: {
      timeout?: number;
      cwd?: string;
      env?: Record<string, string>;
    } = {},
  ): Promise<CommandResult> {
    const {
      timeout = 0, // No timeout for streaming by default
      cwd = process.cwd(),
      env = {},
    } = options;

    return new Promise((resolve) => {
      let output = '';
      let errorOutput = '';

      const child = spawn(this.containerPath, args, {
        cwd,
        env: { ...process.env, ...env },
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let timeoutId: NodeJS.Timeout | null = null;
      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          child.kill('SIGTERM');
        }, timeout);
      }

      if (child.stdout) {
        child.stdout.on('data', (data: Buffer) => {
          const text = data.toString();
          output += text;
          onData(text, false);
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (data: Buffer) => {
          const text = data.toString();
          errorOutput += text;
          onData(text, true);
        });
      }

      child.on('close', (code) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        resolve({
          success: code === 0,
          output,
          error: errorOutput || undefined,
          exitCode: code || 0,
        });
      });

      child.on('error', (error) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        resolve({
          success: false,
          output,
          error: error.message,
          exitCode: 1,
        });
      });
    });
  }

  /**
   * Build command arguments from input object
   */
  buildArgs(baseCommand: string[], options: Record<string, any> = {}): string[] {
    const args = [...baseCommand];

    // Add flags and options
    for (const [key, value] of Object.entries(options)) {
      if (value === undefined || value === null) continue;

      const flag = this.camelToKebab(key);

      if (typeof value === 'boolean') {
        if (value) {
          args.push(`--${flag}`);
        }
      } else if (Array.isArray(value)) {
        for (const item of value) {
          args.push(`--${flag}`, String(item));
        }
      } else {
        args.push(`--${flag}`, String(value));
      }
    }

    return args;
  }

  /**
   * Convert camelCase to kebab-case for CLI flags
   */
  private camelToKebab(str: string): string {
    // Handle special cases
    const specialCases: Record<string, string> = {
      containerId: 'container-id',
      contextDir: 'context-dir',
      buildArgs: 'build-arg',
      noCache: 'no-cache',
      disableProgress: 'disable-progress-updates',
      passwordStdin: 'password-stdin',
    };

    if (specialCases[str]) {
      return specialCases[str];
    }

    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Validate container CLI is available
   */
  async validateCLI(): Promise<boolean> {
    try {
      const result = await this.execute(['--version']);
      return result.success;
    } catch {
      return false;
    }
  }

  /**
   * Parse container list output to structured data
   */
  parseContainerList(output: string): any[] {
    try {
      // Try to parse as JSON first
      return JSON.parse(output);
    } catch {
      // Parse table format
      const lines = output.trim().split('\n');
      if (lines.length <= 1) return [];

      const headerLine = lines[0];
      if (!headerLine) return [];

      const headers = headerLine.split(/\s{2,}/).map((h) => h.trim().toLowerCase());
      const containers = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const values = line.split(/\s{2,}/).map((v) => v.trim());
        const container: any = {};

        headers.forEach((header, index) => {
          if (values[index] !== undefined) {
            container[header] = values[index];
          }
        });

        containers.push(container);
      }

      return containers;
    }
  }

  /**
   * Parse image list output to structured data
   */
  parseImageList(output: string): any[] {
    try {
      return JSON.parse(output);
    } catch {
      const lines = output.trim().split('\n');
      if (lines.length <= 1) return [];

      const headerLine = lines[0];
      if (!headerLine) return [];

      const headers = headerLine.split(/\s{2,}/).map((h) => h.trim().toLowerCase());
      const images = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const values = line.split(/\s{2,}/).map((v) => v.trim());
        const image: any = {};

        headers.forEach((header, index) => {
          if (values[index] !== undefined) {
            image[header] = values[index];
          }
        });

        images.push(image);
      }

      return images;
    }
  }
}
