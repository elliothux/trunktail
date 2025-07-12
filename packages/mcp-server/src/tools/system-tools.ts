import { CommandExecutor } from '../command-executor.js';
import { RegistryLoginInputSchema, SystemLogsInputSchema, type CommandResult } from '../types.js';

// Define Tool interface locally to avoid import issues
interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export class SystemTools {
  constructor(private executor: CommandExecutor) {}

  /**
   * Get all system and registry-related MCP tools
   */
  getTools(): Tool[] {
    return [
      // System tools
      this.getSystemStatusTool(),
      this.getSystemStartTool(),
      this.getSystemStopTool(),
      this.getSystemLogsTool(),

      // Registry tools
      this.getRegistryLoginTool(),
      this.getRegistryLogoutTool(),
      this.getRegistryDefaultSetTool(),
      this.getRegistryDefaultUnsetTool(),
      this.getRegistryDefaultInspectTool(),

      // Builder tools
      this.getBuilderStartTool(),
      this.getBuilderStopTool(),
      this.getBuilderStatusTool(),
      this.getBuilderDeleteTool(),
    ];
  }

  /**
   * Handle system tool execution
   */
  async handleTool(name: string, args: any): Promise<CommandResult> {
    switch (name) {
      // System commands
      case 'system_status':
        return this.handleSystemStatus(args);
      case 'system_start':
        return this.handleSystemStart(args);
      case 'system_stop':
        return this.handleSystemStop(args);
      case 'system_logs':
        return this.handleSystemLogs(args);

      // Registry commands
      case 'registry_login':
        return this.handleRegistryLogin(args);
      case 'registry_logout':
        return this.handleRegistryLogout(args);
      case 'registry_default_set':
        return this.handleRegistryDefaultSet(args);
      case 'registry_default_unset':
        return this.handleRegistryDefaultUnset(args);
      case 'registry_default_inspect':
        return this.handleRegistryDefaultInspect(args);

      // Builder commands
      case 'builder_start':
        return this.handleBuilderStart(args);
      case 'builder_stop':
        return this.handleBuilderStop(args);
      case 'builder_status':
        return this.handleBuilderStatus(args);
      case 'builder_delete':
        return this.handleBuilderDelete(args);

      default:
        throw new Error(`Unknown system tool: ${name}`);
    }
  }

  // System Tools
  private getSystemStatusTool(): Tool {
    return {
      name: 'system_status',
      description: 'Show the status of container services',
      inputSchema: {
        type: 'object',
        properties: {
          prefix: {
            type: 'string',
            description: 'Launchd prefix for container services',
          },
        },
      },
    };
  }

  private getSystemStartTool(): Tool {
    return {
      name: 'system_start',
      description: 'Start container services',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Path to the container-apiserver binary',
          },
          debug: {
            type: 'boolean',
            description: 'Enable debug logging for the runtime daemon',
          },
          enableKernelInstall: {
            type: 'boolean',
            description: 'Enable automatic kernel installation',
          },
        },
      },
    };
  }

  private getSystemStopTool(): Tool {
    return {
      name: 'system_stop',
      description: 'Stop all container services',
      inputSchema: {
        type: 'object',
        properties: {
          prefix: {
            type: 'string',
            description: 'Launchd prefix for container services',
          },
        },
      },
    };
  }

  private getSystemLogsTool(): Tool {
    return {
      name: 'system_logs',
      description: 'Fetch system logs for container services',
      inputSchema: {
        type: 'object',
        properties: {
          last: {
            type: 'string',
            description: 'Fetch logs from specified time period (e.g., 5m, 1h, 1d)',
          },
          follow: {
            type: 'boolean',
            description: 'Follow log output',
          },
        },
      },
    };
  }

  // Registry Tools
  private getRegistryLoginTool(): Tool {
    return {
      name: 'registry_login',
      description: 'Login to a container registry',
      inputSchema: {
        type: 'object',
        properties: {
          server: {
            type: 'string',
            description: 'Registry server URL',
          },
          username: {
            type: 'string',
            description: 'Username for authentication',
          },
          password: {
            type: 'string',
            description: 'Password for authentication',
          },
          passwordStdin: {
            type: 'boolean',
            description: 'Take the password from stdin',
          },
          scheme: {
            type: 'string',
            enum: ['http', 'https', 'auto'],
            description: 'Scheme to use when connecting to the registry',
          },
        },
        required: ['server'],
      },
    };
  }

  private getRegistryLogoutTool(): Tool {
    return {
      name: 'registry_logout',
      description: 'Log out from a container registry',
      inputSchema: {
        type: 'object',
        properties: {
          registry: {
            type: 'string',
            description: 'Registry to log out from',
          },
        },
        required: ['registry'],
      },
    };
  }

  private getRegistryDefaultSetTool(): Tool {
    return {
      name: 'registry_default_set',
      description: 'Set the default container registry',
      inputSchema: {
        type: 'object',
        properties: {
          host: {
            type: 'string',
            description: 'Registry host to set as default',
          },
          scheme: {
            type: 'string',
            enum: ['http', 'https', 'auto'],
            description: 'Scheme to use when connecting to the registry',
          },
        },
        required: ['host'],
      },
    };
  }

  private getRegistryDefaultUnsetTool(): Tool {
    return {
      name: 'registry_default_unset',
      description: 'Unset the default container registry',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }

  private getRegistryDefaultInspectTool(): Tool {
    return {
      name: 'registry_default_inspect',
      description: 'Display the default registry domain',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }

  // Builder Tools
  private getBuilderStartTool(): Tool {
    return {
      name: 'builder_start',
      description: 'Start the image builder',
      inputSchema: {
        type: 'object',
        properties: {
          cpus: {
            type: 'string',
            description: 'Number of CPUs to allocate to the builder',
          },
          memory: {
            type: 'string',
            description: 'Amount of memory to allocate to the builder',
          },
        },
      },
    };
  }

  private getBuilderStopTool(): Tool {
    return {
      name: 'builder_stop',
      description: 'Stop the image builder',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }

  private getBuilderStatusTool(): Tool {
    return {
      name: 'builder_status',
      description: 'Print builder status',
      inputSchema: {
        type: 'object',
        properties: {
          json: {
            type: 'boolean',
            description: 'Display detailed status in JSON format',
          },
        },
      },
    };
  }

  private getBuilderDeleteTool(): Tool {
    return {
      name: 'builder_delete',
      description: 'Delete the image builder',
      inputSchema: {
        type: 'object',
        properties: {
          force: {
            type: 'boolean',
            description: 'Force delete builder even if it is running',
          },
        },
      },
    };
  }

  // System Handler Methods
  private async handleSystemStatus(args: any): Promise<CommandResult> {
    const cmdArgs = ['system', 'status'];

    if (args.prefix) {
      cmdArgs.push('--prefix', args.prefix);
    }

    return this.executor.execute(cmdArgs);
  }

  private async handleSystemStart(args: any): Promise<CommandResult> {
    const cmdArgs = ['system', 'start'];

    if (args.path) cmdArgs.push('--path', args.path);
    if (args.debug) cmdArgs.push('--debug');
    if (args.enableKernelInstall !== undefined) {
      if (args.enableKernelInstall) {
        cmdArgs.push('--enable-kernel-install');
      } else {
        cmdArgs.push('--disable-kernel-install');
      }
    }

    return this.executor.execute(cmdArgs);
  }

  private async handleSystemStop(args: any): Promise<CommandResult> {
    const cmdArgs = ['system', 'stop'];

    if (args.prefix) {
      cmdArgs.push('--prefix', args.prefix);
    }

    return this.executor.execute(cmdArgs);
  }

  private async handleSystemLogs(args: any): Promise<CommandResult> {
    const input = SystemLogsInputSchema.parse(args);
    const cmdArgs = ['system', 'logs'];

    if (input.last) cmdArgs.push('--last', input.last);
    if (input.follow) cmdArgs.push('--follow');

    if (input.follow) {
      // Use streaming execution for follow mode
      return this.executor.executeStreaming(
        cmdArgs,
        (data) => {
          // In a real implementation, you might want to emit this data real-time
        },
        { timeout: 0 },
      );
    } else {
      return this.executor.execute(cmdArgs);
    }
  }

  // Registry Handler Methods
  private async handleRegistryLogin(args: any): Promise<CommandResult> {
    const input = RegistryLoginInputSchema.parse(args);
    const cmdArgs = ['registry', 'login'];

    if (input.username) cmdArgs.push('--username', input.username);
    if (input.passwordStdin) cmdArgs.push('--password-stdin');
    if (input.scheme) cmdArgs.push('--scheme', input.scheme);

    cmdArgs.push(input.server);

    // Handle password input securely
    const env: Record<string, string> = {};
    if (input.password && !input.passwordStdin) {
      // Note: This is not the most secure way to pass passwords
      // In a production environment, you should use stdin or a secure method
      env.CONTAINER_REGISTRY_PASSWORD = input.password;
    }

    return this.executor.execute(cmdArgs, { env });
  }

  private async handleRegistryLogout(args: any): Promise<CommandResult> {
    return this.executor.execute(['registry', 'logout', args.registry]);
  }

  private async handleRegistryDefaultSet(args: any): Promise<CommandResult> {
    const cmdArgs = ['registry', 'default', 'set'];

    if (args.scheme) cmdArgs.push('--scheme', args.scheme);
    cmdArgs.push(args.host);

    return this.executor.execute(cmdArgs);
  }

  private async handleRegistryDefaultUnset(args: any): Promise<CommandResult> {
    return this.executor.execute(['registry', 'default', 'unset']);
  }

  private async handleRegistryDefaultInspect(args: any): Promise<CommandResult> {
    return this.executor.execute(['registry', 'default', 'inspect']);
  }

  // Builder Handler Methods
  private async handleBuilderStart(args: any): Promise<CommandResult> {
    const cmdArgs = ['builder', 'start'];

    if (args.cpus) cmdArgs.push('--cpus', args.cpus);
    if (args.memory) cmdArgs.push('--memory', args.memory);

    return this.executor.execute(cmdArgs);
  }

  private async handleBuilderStop(args: any): Promise<CommandResult> {
    return this.executor.execute(['builder', 'stop']);
  }

  private async handleBuilderStatus(args: any): Promise<CommandResult> {
    const cmdArgs = ['builder', 'status'];

    if (args.json) cmdArgs.push('--json');

    return this.executor.execute(cmdArgs, { parseJson: args.json });
  }

  private async handleBuilderDelete(args: any): Promise<CommandResult> {
    const cmdArgs = ['builder', 'delete'];

    if (args.force) cmdArgs.push('--force');

    return this.executor.execute(cmdArgs);
  }
}
