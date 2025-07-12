import { CommandExecutor } from '../command-executor.js';
import { ImageBuildInputSchema, ImageListInputSchema, ImagePullInputSchema, type CommandResult } from '../types.js';

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

export class ImageTools {
  constructor(private executor: CommandExecutor) {}

  /**
   * Get all image-related MCP tools
   */
  getTools(): Tool[] {
    return [
      this.getImageBuildTool(),
      this.getImageListTool(),
      this.getImagePullTool(),
      this.getImagePushTool(),
      this.getImageDeleteTool(),
      this.getImageTagTool(),
      this.getImageInspectTool(),
      this.getImageSaveTool(),
      this.getImageLoadTool(),
      this.getImagePruneTool(),
    ];
  }

  /**
   * Handle image tool execution
   */
  async handleTool(name: string, args: any): Promise<CommandResult> {
    switch (name) {
      case 'image_build':
        return this.handleImageBuild(args);
      case 'image_list':
        return this.handleImageList(args);
      case 'image_pull':
        return this.handleImagePull(args);
      case 'image_push':
        return this.handleImagePush(args);
      case 'image_delete':
        return this.handleImageDelete(args);
      case 'image_tag':
        return this.handleImageTag(args);
      case 'image_inspect':
        return this.handleImageInspect(args);
      case 'image_save':
        return this.handleImageSave(args);
      case 'image_load':
        return this.handleImageLoad(args);
      case 'image_prune':
        return this.handleImagePrune(args);
      default:
        throw new Error(`Unknown image tool: ${name}`);
    }
  }

  private getImageBuildTool(): Tool {
    return {
      name: 'image_build',
      description: 'Build an image from a Dockerfile',
      inputSchema: {
        type: 'object',
        properties: {
          contextDir: {
            type: 'string',
            description: 'Build context directory (default: current directory)',
          },
          dockerfile: {
            type: 'string',
            description: 'Path to Dockerfile (default: Dockerfile)',
          },
          tag: {
            type: 'string',
            description: 'Name and optionally a tag in the "name:tag" format',
          },
          buildArgs: {
            type: 'array',
            items: { type: 'string' },
            description: 'Build-time variables in KEY=VALUE format',
          },
          labels: {
            type: 'array',
            items: { type: 'string' },
            description: 'Set metadata for an image in KEY=VALUE format',
          },
          noCache: {
            type: 'boolean',
            description: 'Do not use cache when building the image',
          },
          target: {
            type: 'string',
            description: 'Set the target build stage to build',
          },
          quiet: {
            type: 'boolean',
            description: 'Suppress the build output and print image ID on success',
          },
          cpus: {
            type: 'string',
            description: 'Number of CPUs to allocate to the build container',
          },
          memory: {
            type: 'string',
            description: 'Memory limit for the build container',
          },
        },
      },
    };
  }

  private getImageListTool(): Tool {
    return {
      name: 'image_list',
      description: 'List container images',
      inputSchema: {
        type: 'object',
        properties: {
          quiet: {
            type: 'boolean',
            description: 'Only show image IDs',
          },
          verbose: {
            type: 'boolean',
            description: 'Show verbose output',
          },
          format: {
            type: 'string',
            enum: ['json', 'table'],
            description: 'Format the output',
          },
        },
      },
    };
  }

  private getImagePullTool(): Tool {
    return {
      name: 'image_pull',
      description: 'Pull an image from a registry',
      inputSchema: {
        type: 'object',
        properties: {
          reference: {
            type: 'string',
            description: 'Image reference (name:tag)',
          },
          platform: {
            type: 'string',
            description: 'Platform in the form os/arch/variant (e.g., linux/arm64)',
          },
          scheme: {
            type: 'string',
            enum: ['http', 'https', 'auto'],
            description: 'Scheme to use when connecting to the registry',
          },
          disableProgress: {
            type: 'boolean',
            description: 'Disable progress bar updates',
          },
        },
        required: ['reference'],
      },
    };
  }

  private getImagePushTool(): Tool {
    return {
      name: 'image_push',
      description: 'Push an image to a registry',
      inputSchema: {
        type: 'object',
        properties: {
          reference: {
            type: 'string',
            description: 'Image reference (name:tag)',
          },
          platform: {
            type: 'string',
            description: 'Platform in the form os/arch/variant (e.g., linux/arm64)',
          },
          scheme: {
            type: 'string',
            enum: ['http', 'https', 'auto'],
            description: 'Scheme to use when connecting to the registry',
          },
          disableProgress: {
            type: 'boolean',
            description: 'Disable progress bar updates',
          },
        },
        required: ['reference'],
      },
    };
  }

  private getImageDeleteTool(): Tool {
    return {
      name: 'image_delete',
      description: 'Remove one or more images',
      inputSchema: {
        type: 'object',
        properties: {
          images: {
            type: 'array',
            items: { type: 'string' },
            description: 'Image names or IDs to delete',
          },
          all: {
            type: 'boolean',
            description: 'Remove all images',
          },
        },
      },
    };
  }

