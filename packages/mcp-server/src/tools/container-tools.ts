import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { CommandExecutor } from '../command-executor.js';
import {
  ContainerCreateInputSchema,
  ContainerListInputSchema,
  ContainerOperationInputSchema,
  type CommandResult,
  type ContainerCreateInput,
} from '../types.js';

export class ContainerTools {
  constructor(private executor: CommandExecutor) {}

  /**
   * Get all container-related MCP tools
   */
  getTools(): Tool[] {
    return [
      this.getContainerCreateTool(),
      this.getContainerRunTool(),
      this.getContainerListTool(),
      this.getContainerStartTool(),
      this.getContainerStopTool(),
      this.getContainerKillTool(),
      this.getContainerDeleteTool(),
      this.getContainerExecTool(),
      this.getContainerLogsTool(),
      this.getContainerInspectTool(),
    ];
  }

  /**
   * Handle container tool execution
   */
  async handleTool(name: string, args: any): Promise<CommandResult> {
    switch (name) {
      case 'container_create':
        return this.handleContainerCreate(args);
      case 'container_run':
        return this.handleContainerRun(args);
      case 'container_list':
        return this.handleContainerList(args);
      case 'container_start':
        return this.handleContainerStart(args);
      case 'container_stop':
        return this.handleContainerStop(args);
      case 'container_kill':
        return this.handleContainerKill(args);
      case 'container_delete':
        return this.handleContainerDelete(args);
      case 'container_exec':
        return this.handleContainerExec(args);
      case 'container_logs':
        return this.handleContainerLogs(args);
      case 'container_inspect':
        return this.handleContainerInspect(args);
      default:
        throw new Error(`Unknown container tool: ${name}`);
    }
  }

