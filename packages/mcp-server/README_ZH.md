# Apple Container MCP 服务器

一个模型上下文协议（MCP）服务器，为 AI 助手和自动化工作流提供 Apple Container CLI 集成。

[![npm version](https://badge.fury.io/js/contaienr-mcp-server.svg)](https://badge.fury.io/js/contaienr-mcp-server)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

[中文文档](https://github.com/elliothux/trunktail/blob/main/packages/mcp-server/README_ZH.md) | [English](https://github.com/elliothux/trunktail/blob/main/packages/mcp-server/README.md)

## 🚀 功能特性

### 容器生命周期管理

- **创建和运行**：使用高级配置选项创建容器
- **启动和停止**：通过适当的信号处理管理容器生命周期
- **删除**：为运行中的容器提供强制删除选项的清理功能
- **执行**：在容器内运行命令，完全控制环境
- **日志**：流式传输或获取容器日志，支持过滤选项
- **检查**：获取详细的容器信息和配置

### 镜像管理

- **列表**：查看所有可用镜像及其元数据
- **拉取**：从注册表下载镜像，支持进度跟踪
- **推送**：将镜像上传到注册表
- **构建**：从 Dockerfile 构建自定义镜像
- **检查**：检查镜像详细信息和层信息
- **标签**：创建镜像标签和别名
- **删除**：删除未使用的镜像并释放空间

### 系统操作

- **状态**：监控 Apple Container 系统健康状况
- **启动/停止**：控制容器运行时系统
- **日志**：访问系统级日志记录和诊断
- **注册表**：管理注册表身份验证和配置
- **构建器**：控制镜像构建器服务

## 🛠️ 使用方法

### 依赖

- **Node.js 或 Bun**：Node.js 18.0.0+ 或 Bun 1.0.0+
- **Apple Container**：必须安装 Apple Container CLI 并在 PATH 中可用

### 安装 Apple Container CLI

从官方发布页面下载并安装 Apple Container CLI：

**[Apple Container 发布页面](https://github.com/apple/container/releases)**

### MCP 配置

添加到您的 MCP 配置文件中（通常为 `~/.config/mcp/config.json`）：

**使用 Bun（推荐）：**

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

**使用 pnpm**

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

**使用 npm**

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

## 🔧 可用工具

### 容器操作

| 工具                | 描述             | 关键参数                                |
| ------------------- | ---------------- | --------------------------------------- |
| `container_create`  | 创建新容器       | `image`, `name`, `env`, `ports`         |
| `container_run`     | 创建并启动容器   | `image`, `detach`, `interactive`        |
| `container_list`    | 列出容器         | `all`, `format`, `quiet`                |
| `container_start`   | 启动已停止的容器 | `containerId`                           |
| `container_stop`    | 停止运行中的容器 | `containerId`, `signal`, `time`         |
| `container_kill`    | 立即杀死容器     | `containerId`, `signal`                 |
| `container_delete`  | 删除容器         | `containerId`, `force`, `all`           |
| `container_exec`    | 执行命令         | `containerId`, `command`, `interactive` |
| `container_logs`    | 获取容器日志     | `containerId`, `follow`, `tail`         |
| `container_inspect` | 详细容器信息     | `containerId`                           |

### 镜像操作

| 工具            | 描述               | 关键参数                          |
| --------------- | ------------------ | --------------------------------- |
| `image_list`    | 列出可用镜像       | `format`, `quiet`                 |
| `image_pull`    | 下载镜像           | `reference`, `platform`           |
| `image_push`    | 上传镜像           | `reference`, `platform`           |
| `image_build`   | 从 Dockerfile 构建 | `tag`, `contextDir`, `dockerfile` |
| `image_inspect` | 检查镜像详细信息   | `images`                          |
| `image_tag`     | 创建镜像标签       | `source`, `target`                |
| `image_delete`  | 删除镜像           | `images`, `all`                   |
| `image_save`    | 导出到归档文件     | `reference`, `output`             |
| `image_load`    | 从归档文件导入     | `input`                           |
| `image_prune`   | 清理未使用的镜像   | -                                 |

### 系统操作

| 工具              | 描述             | 关键参数                         |
| ----------------- | ---------------- | -------------------------------- |
| `system_status`   | 检查系统健康状况 | -                                |
| `system_start`    | 启动容器系统     | `debug`, `path`                  |
| `system_stop`     | 停止容器系统     | -                                |
| `system_logs`     | 系统诊断         | `follow`, `last`                 |
| `registry_login`  | 注册表身份验证   | `server`, `username`, `password` |
| `registry_logout` | 从注册表注销     | `registry`                       |
| `builder_start`   | 启动镜像构建器   | `cpus`, `memory`                 |
| `builder_stop`    | 停止镜像构建器   | -                                |
| `builder_status`  | 构建器信息       | `json`                           |

## 🤝 贡献

我们欢迎贡献！请查看我们的[贡献指南](CONTRIBUTING.md)了解详情。

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/elliothux/trunktail
cd packages/mcp-server

# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 运行测试
bun test

# 构建生产版本
bun run build
```

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Model Context Protocol](https://modelcontextprotocol.io/) 提供出色的协议规范
- [Apple Container](https://support.apple.com/guide/mac-help/containers-mchlf7c5b15f/mac) 提供底层容器技术
- [Zod](https://zod.dev/) 提供运行时类型验证
- [TypeScript](https://www.typescriptlang.org/) 提供类型安全

---
