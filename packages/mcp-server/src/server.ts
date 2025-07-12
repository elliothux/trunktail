import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import { CommandExecutor } from './command-executor.js';
import { ContainerTools } from './tools/container-tools.js';
import { ImageTools } from './tools/image-tools.js';
import { SystemTools } from './tools/system-tools.js';
import type { CommandResult } from './types.js';

export interface ServerConfig {
  containerPath?: string;
  debug?: boolean;
  name?: string;
  version?: string;
}

export class ContainerMCPServer {
  private server: Server;
  private executor: CommandExecutor;
  private containerTools: ContainerTools;
  private imageTools: ImageTools;
  private systemTools: SystemTools;

  constructor(config: ServerConfig = {}) {
    const {
      containerPath = 'container',
      debug = false,
      name = 'apple-container-mcp-server',
      version = '0.1.0',
    } = config;

    this.server = new Server({
      name,
      version,
      capabilities: {
        tools: {},
      },
    });

    this.executor = new CommandExecutor(containerPath, debug);
    this.containerTools = new ContainerTools(this.executor);
    this.imageTools = new ImageTools(this.executor);
    this.systemTools = new SystemTools(this.executor);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const allTools = [
        ...this.containerTools.getTools(),
        ...this.imageTools.getTools(),
        ...this.systemTools.getTools(),
      ];

      return {
        tools: allTools,
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: CommandResult;

        // Route to appropriate tool handler
        if (name.startsWith('container_')) {
          result = await this.containerTools.handleTool(name, args);
        } else if (name.startsWith('image_')) {
          result = await this.imageTools.handleTool(name, args);
        } else if (name.startsWith('system_') || name.startsWith('registry_') || name.startsWith('builder_')) {
          result = await this.systemTools.handleTool(name, args);
        } else {
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }

        // Format the response
        return {
          content: [
            {
              type: 'text',
              text: this.formatToolResult(name, result),
            },
          ],
        };
      } catch (error) {
        // Handle validation errors from Zod
        if (error instanceof Error && 'issues' in error) {
          const validationError = error as any;
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters for ${name}: ${validationError.issues
              .map((issue: any) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`,
          );
        }

        // Handle other errors
        if (error instanceof McpError) {
          throw error;
        }

        throw new McpError(ErrorCode.InternalError, error instanceof Error ? error.message : 'Unknown error occurred');
      }
    });

    // Error handler
    this.server.onerror = (error) => {
      console.error('[MCP Server] Error:', error);
    };
  }

  private formatToolResult(toolName: string, result: CommandResult): string {
    const sections: string[] = [];

    // Add tool execution header
    sections.push(`=== ${toolName.replace(/_/g, ' ').toUpperCase()} ===\n`);

    // Add execution status
    if (result.success) {
      sections.push('✅ **Status**: SUCCESS');
    } else {
      sections.push('❌ **Status**: FAILED');
      if (result.exitCode !== undefined) {
        sections.push(`**Exit Code**: ${result.exitCode}`);
      }
    }

    // Add structured data if available
    if (result.data) {
      sections.push('\n**📊 Structured Data**:');
      try {
        const formattedData = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2);
        sections.push('```json\n' + formattedData + '\n```');
      } catch {
        sections.push('```\n' + String(result.data) + '\n```');
      }
    }

    // Add command output
    if (result.output && result.output.trim()) {
      sections.push('\n**📝 Output**:');
      sections.push('```\n' + result.output.trim() + '\n```');
    }

    // Add error information
    if (result.error && result.error.trim()) {
      sections.push('\n**⚠️ Error Output**:');
      sections.push('```\n' + result.error.trim() + '\n```');
    }

    // Add helpful information for specific tools
    const helpText = this.getHelpText(toolName, result);
    if (helpText) {
      sections.push('\n**💡 Help**:');
      sections.push(helpText);
    }

    return sections.join('\n');
  }

  private getHelpText(toolName: string, result: CommandResult): string | null {
    if (!result.success) {
      switch (toolName) {
        case 'container_list':
          return 'If no containers are found, try creating one first with `container_create` or `container_run`.';

        case 'image_list':
          return 'If no images are found, try pulling one first with `image_pull` (e.g., `ubuntu:latest`).';

        case 'system_status':
          return 'If the system is not running, start it with `system_start`.';

        case 'container_start':
        case 'container_stop':
        case 'container_kill':
          return 'Check that the container ID/name is correct using `container_list`.';

        case 'image_pull':
          return 'Verify the image name and tag are correct. Check your internet connection and registry access.';

        case 'registry_login':
          return 'Verify your credentials and that the registry URL is correct.';

        default:
          return 'Check the command parameters and ensure the Apple Container system is running.';
      }
    }

    // Success help text
    switch (toolName) {
      case 'container_create':
        return 'Container created successfully. Use `container_start` to start it.';

      case 'container_run':
        return 'Container is now running. Use `container_logs` to view its output.';

      case 'image_build':
        return 'Image built successfully. You can now use it with `container_run`.';

      case 'image_pull':
        return 'Image pulled successfully. You can now use it with `container_run`.';

      case 'system_start':
        return 'Container system started. You can now create and run containers.';

      default:
        return null;
    }
  }

  /**
   * Validate that the container CLI is available
   */
  async validateEnvironment(): Promise<void> {
    const isAvailable = await this.executor.validateCLI();
    if (!isAvailable) {
      throw new Error('Apple Container CLI is not available. Please ensure it is installed and in your PATH.');
    }
  }

  /**
   * Start the MCP server
   */
  async connect(transport: any): Promise<void> {
    await this.validateEnvironment();
    await this.server.connect(transport);
    console.log('🚀 Apple Container MCP Server is running');
  }

  /**
   * Get server instance for advanced usage
   */
  getServer(): Server {
    return this.server;
  }

  /**
   * Close the server
   */
  async close(): Promise<void> {
    await this.server.close();
  }
}