  private getImageTagTool(): Tool {
    return {
      name: 'image_tag',
      description: 'Create a tag that refers to a source image',
      inputSchema: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: 'Source image name or ID',
          },
          target: {
            type: 'string',
            description: 'Target image name and tag',
          },
        },
        required: ['source', 'target'],
      },
    };
  }

  private getImageInspectTool(): Tool {
    return {
      name: 'image_inspect',
      description: 'Display detailed information about one or more images',
      inputSchema: {
        type: 'object',
        properties: {
          images: {
            type: 'array',
            items: { type: 'string' },
            description: 'Image names or IDs',
          },
        },
        required: ['images'],
      },
    };
  }

  private getImageSaveTool(): Tool {
    return {
      name: 'image_save',
      description: 'Save one or more images to a tar archive',
      inputSchema: {
        type: 'object',
        properties: {
          reference: {
            type: 'string',
            description: 'Image reference to save',
          },
          output: {
            type: 'string',
            description: 'Write to a file instead of STDOUT',
          },
          platform: {
            type: 'string',
            description: 'Platform in the form os/arch/variant',
          },
        },
        required: ['reference', 'output'],
      },
    };
  }

  private getImageLoadTool(): Tool {
    return {
      name: 'image_load',
      description: 'Load an image from a tar archive',
      inputSchema: {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            description: 'Read from tar archive file',
          },
        },
        required: ['input'],
      },
    };
  }

  private getImagePruneTool(): Tool {
    return {
      name: 'image_prune',
      description: 'Remove unused images',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }

  private async handleImageBuild(args: any): Promise<CommandResult> {
    const input = ImageBuildInputSchema.parse(args);
    const cmdArgs = ['build'];

    // Add build options
    if (input.dockerfile) cmdArgs.push('--file', input.dockerfile);
    if (input.tag) cmdArgs.push('--tag', input.tag);
    if (input.buildArgs) {
      for (const buildArg of input.buildArgs) {
        cmdArgs.push('--build-arg', buildArg);
      }
    }
    if (input.labels) {
      for (const label of input.labels) {
        cmdArgs.push('--label', label);
      }
    }
    if (input.noCache) cmdArgs.push('--no-cache');
    if (input.target) cmdArgs.push('--target', input.target);
    if (input.quiet) cmdArgs.push('--quiet');
    if (input.cpus) cmdArgs.push('--cpus', input.cpus);
    if (input.memory) cmdArgs.push('--memory', input.memory);

    // Add context directory
    cmdArgs.push(input.contextDir || '.');

    return this.executor.execute(cmdArgs, { timeout: 300000 }); // 5 minute timeout for builds
  }

  private async handleImageList(args: any): Promise<CommandResult> {
    const input = ImageListInputSchema.parse(args);
    const cmdArgs = ['images', 'list'];

    if (input.quiet) cmdArgs.push('--quiet');
    if (input.verbose) cmdArgs.push('--verbose');
    if (input.format) cmdArgs.push('--format', input.format);

    const result = await this.executor.execute(cmdArgs, {
      parseJson: input.format === 'json',
    });

    if (result.success && input.format !== 'json') {
      result.data = this.executor.parseImageList(result.output);
    }

    return result;
  }

  private async handleImagePull(args: any): Promise<CommandResult> {
    const input = ImagePullInputSchema.parse(args);
    const cmdArgs = ['images', 'pull'];

    if (input.platform) cmdArgs.push('--platform', input.platform);
    if (input.scheme) cmdArgs.push('--scheme', input.scheme);
    if (input.disableProgress) cmdArgs.push('--disable-progress-updates');

    cmdArgs.push(input.reference);

    return this.executor.execute(cmdArgs, { timeout: 600000 }); // 10 minute timeout for pulls
  }

  private async handleImagePush(args: any): Promise<CommandResult> {
    const cmdArgs = ['images', 'push'];

    if (args.platform) cmdArgs.push('--platform', args.platform);
    if (args.scheme) cmdArgs.push('--scheme', args.scheme);
    if (args.disableProgress) cmdArgs.push('--disable-progress-updates');

    cmdArgs.push(args.reference);

    return this.executor.execute(cmdArgs, { timeout: 600000 }); // 10 minute timeout for pushes
  }

  private async handleImageDelete(args: any): Promise<CommandResult> {
    const cmdArgs = ['images', 'delete'];

    if (args.all) {
      cmdArgs.push('--all');
    } else if (args.images && args.images.length > 0) {
      cmdArgs.push(...args.images);
    } else {
      throw new Error('Either specify images to delete or use --all flag');
    }

    return this.executor.execute(cmdArgs);
  }

  private async handleImageTag(args: any): Promise<CommandResult> {
    return this.executor.execute(['images', 'tag', args.source, args.target]);
  }

  private async handleImageInspect(args: any): Promise<CommandResult> {
    const cmdArgs = ['images', 'inspect'];
    cmdArgs.push(...args.images);

    return this.executor.execute(cmdArgs, { parseJson: true });
  }

  private async handleImageSave(args: any): Promise<CommandResult> {
    const cmdArgs = ['images', 'save'];

    if (args.platform) cmdArgs.push('--platform', args.platform);
    cmdArgs.push('--output', args.output);
    cmdArgs.push(args.reference);

    return this.executor.execute(cmdArgs, { timeout: 300000 }); // 5 minute timeout
  }

  private async handleImageLoad(args: any): Promise<CommandResult> {
    return this.executor.execute(['images', 'load', '--input', args.input], {
      timeout: 300000, // 5 minute timeout
    });
  }

  private async handleImagePrune(args: any): Promise<CommandResult> {
    return this.executor.execute(['images', 'prune']);
  }
}
