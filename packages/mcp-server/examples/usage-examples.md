# Apple Container MCP Server - Usage Examples

This document provides comprehensive examples of how to use the Apple Container MCP Server with AI assistants.

## Quick Start Examples

### 1. Check System Status

Before working with containers, check if the system is ready:

```typescript
// Check if container services are running
await callTool('system_status', {});

// If not running, start the system
await callTool('system_start', {});
```

### 2. Basic Container Workflow

```typescript
// 1. Pull an image
await callTool('image_pull', {
  reference: 'ubuntu:latest',
});

// 2. Run a container
await callTool('container_run', {
  image: 'ubuntu:latest',
  name: 'my-ubuntu',
  interactive: true,
  tty: true,
  detach: true,
  arguments: ['bash'],
});

// 3. Check container status
await callTool('container_list', { all: true });

// 4. Execute a command in the container
await callTool('container_exec', {
  containerId: 'my-ubuntu',
  command: ['echo', 'Hello from container!'],
});
```

## Container Management Examples

### Creating Containers with Different Configurations

#### Web Server Container

```typescript
await callTool('container_create', {
  image: 'nginx:latest',
  name: 'web-server',
  ports: ['8080:80'],
  volumes: ['/host/www:/usr/share/nginx/html:ro'],
  env: ['NGINX_HOST=localhost'],
  memory: '256M',
  cpus: '0.5',
});
```

#### Development Environment

```typescript
await callTool('container_run', {
  image: 'node:18',
  name: 'dev-env',
  workdir: '/app',
  volumes: ['/Users/developer/project:/app'],
  env: ['NODE_ENV=development', 'PORT=3000'],
  ports: ['3000:3000'],
  interactive: true,
  tty: true,
  arguments: ['npm', 'run', 'dev'],
});
```

#### Database Container

```typescript
await callTool('container_run', {
  image: 'postgres:15',
  name: 'postgres-db',
  env: ['POSTGRES_DB=myapp', 'POSTGRES_USER=developer', 'POSTGRES_PASSWORD=secretpass'],
  ports: ['5432:5432'],
  volumes: ['postgres-data:/var/lib/postgresql/data'],
  detach: true,
});
```

### Container Operations

#### Starting and Stopping Containers

```typescript
// Start a stopped container
await callTool('container_start', {
  containerId: 'my-ubuntu',
});

// Stop a running container gracefully
await callTool('container_stop', {
  containerId: 'my-ubuntu',
  time: 10, // Wait 10 seconds before killing
});

// Force kill a container
await callTool('container_kill', {
  containerId: 'my-ubuntu',
  signal: 'SIGKILL',
});

// Stop all running containers
await callTool('container_stop', {
  all: true,
});
```

#### Managing Container Logs

```typescript
// View recent logs
await callTool('container_logs', {
  containerId: 'web-server',
  tail: 50,
});

// Follow logs in real-time
await callTool('container_logs', {
  containerId: 'web-server',
  follow: true,
});

// View boot logs
await callTool('container_logs', {
  containerId: 'web-server',
  boot: true,
});
```

## Image Management Examples

### Building Images

#### Simple Dockerfile Build

```typescript
await callTool('image_build', {
  contextDir: '/path/to/project',
  tag: 'my-app:latest',
});
```

#### Advanced Build with Arguments

```typescript
await callTool('image_build', {
  contextDir: '/path/to/project',
  dockerfile: 'Dockerfile.prod',
  tag: 'my-app:production',
  buildArgs: ['NODE_VERSION=18', 'BUILD_ENV=production'],
  labels: ['version=1.0.0', 'maintainer=developer@company.com'],
  noCache: true,
  target: 'production',
  cpus: '4',
  memory: '4G',
});
```

### Managing Images

#### Listing and Inspecting Images

```typescript
// List all images
await callTool('image_list', {});

// List images with verbose output
await callTool('image_list', {
  verbose: true,
  format: 'json',
});

// Inspect an image
await callTool('image_inspect', {
  images: ['nginx:latest'],
});
```

#### Tagging and Distributing Images

```typescript
// Tag an image
await callTool('image_tag', {
  source: 'my-app:latest',
  target: 'registry.company.com/my-app:v1.0.0',
});

// Push to registry
await callTool('image_push', {
  reference: 'registry.company.com/my-app:v1.0.0',
  scheme: 'https',
});

// Save image to file
await callTool('image_save', {
  reference: 'my-app:latest',
  output: '/backup/my-app-latest.tar',
});

// Load image from file
await callTool('image_load', {
  input: '/backup/my-app-latest.tar',
});
```

