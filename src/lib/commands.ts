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

export interface CommandDocumentation {
  overview: string;
  usage: string;
  globalOptions: CommandOption[];
  categories: CommandCategory[];
  commonExamples: Array<{
    title: string;
    command: string;
    description?: string;
  }>;
}

export const containerCommands: CommandDocumentation = {
  overview: 'A container platform for macOS',
  usage: 'container [--debug] <subcommand>',
  globalOptions: [
    {
      flag: '--debug',
      description: 'Enable debug output [environment: CONTAINER_DEBUG]',
    },
    {
      flag: '--version',
      description: 'Show the version',
    },
    {
      flag: '-h, --help',
      description: 'Show help information',
    },
  ],
  categories: [
    {
      name: 'Container',
      description: 'Commands for managing containers',
      commands: [
        {
          name: 'create',
          description: 'Create a new container',
          usage: 'container create [<options>] <image> [<arguments> ...]',
          options: [
            { flag: '-w, --cwd, --workdir <cwd>', description: 'Current working directory for the container' },
            { flag: '-e, --env <env>', description: 'Set environment variables' },
            { flag: '--env-file <env-file>', description: 'Read in a file of environment variables' },
            { flag: '--uid <uid>', description: 'Set the uid for the process' },
            { flag: '--gid <gid>', description: 'Set the gid for the process' },
            { flag: '-i, --interactive', description: 'Keep Stdin open even if not attached' },
            { flag: '-t, --tty', description: 'Open a tty with the process' },
            { flag: '-u, --user <user>', description: 'Set the user for the process' },
            { flag: '-c, --cpus <cpus>', description: 'Number of CPUs to allocate to the container' },
            { flag: '-m, --memory <memory>', description: 'Amount of memory (bytes, K, M, G)' },
            { flag: '-d, --detach', description: 'Run the container and detach from the process' },
            { flag: '--entrypoint <entrypoint>', description: 'Override the entrypoint of the image' },
            {
              flag: '--mount <mount>',
              description: 'Add a mount to the container (type=<>,source=<>,target=<>,readonly)',
            },
            { flag: '--tmpfs <tmpfs>', description: 'Add a tmpfs mount to the container at the given path' },
            {
              flag: '--name <name>',
              description: 'Assign a name to the container. If excluded will be a generated UUID',
            },
            { flag: '--remove, --rm', description: 'Remove the container after it stops' },
            {
              flag: '--os <os>',
              description: 'Set OS if image can target multiple operating systems',
              defaultValue: 'linux',
            },
            {
              flag: '-a, --arch <arch>',
              description: 'Set arch if image can target multiple architectures',
              defaultValue: 'arm64',
            },
            { flag: '-v, --volume <volume>', description: 'Bind mount a volume into the container' },
            { flag: '-k, --kernel <kernel>', description: 'Set a custom kernel path' },
            { flag: '--cidfile <cidfile>', description: 'Write the container ID to the path provided' },
            { flag: '--no-dns', description: 'Do not configure DNS in the container' },
            { flag: '--dns <dns>', description: 'DNS nameserver IP address' },
            { flag: '--dns-domain <dns-domain>', description: 'Default DNS domain' },
            { flag: '--dns-search <dns-search>', description: 'DNS search domains' },
            { flag: '--dns-option <dns-option>', description: 'DNS options' },
            { flag: '-l, --label <label>', description: 'Add a key=value label to the container' },
            { flag: '--disable-progress-updates', description: 'Disable progress bar updates' },
            {
              flag: '--scheme <scheme>',
              description: 'Scheme to use when connecting to the container registry (http, https, auto)',
              defaultValue: 'auto',
            },
          ],
        },
        {
          name: 'delete',
          aliases: ['rm'],
          description: 'Delete one or more containers',
          usage: 'container delete [--force] [--all] [<container-ids> ...]',
          options: [
            { flag: '-f, --force', description: 'Force the removal of one or more running containers' },
            { flag: '-a, --all', description: 'Remove all containers' },
          ],
        },
        {
          name: 'exec',
          description: 'Run a new command in a running container',
          usage: 'container exec [options] <container-id> <arguments> ...',
          options: [
            { flag: '-w, --cwd, --workdir <cwd>', description: 'Current working directory for the container' },
            { flag: '-e, --env <env>', description: 'Set environment variables' },
            { flag: '--env-file <env-file>', description: 'Read in a file of environment variables' },
            { flag: '--uid <uid>', description: 'Set the uid for the process' },
            { flag: '--gid <gid>', description: 'Set the gid for the process' },
            { flag: '-i, --interactive', description: 'Keep Stdin open even if not attached' },
            { flag: '-t, --tty', description: 'Open a tty with the process' },
            { flag: '-u, --user <user>', description: 'Set the user for the process' },
          ],
        },
        {
          name: 'inspect',
          description: 'Display information about one or more containers',
          usage: 'container inspect <containers> ...',
          options: [],
        },
        {
          name: 'kill',
          description: 'Kill one or more running containers',
          usage: 'container kill [--signal <signal>] [--all] [<container-ids> ...]',
          options: [
            { flag: '-s, --signal <signal>', description: 'Signal to send the container(s)', defaultValue: 'KILL' },
            { flag: '-a, --all', description: 'Kill all running containers' },
          ],
        },
        {
          name: 'list',
          aliases: ['ls'],
          description: 'List containers',
          usage: 'container list [--all] [--quiet] [--format <format>]',
          options: [
            { flag: '-a, --all', description: 'Show stopped containers as well' },
            { flag: '-q, --quiet', description: 'Only output the container ID' },
            { flag: '--format <format>', description: 'Format of the output (json, table)', defaultValue: 'table' },
          ],
        },
        {
          name: 'logs',
          description: 'Fetch container stdio or boot logs',
          usage: 'container logs [--follow] [--boot] [-n <n>] <container>',
          options: [
            { flag: '-f, --follow', description: 'Follow log output' },
            { flag: '--boot', description: 'Display the boot log for the container instead of stdio' },
            { flag: '-n <n>', description: 'Number of lines to show from the end of the logs' },
          ],
        },
        {
          name: 'run',
          description: 'Run a container',
          usage: 'container run [<options>] <image> [<arguments> ...]',
          options: [
            { flag: 'Same as create command', description: 'All options from the create command are available' },
          ],
        },
        {
          name: 'start',
          description: 'Start a container',
          usage: 'container start [--attach] [--interactive] <container-id>',
          options: [
            { flag: '-a, --attach', description: 'Attach STDOUT/STDERR' },
            { flag: '-i, --interactive', description: "Attach container's STDIN" },
          ],
        },
        {
          name: 'stop',
          description: 'Stop one or more running containers',
          usage: 'container stop [--all] [--signal <signal>] [--time <time>] [<container-ids> ...]',
          options: [
            { flag: '-a, --all', description: 'Stop all running containers' },
            { flag: '-s, --signal <signal>', description: 'Signal to send the container(s)', defaultValue: 'SIGTERM' },
            {
              flag: '-t, --time <time>',
              description: 'Seconds to wait before killing the container(s)',
              defaultValue: '5',
            },
          ],
        },
      ],
    },
    {
      name: 'Image',
      description: 'Commands for managing container images',
      commands: [
        {
          name: 'build',
          description: 'Build an image from a Dockerfile',
          usage: 'container build [<options>] [<context-dir>]',
          options: [
            {
              flag: '-c, --cpus <cpus>',
              description: 'Number of CPUs to allocate to the container',
              defaultValue: '2',
            },
            {
              flag: '-m, --memory <memory>',
              description: 'Amount of memory for the container',
              defaultValue: '2048MB',
            },
            { flag: '--build-arg <key=val>', description: 'Set build-time variables' },
            { flag: '-f, --file <path>', description: 'Path to Dockerfile', defaultValue: 'Dockerfile' },
            { flag: '-l, --label <key=val>', description: 'Set a label' },
            { flag: '--no-cache', description: 'Do not use cache' },
            {
              flag: '-o, --output <value>',
              description: 'Output configuration for the build',
              defaultValue: 'type=oci',
            },
            { flag: '--arch <value>', description: 'Set the build architecture', defaultValue: 'arm64' },
            { flag: '--os <value>', description: 'Set the build os', defaultValue: 'linux' },
            { flag: '--progress <type>', description: 'Progress type - one of [auto|plain|tty]', defaultValue: 'auto' },
            { flag: '--vsock-port <port>', description: 'Builder-shim vsock port', defaultValue: '8088' },
            { flag: '-t, --tag <name>', description: 'Name for the built image' },
            { flag: '--target <stage>', description: 'Set the target build stage' },
            { flag: '-q, --quiet', description: 'Suppress build output' },
          ],
        },
        {
          name: 'images',
          aliases: ['image', 'i'],
          description: 'Manage images',
          usage: 'container images <subcommand>',
          options: [],
          subcommands: [
            {
              name: 'inspect',
              description: 'Display information about one or more images',
              usage: 'container images inspect <images> ...',
              options: [],
            },
            {
              name: 'list',
              aliases: ['ls'],
              description: 'List images',
              usage: 'container images list [--quiet] [--verbose] [--format <format>]',
              options: [
                { flag: '-q, --quiet', description: 'Only output the image name' },
                { flag: '-v, --verbose', description: 'Verbose output' },
                { flag: '--format <format>', description: 'Format of the output (json, table)', defaultValue: 'table' },
              ],
            },
            {
              name: 'load',
              description: 'Load images from an OCI compatible tar archive',
              usage: 'container images load --input <input>',
              options: [
                {
                  flag: '-i, --input <input>',
                  description: 'Path to the tar archive to load images from',
                  required: true,
                },
              ],
            },
            {
              name: 'prune',
              description: 'Remove unreferenced and dangling images',
              usage: 'container images prune',
              options: [],
            },
            {
              name: 'pull',
              description: 'Pull an image',
              usage: 'container images pull [--scheme <scheme>] [--platform <platform>] <reference>',
              options: [
                {
                  flag: '--scheme <scheme>',
                  description: 'Scheme to use when connecting to the container registry',
                  defaultValue: 'auto',
                },
                { flag: '--platform <platform>', description: "Platform string in the form 'os/arch/variant'" },
              ],
            },
            {
              name: 'push',
              description: 'Push an image',
              usage: 'container images push [--scheme <scheme>] [--platform <platform>] <reference>',
              options: [
                {
                  flag: '--scheme <scheme>',
                  description: 'Scheme to use when connecting to the container registry',
                  defaultValue: 'auto',
                },
                { flag: '--platform <platform>', description: "Platform string in the form 'os/arch/variant'" },
              ],
            },
            {
              name: 'delete',
              aliases: ['rm'],
              description: 'Remove one or more images',
              usage: 'container images delete [--all] [<images> ...]',
              options: [{ flag: '-a, --all', description: 'Remove all images' }],
            },
            {
              name: 'save',
              description: 'Save an image as an OCI compatible tar archive',
              usage: 'container images save --output <output> <reference>',
              options: [
                { flag: '--platform <platform>', description: "Platform string in the form 'os/arch/variant'" },
                { flag: '-o, --output <output>', description: 'Path to save the image tar archive', required: true },
              ],
            },
            {
              name: 'tag',
              description: 'Tag an image',
              usage: 'container images tag <source> <target>',
              options: [],
            },
          ],
        },
      ],
    },
    {
      name: 'Registry',
      description: 'Commands for managing container registries',
      commands: [
        {
          name: 'registry',
          aliases: ['r'],
          description: 'Manage registry configurations',
          usage: 'container registry <subcommand>',
          options: [],
          subcommands: [
            {
              name: 'login',
              description: 'Login to a registry',
              usage: 'container registry login [--username <username>] [--password-stdin] <server>',
              options: [
                { flag: '-u, --username <username>', description: 'Username' },
                { flag: '--password-stdin', description: 'Take the password from stdin' },
                {
                  flag: '--scheme <scheme>',
                  description: 'Scheme to use when connecting to the container registry',
                  defaultValue: 'auto',
                },
              ],
            },
            {
              name: 'logout',
              description: 'Log out from a registry',
              usage: 'container registry logout <registry>',
              options: [],
            },
            {
              name: 'default',
              description: 'Manage the default image registry',
              usage: 'container registry default <subcommand>',
              options: [],
              subcommands: [
                {
                  name: 'set',
                  description: 'Set the default registry',
                  usage: 'container registry default set [--scheme <scheme>] <host>',
                  options: [
                    {
                      flag: '--scheme <scheme>',
                      description: 'Scheme to use when connecting to the container registry',
                      defaultValue: 'auto',
                    },
                  ],
                },
                {
                  name: 'unset',
                  aliases: ['clear'],
                  description: 'Unset the default registry',
                  usage: 'container registry default unset',
                  options: [],
                },
                {
                  name: 'inspect',
                  description: 'Display the default registry domain',
                  usage: 'container registry default inspect',
                  options: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'System',
      description: 'Commands for managing system components',
      commands: [
        {
          name: 'builder',
          description: 'Manage an image builder instance',
          usage: 'container builder <subcommand>',
          options: [],
          subcommands: [
            {
              name: 'start',
              description: 'Start builder',
              usage: 'container builder start [--cpus <cpus>] [--memory <memory>]',
              options: [
                {
                  flag: '-c, --cpus <cpus>',
                  description: 'Number of CPUs to allocate to the container',
                  defaultValue: '2',
                },
                {
                  flag: '-m, --memory <memory>',
                  description: 'Amount of memory for the container',
                  defaultValue: '2048MB',
                },
              ],
            },
            {
              name: 'status',
              description: 'Print builder status',
              usage: 'container builder status [--json]',
              options: [{ flag: '--json', description: 'Display detailed status in json format' }],
            },
            {
              name: 'stop',
              description: 'Stop builder',
              usage: 'container builder stop',
              options: [],
            },
            {
              name: 'delete',
              description: 'Delete builder',
              usage: 'container builder delete [--force]',
              options: [{ flag: '-f, --force', description: 'Force delete builder even if it is running' }],
            },
          ],
        },
        {
          name: 'system',
          aliases: ['s'],
          description: 'Manage system components',
          usage: 'container system <subcommand>',
          options: [],
          subcommands: [
            {
              name: 'dns',
              description: 'Manage local DNS domains',
              usage: 'container system dns <subcommand>',
              options: [],
              subcommands: [
                {
                  name: 'create',
                  description: 'Create a local DNS domain for containers (must run as an administrator)',
                  usage: 'container system dns create <domain-name>',
                  options: [],
                },
                {
                  name: 'delete',
                  aliases: ['rm'],
                  description: 'Delete a local DNS domain (must run as an administrator)',
                  usage: 'container system dns delete <domain-name>',
                  options: [],
                },
                {
                  name: 'list',
                  aliases: ['ls'],
                  description: 'List local DNS domains',
                  usage: 'container system dns list',
                  options: [],
                },
                {
                  name: 'default',
                  description: 'Set or unset the default local DNS domain',
                  usage: 'container system dns default <subcommand>',
                  options: [],
                },
              ],
            },
            {
              name: 'logs',
              description: 'Fetch system logs for container services',
              usage: 'container system logs [--last <last>] [--follow]',
              options: [
                {
                  flag: '--last <last>',
                  description: 'Fetch logs starting from the specified time period',
                  defaultValue: '5m',
                },
                { flag: '-f, --follow', description: 'Follow log output' },
              ],
            },
            {
              name: 'restart',
              description: 'Restart API server for container',
              usage: 'container system restart',
              options: [],
            },
            {
              name: 'start',
              description: 'Start container services',
              usage: 'container system start [--path <path>] [--enable-kernel-install]',
              options: [
                {
                  flag: '-p, --path <path>',
                  description: 'Path to the container-apiserver binary',
                  defaultValue: '/usr/local/bin/container',
                },
                { flag: '--debug', description: 'Enable debug logging for the runtime daemon' },
                {
                  flag: '--enable-kernel-install/--disable-kernel-install',
                  description: 'Specify whether the default kernel should be installed or not',
                },
              ],
            },
            {
              name: 'stop',
              description: 'Stop all container services',
              usage: 'container system stop [--prefix <prefix>]',
              options: [
                {
                  flag: '-p, --prefix <prefix>',
                  description: 'Launchd prefix for container services',
                  defaultValue: 'com.apple.container.',
                },
              ],
            },
            {
              name: 'kernel',
              description: 'Manage the default kernel configuration',
              usage: 'container system kernel <subcommand>',
              options: [],
            },
          ],
        },
      ],
    },
  ],
  commonExamples: [
    {
      title: 'Run a container',
      command: 'container run -it ubuntu:latest bash',
      description: 'Run an interactive Ubuntu container with bash shell',
    },
    {
      title: 'List all containers',
      command: 'container list --all',
      description: 'Show both running and stopped containers',
    },
    {
      title: 'Build an image',
      command: 'container build -t myapp:latest .',
      description: 'Build an image from current directory with tag',
    },
    {
      title: 'Pull an image',
      command: 'container images pull nginx:latest',
      description: 'Download the latest nginx image',
    },
    {
      title: 'View container logs',
      command: 'container logs --follow mycontainer',
      description: 'Follow the logs of a running container',
    },
    {
      title: 'Execute command in container',
      command: 'container exec -it mycontainer bash',
      description: 'Execute an interactive bash session in running container',
    },
    {
      title: 'Stop all containers',
      command: 'container stop --all',
      description: 'Stop all running containers',
    },
    {
      title: 'Remove unused images',
      command: 'container images prune',
      description: 'Clean up dangling and unreferenced images',
    },
  ],
};
