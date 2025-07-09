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
            {
              flag: '-m, --memory <memory>',
              description:
                'Amount of memory in bytes, kilobytes (K), megabytes (M), or gigabytes (G) for the container, with MB granularity (for example, 1024K will result in 1MB being allocated for the container)',
            },
            { flag: '-d, --detach', description: 'Run the container and detach from the process' },
            { flag: '--entrypoint <entrypoint>', description: 'Override the entrypoint of the image' },
            {
              flag: '--mount <mount>',
              description: 'Add a mount to the container (type=<>,source=<>,target=<>,readonly)',
            },
            {
              flag: '--publish-socket <publish-socket>',
              description: 'Publish a socket from container to host (format: host_path:container_path)',
            },
            { flag: '--tmpfs <tmpfs>', description: 'Add a tmpfs mount to the container at the given path' },
            {
              flag: '--name <n>',
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
            { flag: '--network <network>', description: 'Attach the container to a network' },
            { flag: '--cidfile <cidfile>', description: 'Write the container ID to the path provided' },
            { flag: '--no-dns', description: 'Do not configure DNS in the container' },
            { flag: '--dns <dns>', description: 'DNS nameserver IP address' },
            { flag: '--dns-domain <dns-domain>', description: 'Default DNS domain' },
            { flag: '--dns-search <dns-search>', description: 'DNS search domains' },
            { flag: '--dns-option <dns-option>', description: 'DNS options' },
            { flag: '-l, --label <label>', description: 'Add a key=value label to the container' },
            {
              flag: '--scheme <scheme>',
              description: 'Scheme to use when connecting to the container registry. One of (http, https, auto)',
              defaultValue: 'auto',
            },
          ],
        },
        {
          name: 'delete',
          aliases: ['rm'],
          description: 'Delete one or more containers',
          usage: 'container delete [--force] [--all] [--debug] [<container-ids> ...]',
          options: [
            { flag: '-f, --force', description: 'Force the removal of one or more running containers' },
            { flag: '-a, --all', description: 'Remove all containers' },
          ],
        },
        {
          name: 'exec',
          description: 'Run a new command in a running container',
          usage:
            'container exec [--cwd <cwd>] [--env <env> ...] [--env-file <env-file> ...] [--uid <uid>] [--gid <gid>] [--interactive] [--tty] [--user <user>] [--debug] <container-id> <arguments> ...',
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
          usage: 'container inspect [--debug] <containers> ...',
          options: [],
        },
        {
          name: 'kill',
          description: 'Kill one or more running containers',
          usage: 'container kill [--signal <signal>] [--all] [<container-ids> ...] [--debug]',
          options: [
            { flag: '-s, --signal <signal>', description: 'Signal to send the container(s)', defaultValue: 'KILL' },
            { flag: '-a, --all', description: 'Kill all running containers' },
          ],
        },
        {
          name: 'list',
          aliases: ['ls'],
          description: 'List containers',
          usage: 'container list [--all] [--quiet] [--format <format>] [--debug]',
          options: [
            { flag: '-a, --all', description: 'Show stopped containers as well' },
            { flag: '-q, --quiet', description: 'Only output the container ID' },
            {
              flag: '--format <format>',
              description: 'Format of the output (values: json, table)',
              defaultValue: 'table',
            },
          ],
        },
        {
          name: 'logs',
          description: 'Fetch container stdio or boot logs',
          usage: 'container logs [--debug] [--follow] [--boot] [-n <n>] <container>',
          options: [
            { flag: '-f, --follow', description: 'Follow log output' },
            { flag: '--boot', description: 'Display the boot log for the container instead of stdio' },
            {
              flag: '-n <n>',
              description:
                'Number of lines to show from the end of the logs. If not provided this will print all of the logs',
            },
          ],
        },
        {
          name: 'run',
          description: 'Run a container',
          usage: 'container run [<options>] <image> [<arguments> ...]',
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
            {
              flag: '-m, --memory <memory>',
              description:
                'Amount of memory in bytes, kilobytes (K), megabytes (M), or gigabytes (G) for the container, with MB granularity (for example, 1024K will result in 1MB being allocated for the container)',
            },
            { flag: '-d, --detach', description: 'Run the container and detach from the process' },
            { flag: '--entrypoint <entrypoint>', description: 'Override the entrypoint of the image' },
            {
              flag: '--mount <mount>',
              description: 'Add a mount to the container (type=<>,source=<>,target=<>,readonly)',
            },
            {
              flag: '--publish-socket <publish-socket>',
              description: 'Publish a socket from container to host (format: host_path:container_path)',
            },
            { flag: '--tmpfs <tmpfs>', description: 'Add a tmpfs mount to the container at the given path' },
            {
              flag: '--name <n>',
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
            { flag: '--network <network>', description: 'Attach the container to a network' },
            { flag: '--cidfile <cidfile>', description: 'Write the container ID to the path provided' },
            { flag: '--no-dns', description: 'Do not configure DNS in the container' },
            { flag: '--dns <dns>', description: 'DNS nameserver IP address' },
            { flag: '--dns-domain <dns-domain>', description: 'Default DNS domain' },
            { flag: '--dns-search <dns-search>', description: 'DNS search domains' },
            { flag: '--dns-option <dns-option>', description: 'DNS options' },
            { flag: '-l, --label <label>', description: 'Add a key=value label to the container' },
            {
              flag: '--scheme <scheme>',
              description: 'Scheme to use when connecting to the container registry. One of (http, https, auto)',
              defaultValue: 'auto',
            },
            { flag: '--disable-progress-updates', description: 'Disable progress bar updates' },
          ],
        },
        {
          name: 'start',
          description: 'Start a container',
          usage: 'container start [--attach] [--interactive] [--debug] <container-id>',
          options: [
            { flag: '-a, --attach', description: 'Attach STDOUT/STDERR' },
            { flag: '-i, --interactive', description: "Attach container's STDIN" },
          ],
        },
        {
          name: 'stop',
          description: 'Stop one or more running containers',
          usage: 'container stop [--all] [--signal <signal>] [--time <time>] [<container-ids> ...] [--debug]',
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
              description:
                'Amount of memory in bytes, kilobytes (K), megabytes (M), or gigabytes (G) for the container, with MB granularity (for example, 1024K will result in 1MB being allocated for the container)',
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
            { flag: '--arch <value>', description: 'set the build architecture', defaultValue: 'arm64' },
            { flag: '--os <value>', description: 'set the build os', defaultValue: 'linux' },
            { flag: '--progress <type>', description: 'Progress type - one of [auto|plain|tty]', defaultValue: 'auto' },
            { flag: '--vsock-port <port>', description: 'Builder-shim vsock port', defaultValue: '8088' },
            { flag: '-t, --tag <n>', description: 'Name for the built image' },
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
              usage: 'container images inspect [--debug] <images> ...',
              options: [],
            },
            {
              name: 'list',
              aliases: ['ls'],
              description: 'List images',
              usage: 'container images list [--quiet] [--verbose] [--format <format>] [--debug]',
              options: [
                { flag: '-q, --quiet', description: 'Only output the image name' },
                { flag: '-v, --verbose', description: 'Verbose output' },
                {
                  flag: '--format <format>',
                  description: 'Format of the output (values: json, table)',
                  defaultValue: 'table',
                },
              ],
            },
            {
              name: 'load',
              description: 'Load images from an OCI compatible tar archive',
              usage: 'container images load [--debug] --input <input>',
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
              usage: 'container images prune [--debug]',
              options: [],
            },
            {
              name: 'pull',
              description: 'Pull an image',
              usage:
                'container images pull [--debug] [--scheme <scheme>] [--disable-progress-updates] [--platform <platform>] <reference>',
              options: [
                {
                  flag: '--scheme <scheme>',
                  description: 'Scheme to use when connecting to the container registry. One of (http, https, auto)',
                  defaultValue: 'auto',
                },
                { flag: '--disable-progress-updates', description: 'Disable progress bar updates' },
                {
                  flag: '--platform <platform>',
                  description: "Platform string in the form 'os/arch/variant'. Example 'linux/arm64/v8', 'linux/amd64'",
                },
              ],
            },
            {
              name: 'push',
              description: 'Push an image',
              usage:
                'container images push [--debug] [--scheme <scheme>] [--disable-progress-updates] [--platform <platform>] <reference>',
              options: [
                {
                  flag: '--scheme <scheme>',
                  description: 'Scheme to use when connecting to the container registry. One of (http, https, auto)',
                  defaultValue: 'auto',
                },
                { flag: '--disable-progress-updates', description: 'Disable progress bar updates' },
                {
                  flag: '--platform <platform>',
                  description: "Platform string in the form 'os/arch/variant'. Example 'linux/arm64/v8', 'linux/amd64'",
                },
              ],
            },
            {
              name: 'delete',
              aliases: ['rm'],
              description: 'Remove one or more images',
              usage: 'container images delete [--all] [<images> ...] [--debug]',
              options: [{ flag: '-a, --all', description: 'Remove all images' }],
            },
            {
              name: 'save',
              description: 'Save an image as an OCI compatible tar archive',
              usage: 'container images save [--debug] [--platform <platform>] --output <o> <reference>',
              options: [
                {
                  flag: '--platform <platform>',
                  description: "Platform string in the form 'os/arch/variant'. Example 'linux/arm64/v8', 'linux/amd64'",
                },
                { flag: '-o, --output <o>', description: 'Path to save the image tar archive', required: true },
              ],
            },
            {
              name: 'tag',
              description: 'Tag an image',
              usage: 'container images tag <source> <target> [--debug]',
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
              usage: 'container registry login [--username <username>] [--password-stdin] <server> [--scheme <scheme>]',
              options: [
                { flag: '-u, --username <username>', description: 'Username' },
                { flag: '--password-stdin', description: 'Take the password from stdin' },
                {
                  flag: '--scheme <scheme>',
                  description: 'Scheme to use when connecting to the container registry. One of (http, https, auto)',
                  defaultValue: 'auto',
                },
              ],
            },
            {
              name: 'logout',
              description: 'Log out from a registry',
              usage: 'container registry logout <registry> [--debug]',
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
                  usage: 'container registry default set [--debug] [--scheme <scheme>] <host>',
                  options: [
                    {
                      flag: '--scheme <scheme>',
                      description:
                        'Scheme to use when connecting to the container registry. One of (http, https, auto)',
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
              usage: 'builder start [command options]',
              options: [
                {
                  flag: '-c, --cpus <cpus>',
                  description: 'Number of CPUs to allocate to the container',
                  defaultValue: '2',
                },
                {
                  flag: '-m, --memory <memory>',
                  description:
                    'Amount of memory in bytes, kilobytes (K), megabytes (M), or gigabytes (G) for the container, with MB granularity (for example, 1024K will result in 1MB being allocated for the container)',
                  defaultValue: '2048MB',
                },
              ],
            },
            {
              name: 'status',
              description: 'Print builder status',
              usage: 'builder status [command options]',
              options: [{ flag: '--json', description: 'Display detailed status in json format' }],
            },
            {
              name: 'stop',
              description: 'Stop builder',
              usage: 'builder stop',
              options: [],
            },
            {
              name: 'delete',
              description: 'Delete builder',
              usage: 'builder delete [command options]',
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
              usage: 'container system logs [--debug] [--last <last>] [--follow]',
              options: [
                {
                  flag: '--last <last>',
                  description:
                    'Fetch logs starting from the specified time period (minus the current time); supported formats: m, h, d',
                  defaultValue: '5m',
                },
                { flag: '-f, --follow', description: 'Follow log output' },
              ],
            },
            {
              name: 'start',
              description: 'Start container services',
              usage:
                'container system start [--path <path>] [--debug] [--enable-kernel-install] [--disable-kernel-install]',
              options: [
                {
                  flag: '-p, --path <path>',
                  description: 'Path to the container-apiserver binary',
                  defaultValue: '/usr/local/bin/container',
                },
                { flag: '--debug', description: 'Enable debug logging for the runtime daemon' },
                {
                  flag: '--enable-kernel-install/--disable-kernel-install',
                  description:
                    'Specify whether the default kernel should be installed or not. The default behavior is to prompt the user for a response',
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
              name: 'status',
              description: 'Show the status of container services',
              usage: 'container system status [--prefix <prefix>]',
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
    {
      title: 'Check system status',
      command: 'container system status',
      description: 'Show the status of container services',
    },
    {
      title: 'Create a network volume',
      command: 'container run -v /host/path:/container/path myimage',
      description: 'Mount a host directory into the container',
    },
  ],
};
