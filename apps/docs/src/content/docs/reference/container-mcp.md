---
title: MCP Server
description: container-mcp-server
---

A Model Context Protocol (MCP) server that provides Apple Container CLI integration for AI assistants and automated workflows.

## Usage

### Prerequisites

- **Node.js or Bun**: Node.js 18.0.0+ or Bun 1.0.0+
- **Apple Container**: Apple Container CLI must be installed and available in PATH
  - [Apple Container Releases](https://github.com/apple/container/releases)

### MCP Configuration Example

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

## Repository

- [GitHub: elliothux/trunktail (mcp-server)](https://github.com/elliothux/trunktail/tree/main/packages/mcp-server)
