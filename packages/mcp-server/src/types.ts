import { z } from 'zod';

// Import command definitions from the commands package
export interface CommandOption {
  flag: string;
  description: string;
  defaultValue?: string;
  required?: boolean;
}

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  options: CommandOption[];
  examples?: string[];
  subcommands?: Command[];
}

export interface CommandCategory {
  name: string;
  description: string;
  commands: Command[];
}

// Container operation result schemas
export const ContainerStatusSchema = z.enum(['created', 'running', 'stopped', 'exited', 'error']);

export const ContainerInfoSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  image: z.string(),
  status: ContainerStatusSchema,
  created: z.string(),
  ports: z.array(z.string()).optional(),
  command: z.string().optional(),
});

export const ImageInfoSchema = z.object({
  id: z.string(),
  repository: z.string(),
  tag: z.string(),
  size: z.string(),
  created: z.string(),
});

export const SystemStatusSchema = z.object({
  version: z.string(),
  status: z.string(),
  uptime: z.string().optional(),
  containers: z.object({
    running: z.number(),
    stopped: z.number(),
    total: z.number(),
  }),
  images: z.object({
    total: z.number(),
    size: z.string(),
  }),
});

// Command execution schemas
export const CommandResultSchema = z.object({
  success: z.boolean(),
  output: z.string(),
  error: z.string().optional(),
  exitCode: z.number().optional(),
  data: z.any().optional(),
});

// Input validation schemas for tools
export const ContainerCreateInputSchema = z.object({
  image: z.string().min(1, 'Image name is required'),
  name: z.string().optional(),
  workdir: z.string().optional(),
  env: z.array(z.string()).optional(),
  volumes: z.array(z.string()).optional(),
  ports: z.array(z.string()).optional(),
  interactive: z.boolean().optional(),
  tty: z.boolean().optional(),
  detach: z.boolean().optional(),
  remove: z.boolean().optional(),
  cpus: z.string().optional(),
  memory: z.string().optional(),
  entrypoint: z.string().optional(),
  network: z.string().optional(),
  labels: z.array(z.string()).optional(),
  arguments: z.array(z.string()).optional(),
});

export const ContainerListInputSchema = z.object({
  all: z.boolean().optional(),
  quiet: z.boolean().optional(),
  format: z.enum(['json', 'table']).optional(),
});

export const ContainerOperationInputSchema = z.object({
  containerId: z.string().min(1, 'Container ID is required'),
  signal: z.string().optional(),
  force: z.boolean().optional(),
  time: z.number().optional(),
});

export const ImageBuildInputSchema = z.object({
  contextDir: z.string().optional(),
  dockerfile: z.string().optional(),
  tag: z.string().optional(),
  buildArgs: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
  noCache: z.boolean().optional(),
  target: z.string().optional(),
  quiet: z.boolean().optional(),
  cpus: z.string().optional(),
  memory: z.string().optional(),
});

export const ImagePullInputSchema = z.object({
  reference: z.string().min(1, 'Image reference is required'),
  platform: z.string().optional(),
  scheme: z.enum(['http', 'https', 'auto']).optional(),
  disableProgress: z.boolean().optional(),
});

export const ImageListInputSchema = z.object({
  quiet: z.boolean().optional(),
  verbose: z.boolean().optional(),
  format: z.enum(['json', 'table']).optional(),
});

export const RegistryLoginInputSchema = z.object({
  server: z.string().min(1, 'Registry server is required'),
  username: z.string().optional(),
  password: z.string().optional(),
  passwordStdin: z.boolean().optional(),
  scheme: z.enum(['http', 'https', 'auto']).optional(),
});

export const SystemLogsInputSchema = z.object({
  last: z.string().optional(),
  follow: z.boolean().optional(),
});

// Type exports
export type ContainerStatus = z.infer<typeof ContainerStatusSchema>;
export type ContainerInfo = z.infer<typeof ContainerInfoSchema>;
export type ImageInfo = z.infer<typeof ImageInfoSchema>;
export type SystemStatus = z.infer<typeof SystemStatusSchema>;
export type CommandResult = z.infer<typeof CommandResultSchema>;

export type ContainerCreateInput = z.infer<typeof ContainerCreateInputSchema>;
export type ContainerListInput = z.infer<typeof ContainerListInputSchema>;
export type ContainerOperationInput = z.infer<typeof ContainerOperationInputSchema>;
export type ImageBuildInput = z.infer<typeof ImageBuildInputSchema>;
export type ImagePullInput = z.infer<typeof ImagePullInputSchema>;
export type ImageListInput = z.infer<typeof ImageListInputSchema>;
export type RegistryLoginInput = z.infer<typeof RegistryLoginInputSchema>;
export type SystemLogsInput = z.infer<typeof SystemLogsInputSchema>;