## Registry and Authentication

### Registry Login

```typescript
// Login to Docker Hub
await callTool('registry_login', {
  server: 'docker.io',
  username: 'myusername',
  passwordStdin: true, // Provide password via stdin for security
});

// Login to private registry
await callTool('registry_login', {
  server: 'registry.company.com',
  username: 'developer',
  scheme: 'https',
});

// Set default registry
await callTool('registry_default_set', {
  host: 'registry.company.com',
  scheme: 'https',
});
```

## System Administration

### Managing Container Services

```typescript
// Check system status
await callTool('system_status', {
  prefix: 'com.apple.container.',
});

// Start container services with debug
await callTool('system_start', {
  debug: true,
  enableKernelInstall: true,
});

// View system logs
await callTool('system_logs', {
  last: '1h',
  follow: false,
});
```

### Image Builder Management

```typescript
// Start builder with custom resources
await callTool('builder_start', {
  cpus: '4',
  memory: '8G',
});

// Check builder status
await callTool('builder_status', {
  json: true,
});

// Stop builder
await callTool('builder_stop', {});
```

## Advanced Scenarios

### Multi-Container Application

```typescript
// 1. Start database
await callTool('container_run', {
  image: 'postgres:15',
  name: 'app-db',
  env: ['POSTGRES_DB=app', 'POSTGRES_PASSWORD=secret'],
  detach: true,
});

// 2. Start Redis cache
await callTool('container_run', {
  image: 'redis:7',
  name: 'app-cache',
  detach: true,
});

// 3. Start application
await callTool('container_run', {
  image: 'my-app:latest',
  name: 'app-server',
  env: ['DATABASE_URL=postgresql://postgres:secret@app-db:5432/app', 'REDIS_URL=redis://app-cache:6379'],
  ports: ['8080:3000'],
  detach: true,
});
```

### Development Workflow

```typescript
// 1. Build development image
await callTool('image_build', {
  contextDir: '.',
  tag: 'my-app:dev',
  target: 'development',
});

// 2. Run with live reload
await callTool('container_run', {
  image: 'my-app:dev',
  name: 'dev-server',
  volumes: ['.:/app'],
  ports: ['3000:3000'],
  env: ['NODE_ENV=development'],
  interactive: true,
  tty: true,
});

// 3. Watch logs during development
await callTool('container_logs', {
  containerId: 'dev-server',
  follow: true,
});
```

### Cleanup Operations

```typescript
// Stop all containers
await callTool('container_stop', { all: true });

// Remove all stopped containers
await callTool('container_delete', { all: true });

// Remove unused images
await callTool('image_prune', {});

// Check final status
await callTool('system_status', {});
```

## Error Handling Examples

### Common Error Scenarios

```typescript
try {
  await callTool('container_start', {
    containerId: 'non-existent',
  });
} catch (error) {
  // Handle container not found error
  console.log('Container not found, creating new one...');
  await callTool('container_create', {
    image: 'ubuntu:latest',
    name: 'non-existent',
  });
}

try {
  await callTool('image_pull', {
    reference: 'invalid-image:tag',
  });
} catch (error) {
  // Handle pull failure
  console.log('Failed to pull image, using local fallback...');
  await callTool('image_list', {});
}
```

## Scripting and Automation

### Health Check Script

```typescript
async function healthCheck() {
  // Check system status
  const systemStatus = await callTool('system_status', {});

  // List running containers
  const containers = await callTool('container_list', {});

  // Check specific container health
  const appLogs = await callTool('container_logs', {
    containerId: 'my-app',
    tail: 10,
  });

  return {
    system: systemStatus,
    containers: containers,
    appHealth: appLogs,
  };
}
```

### Deployment Script

```typescript
async function deployApplication(version: string) {
  // 1. Pull new image
  await callTool('image_pull', {
    reference: `my-app:${version}`,
  });

  // 2. Stop old container
  await callTool('container_stop', {
    containerId: 'my-app',
  });

  // 3. Remove old container
  await callTool('container_delete', {
    containerId: 'my-app',
  });

  // 4. Start new container
  await callTool('container_run', {
    image: `my-app:${version}`,
    name: 'my-app',
    ports: ['8080:3000'],
    detach: true,
  });

  // 5. Verify deployment
  await callTool('container_logs', {
    containerId: 'my-app',
    tail: 20,
  });
}
```

These examples demonstrate the full capabilities of the Apple Container MCP Server and how AI assistants can leverage them for container management, development workflows, and system administration tasks.
