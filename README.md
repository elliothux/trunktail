# Trunktail

A container platform for macOS - native, fast, and easy to use.

## Project Structure

This is a monorepo containing:

- **`apps/trunktail/`** - Main Trunktail application (Tauri + React)
- **`apps/docs/`** - Documentation site (Astro Starlight)
- **`packages/commands/`** - Command definitions and types

## Development

### Prerequisites

- [Bun](https://bun.sh/) - Package manager and runtime
- [Rust](https://rustup.rs/) - For Tauri backend
- [Swift](https://swift.org/) - For macOS native bridge
- macOS 10.15+ - Development target

### Quick Start

```bash
# Install dependencies
bun install

# Start the main application
bun run dev

# Start with Tauri (native app)
bun run dev:tauri

# Start documentation site
bun run dev:docs
```

### Available Scripts

- `bun run dev` - Start Trunktail web development server
- `bun run dev:tauri` - Start Trunktail native app development
- `bun run dev:docs` - Start documentation development server
- `bun run build` - Build Trunktail web application
- `bun run build:tauri` - Build Trunktail native application
- `bun run build:docs` - Build documentation site
- `bun run preview:docs` - Preview built documentation
- `bun run lint:fix` - Fix linting issues
- `bun run format:fix` - Format code with Prettier
- `bun run format:swift` - Format Swift code

## Features

### Container Management

- Create, run, stop, and manage containers
- Interactive shell sessions
- Resource limits (CPU, memory)
- Volume mounting and networking

### Image Operations

- Build images from Dockerfiles
- Pull and push to registries
- Local image management
- Multi-architecture support

### Registry Integration

- Authentication with container registries
- Default registry configuration
- Multi-registry support

### System Integration

- Native macOS integration
- DNS management for containers
- System service management
- Comprehensive logging

## Architecture

- **Frontend**: React + TanStack Router + HeroUI
- **Backend**: Tauri (Rust) + Swift native bridge
- **Documentation**: Astro Starlight
- **Package Manager**: Bun
- **Styling**: Tailwind CSS

## Documentation

Visit the [documentation site](./apps/docs/) for complete guides and API reference:

- **Getting Started**: Installation and setup
- **Command Reference**: Complete command documentation
- **Architecture**: System design and components

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `bun run lint:fix`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

[MIT License](LICENSE) - see the LICENSE file for details.

## Support

- 📖 [Documentation](./apps/docs/)
- 🐛 [Issue Tracker](https://github.com/trunktail/trunktail/issues)
- 💬 [Discussions](https://github.com/trunktail/trunktail/discussions)
