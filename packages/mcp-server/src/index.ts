#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Command } from 'commander';
import { ContainerMCPServer } from './server.js';

const program = new Command();

program
  .name('trunktail-mcp-server')
  .description('MCP Server for Apple Container CLI operations')
  .version('0.1.0')
  .option('--container-path <path>', 'Path to the container CLI binary', 'container')
  .option('--debug', 'Enable debug output', false)
  .option('--stdio', 'Use stdio transport (default)', true)
  .action(async (options) => {
    try {
      const server = new ContainerMCPServer({
        containerPath: options.containerPath,
        debug: options.debug,
      });

      if (options.stdio) {
        const transport = new StdioServerTransport();
        await server.connect(transport);
      } else {
        console.error('Only stdio transport is currently supported');
        process.exit(1);
      }
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      process.exit(1);
    }
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down MCP server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down MCP server...');
  process.exit(0);
});

program.parse();

// Export for programmatic usage
export { CommandExecutor } from './command-executor.js';
export { ContainerMCPServer } from './server.js';
export type { ServerConfig } from './server.js';
export * from './types.js';