  private getContainerCreateTool(): Tool {
    return {
      name: 'container_create',
      description: 'Create a new container without starting it',
      inputSchema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            description: 'Container image name and tag',
          },
          name: {
            type: 'string',
            description: 'Container name (optional)',
          },
          workdir: {
            type: 'string',
            description: 'Working directory in the container',
          },
          env: {
            type: 'array',
            items: { type: 'string' },
            description: 'Environment variables in KEY=VALUE format',
          },
          volumes: {
            type: 'array',
            items: { type: 'string' },
            description: 'Volume mounts in host:container format',
          },
          ports: {
            type: 'array',
            items: { type: 'string' },
            description: 'Port mappings in host:container format',
          },
          interactive: {
            type: 'boolean',
            description: 'Keep STDIN open',
          },
          tty: {
            type: 'boolean',
            description: 'Allocate a pseudo-TTY',
          },
          remove: {
            type: 'boolean',
            description: 'Remove container after it stops',
          },
          cpus: {
            type: 'string',
            description: 'Number of CPUs to allocate',
          },
          memory: {
            type: 'string',
            description: 'Memory limit (e.g., 512M, 2G)',
          },
          entrypoint: {
            type: 'string',
            description: 'Override the default entrypoint',
          },
          network: {
            type: 'string',
            description: 'Network to attach the container to',
          },
          labels: {
            type: 'array',
            items: { type: 'string' },
            description: 'Labels in KEY=VALUE format',
          },
          arguments: {
            type: 'array',
            items: { type: 'string' },
            description: 'Command arguments to pass to the container',
          },
        },
        required: ['image'],
      },
    };
  }

  private getContainerRunTool(): Tool {
    return {
      name: 'container_run',
      description: 'Create and start a new container in one command',
      inputSchema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            description: 'Container image name and tag',
          },
          name: {
            type: 'string',
            description: 'Container name (optional)',
          },
          workdir: {
            type: 'string',
            description: 'Working directory in the container',
          },
          env: {
            type: 'array',
            items: { type: 'string' },
            description: 'Environment variables in KEY=VALUE format',
          },
          volumes: {
            type: 'array',
            items: { type: 'string' },
            description: 'Volume mounts in host:container format',
          },
          ports: {
            type: 'array',
            items: { type: 'string' },
            description: 'Port mappings in host:container format',
          },
          interactive: {
            type: 'boolean',
            description: 'Keep STDIN open',
          },
          tty: {
            type: 'boolean',
            description: 'Allocate a pseudo-TTY',
          },
          detach: {
            type: 'boolean',
            description: 'Run container in the background',
          },
          remove: {
            type: 'boolean',
            description: 'Remove container after it stops',
          },
          cpus: {
            type: 'string',
            description: 'Number of CPUs to allocate',
          },
          memory: {
            type: 'string',
            description: 'Memory limit (e.g., 512M, 2G)',
          },
          entrypoint: {
            type: 'string',
            description: 'Override the default entrypoint',
          },
          network: {
            type: 'string',
            description: 'Network to attach the container to',
          },
          labels: {
            type: 'array',
            items: { type: 'string' },
            description: 'Labels in KEY=VALUE format',
          },
          arguments: {
            type: 'array',
            items: { type: 'string' },
            description: 'Command arguments to pass to the container',
          },
        },
        required: ['image'],
      },
    };
  }

  private getContainerListTool(): Tool {
    return {
      name: 'container_list',
      description: 'List containers',
      inputSchema: {
        type: 'object',
        properties: {
          all: {
            type: 'boolean',
            description: 'Show all containers including stopped ones',
          },
          quiet: {
            type: 'boolean',
            description: 'Only show container IDs',
          },
          format: {
            type: 'string',
            enum: ['json', 'table'],
            description: 'Output format',
          },
        },
      },
    };
  }

  private getContainerStartTool(): Tool {
    return {
      name: 'container_start',
      description: 'Start a stopped container',
      inputSchema: {
        type: 'object',
        properties: {
          containerId: {
            type: 'string',
            description: 'Container ID or name',
          },
        },
        required: ['containerId'],
      },
    };
  }

  private getContainerStopTool(): Tool {
    return {
      name: 'container_stop',
      description: 'Stop a running container',
      inputSchema: {
        type: 'object',
        properties: {
          containerId: {
            type: 'string',
            description: 'Container ID or name (required if not using --all)',
          },
          all: {
            type: 'boolean',
            description: 'Stop all running containers',
          },
          signal: {
            type: 'string',
            description: 'Signal to send to the container',
          },
          time: {
            type: 'number',
            description: 'Seconds to wait before killing the container',
          },
        },
      },
    };
  }

  private getContainerKillTool(): Tool {
    return {
      name: 'container_kill',
      description: 'Kill a running container',
      inputSchema: {
        type: 'object',
        properties: {
          containerId: {
            type: 'string',
            description: 'Container ID or name (required if not using --all)',
          },
          all: {
            type: 'boolean',
            description: 'Kill all running containers',
          },
          signal: {
            type: 'string',
            description: 'Signal to send to the container',
          },
        },
      },
    };
  }

  private getContainerDeleteTool(): Tool {
    return {
      name: 'container_delete',
      description: 'Delete one or more containers',
      inputSchema: {
        type: 'object',
        properties: {
          containerId: {
            type: 'string',
            description: 'Container ID or name (required if not using --all)',
          },
          all: {
            type: 'boolean',
            description: 'Delete all containers',
          },
          force: {
            type: 'boolean',
            description: 'Force removal of running containers',
          },
        },
      },
    };
  }

  private getContainerExecTool(): Tool {
    return {
      name: 'container_exec',
      description: 'Execute a command in a running container',
      inputSchema: {
        type: 'object',
        properties: {
          containerId: {
            type: 'string',
            description: 'Container ID or name',
          },
          command: {
            type: 'array',
            items: { type: 'string' },
            description: 'Command and arguments to execute',
          },
          workdir: {
            type: 'string',
            description: 'Working directory for the command',
          },
          env: {
            type: 'array',
            items: { type: 'string' },
            description: 'Environment variables in KEY=VALUE format',
          },
          interactive: {
            type: 'boolean',
            description: 'Keep STDIN open',
          },
          tty: {
            type: 'boolean',
            description: 'Allocate a pseudo-TTY',
          },
          user: {
            type: 'string',
            description: 'Username or UID to run the command as',
          },
        },
        required: ['containerId', 'command'],
      },
    };
  }

  private getContainerLogsTool(): Tool {
    return {
      name: 'container_logs',
      description: 'Fetch container logs',
      inputSchema: {
        type: 'object',
        properties: {
          containerId: {
            type: 'string',
            description: 'Container ID or name',
          },
          follow: {
            type: 'boolean',
            description: 'Follow log output (stream logs)',
          },
          tail: {
            type: 'number',
            description: 'Number of lines to show from the end',
          },
          boot: {
            type: 'boolean',
            description: 'Show boot logs instead of stdio',
          },
        },
        required: ['containerId'],
      },
    };
  }

  private getContainerInspectTool(): Tool {
    return {
      name: 'container_inspect',
      description: 'Display detailed information about a container',
      inputSchema: {
        type: 'object',
        properties: {
          containerId: {
            type: 'string',
            description: 'Container ID or name',
          },
        },
        required: ['containerId'],
      },
    };
  }

  private async handleContainerCreate(args: any): Promise<CommandResult> {
    const input = ContainerCreateInputSchema.parse(args);
    const cmdArgs = this.buildCreateArgs('create', input);
    return this.executor.execute(cmdArgs);
  }

  private async handleContainerRun(args: any): Promise<CommandResult> {
    const input = ContainerCreateInputSchema.parse(args);
    const cmdArgs = this.buildCreateArgs('run', input);
    return this.executor.execute(cmdArgs);
  }

  private async handleContainerList(args: any): Promise<CommandResult> {
    const input = ContainerListInputSchema.parse(args);
    const cmdArgs = ['list'];

    if (input.all) cmdArgs.push('--all');
    if (input.quiet) cmdArgs.push('--quiet');
    if (input.format) cmdArgs.push('--format', input.format);

    const result = await this.executor.execute(cmdArgs, {
      parseJson: input.format === 'json',
    });

    if (result.success && input.format !== 'json') {
      result.data = this.executor.parseContainerList(result.output);
    }

    return result;
  }

  private async handleContainerStart(args: any): Promise<CommandResult> {
    const input = ContainerOperationInputSchema.parse(args);
    return this.executor.execute(['start', input.containerId]);
  }

  private async handleContainerStop(args: any): Promise<CommandResult> {
    const input = ContainerOperationInputSchema.parse(args);
    const cmdArgs = ['stop'];

    if (input.signal) cmdArgs.push('--signal', input.signal);
    if (input.time !== undefined) cmdArgs.push('--time', input.time.toString());
    if (args.all) cmdArgs.push('--all');
    else cmdArgs.push(input.containerId);

    return this.executor.execute(cmdArgs);
  }

  private async handleContainerKill(args: any): Promise<CommandResult> {
    const input = ContainerOperationInputSchema.parse(args);
    const cmdArgs = ['kill'];

    if (input.signal) cmdArgs.push('--signal', input.signal);
    if (args.all) cmdArgs.push('--all');
    else cmdArgs.push(input.containerId);

    return this.executor.execute(cmdArgs);
  }

  private async handleContainerDelete(args: any): Promise<CommandResult> {
    const input = ContainerOperationInputSchema.parse(args);
    const cmdArgs = ['delete'];

    if (input.force) cmdArgs.push('--force');
    if (args.all) cmdArgs.push('--all');
    else cmdArgs.push(input.containerId);

    return this.executor.execute(cmdArgs);
  }

  private async handleContainerExec(args: any): Promise<CommandResult> {
    const cmdArgs = ['exec'];

    if (args.workdir) cmdArgs.push('--cwd', args.workdir);
    if (args.env) {
      for (const envVar of args.env) {
        cmdArgs.push('--env', envVar);
      }
    }
    if (args.interactive) cmdArgs.push('--interactive');
    if (args.tty) cmdArgs.push('--tty');
    if (args.user) cmdArgs.push('--user', args.user);

    cmdArgs.push(args.containerId);
    cmdArgs.push(...args.command);

    return this.executor.execute(cmdArgs);
  }

  private async handleContainerLogs(args: any): Promise<CommandResult> {
    const cmdArgs = ['logs'];

    if (args.follow) cmdArgs.push('--follow');
    if (args.boot) cmdArgs.push('--boot');
    if (args.tail !== undefined) cmdArgs.push('-n', args.tail.toString());

    cmdArgs.push(args.containerId);

    if (args.follow) {
      // Use streaming execution for follow mode
      let output = '';
      return this.executor.executeStreaming(
        cmdArgs,
        (data) => {
          output += data;
          // In a real implementation, you might want to emit this data real-time
        },
        { timeout: 0 },
      );
    } else {
      return this.executor.execute(cmdArgs);
    }
  }

  private async handleContainerInspect(args: any): Promise<CommandResult> {
    return this.executor.execute(['inspect', args.containerId], {
      parseJson: true,
    });
  }

  private buildCreateArgs(command: string, input: ContainerCreateInput): string[] {
    const args = [command];

    // Handle basic options
    if (input.workdir) args.push('--workdir', input.workdir);
    if (input.env) {
      for (const envVar of input.env) {
        args.push('--env', envVar);
      }
    }
    if (input.volumes) {
      for (const volume of input.volumes) {
        args.push('--volume', volume);
      }
    }
    if (input.interactive) args.push('--interactive');
    if (input.tty) args.push('--tty');
    if (input.remove) args.push('--remove');
    if (input.cpus) args.push('--cpus', input.cpus);
    if (input.memory) args.push('--memory', input.memory);
    if (input.entrypoint) args.push('--entrypoint', input.entrypoint);
    if (input.network) args.push('--network', input.network);
    if (input.name) args.push('--name', input.name);

    // Handle labels
    if (input.labels) {
      for (const label of input.labels) {
        args.push('--label', label);
      }
    }

    // For run command, add detach option
    if (command === 'run' && input.detach) {
      args.push('--detach');
    }

    // Add image
    args.push(input.image);

    // Add command arguments
    if (input.arguments) {
      args.push(...input.arguments);
    }

    return args;
  }
}
