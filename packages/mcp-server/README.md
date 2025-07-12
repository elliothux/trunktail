# Apple Container MCP Server

A Model Context Protocol (MCP) server that provides Apple Container CLI integration for AI assistants and automated workflows.

[![npm version](https://badge.fury.io/js/contaienr-mcp-server.svg)](https://badge.fury.io/js/contaienr-mcp-server)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

[中文文档](https://github.com/elliothux/trunktail/blob/main/packages/mcp-server/README_ZH.md) | [English](https://github.com/elliothux/trunktail/blob/main/packages/mcp-server/README.md)

## 🚀 Features

### Container Lifecycle Management

- **Create & Run**: Create containers with advanced configuration options
- **Start & Stop**: Manage container lifecycle with proper signal handling
- **Delete**: Clean removal with force options for running containers
- **Execute**: Run commands inside containers with full environment control
- **Logs**: Stream or fetch container logs with filtering options
- **Inspect**: Get detailed container information and configuration

### Image Management

- **List**: View all available images with metadata
- **Pull**: Download images from registries with progress tracking
- **Push**: Upload images to registries
- **Build**: Build custom images from Dockerfiles
- **Inspect**: Examine image details and layer information
- **Tag**: Create image tags and aliases
- **Delete**: Remove unused images and free up space

### System Operations

- **Status**: Monitor Apple Container system health
- **Start/Stop**: Control the container runtime system
- **Logs**: Access system-level logging and diagnostics
- **Registry**: Manage registry authentication and configuration
- **Builder**: Control the image builder service

## 🛠️ Usage

### Prerequisites

- **Node.js or Bun**: Node.js 18.0.0+ or Bun 1.0.0+
- **Apple Container**: Apple Container CLI must be installed and available in PATH

### Install Apple Container CLI

Download and install the Apple Container CLI from the official releases:

**[Apple Container Releases](https://github.com/apple/container/releases)**

### MCP Configuration

Add to your MCP configuration file (typically `~/.config/mcp/config.json`):

**With Bun (recommended):**

```json
{
  "mcpServers": {
    "container": {
      "command": "bunx",
      "args": ["-y", "container-mcp-server@latest"]
    }
  }
}
```

**With pnpm:**

```json
{
  "mcpServers": {
    "container": {
      "command": "pnpm",
      "args": ["dlx", "container-mcp-server@latest"]
    }
  }
}
```

**With npm:**

```json
{
  "mcpServers": {
    "container": {
      "command": "npx",
      "args": ["-y", "container-mcp-server@latest"]
    }
  }
}
```

## 🔧 Available Tools

### Container Operations

| Tool                | Description                | Key Parameters                          |
| ------------------- | -------------------------- | --------------------------------------- |
| `container_create`  | Create a new container     | `image`, `name`, `env`, `ports`         |
| `container_run`     | Create and start container | `image`, `detach`, `interactive`        |
| `container_list`    | List containers            | `all`, `format`, `quiet`                |
| `container_start`   | Start stopped container    | `containerId`                           |
| `container_stop`    | Stop running container     | `containerId`, `signal`, `time`         |
| `container_kill`    | Kill container immediately | `containerId`, `signal`                 |
| `container_delete`  | Remove containers          | `containerId`, `force`, `all`           |
| `container_exec`    | Execute commands           | `containerId`, `command`, `interactive` |
| `container_logs`    | Fetch container logs       | `containerId`, `follow`, `tail`         |
| `container_inspect` | Detailed container info    | `containerId`                           |

### Image Operations

| Tool            | Description           | Key Parameters                    |
| --------------- | --------------------- | --------------------------------- |
| `image_list`    | List available images | `format`, `quiet`                 |
| `image_pull`    | Download images       | `reference`, `platform`           |
| `image_push`    | Upload images         | `reference`, `platform`           |
| `image_build`   | Build from Dockerfile | `tag`, `contextDir`, `dockerfile` |
| `image_inspect` | Examine image details | `images`                          |
| `image_tag`     | Create image tags     | `source`, `target`                |
| `image_delete`  | Remove images         | `images`, `all`                   |
| `image_save`    | Export to archive     | `reference`, `output`             |
| `image_load`    | Import from archive   | `input`                           |
| `image_prune`   | Clean unused images   | -                                 |

### System Operations

| Tool              | Description              | Key Parameters                   |
| ----------------- | ------------------------ | -------------------------------- |
| `system_status`   | Check system health      | -                                |
| `system_start`    | Start container system   | `debug`, `path`                  |
| `system_stop`     | Stop container system    | -                                |
| `system_logs`     | System diagnostics       | `follow`, `last`                 |
| `registry_login`  | Authenticate to registry | `server`, `username`, `password` |
| `registry_logout` | Sign out from registry   | `registry`                       |
| `builder_start`   | Start image builder      | `cpus`, `memory`                 |
| `builder_stop`    | Stop image builder       | -                                |
| `builder_status`  | Builder information      | `json`                           |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/elliothux/trunktail
cd packages/mcp-server

# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun test

# Build for production
bun run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the excellent protocol specification
- [Apple Container](https://support.apple.com/guide/mac-help/containers-mchlf7c5b15f/mac) for the underlying container technology
- [Zod](https://zod.dev/) for runtime type validation
- [TypeScript](https://www.typescriptlang.org/) for type safety

---
