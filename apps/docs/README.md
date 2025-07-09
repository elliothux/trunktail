# Container CLI Documentation

This is the documentation site for the Container CLI tool, built with [Astro Starlight](https://starlight.astro.build/).

## Features

- **Auto-generated Command Documentation**: Commands are automatically generated from the `@trunktail/commands` package
- **Interactive Navigation**: Beautiful sidebar navigation with command hierarchy
- **Modern UI**: Built with Astro Starlight for fast, accessible documentation
- **Developer-friendly**: Easy to update and maintain

## Project Structure

```
apps/docs/
├── scripts/
│   └── generate-docs.ts          # Generates documentation from command data
├── src/
│   └── content/
│       └── docs/
│           ├── commands/         # Auto-generated command documentation
│           │   ├── index.mdx     # Command overview
│           │   ├── container.mdx # Container commands
│           │   ├── image.mdx     # Image commands
│           │   ├── registry.mdx  # Registry commands
│           │   └── system.mdx    # System commands
│           ├── guides/           # Manual guides
│           └── reference/        # Reference documentation
├── astro.config.mjs             # Astro configuration
└── package.json
```

## Development

### Prerequisites

- Bun (package manager)
- Node.js 18+

### Getting Started

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Generate command documentation:**

   ```bash
   bun run generate-docs
   ```

3. **Start development server:**

   ```bash
   bun run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:4321`

### Updating Command Documentation

The command documentation is automatically generated from the `@trunktail/commands` package. When commands are updated:

1. **Update the command data** in `packages/commands/src/index.ts`
2. **Regenerate documentation:**
   ```bash
   bun run generate-docs
   ```
3. **Review changes** in the development server

### Build for Production

```bash
bun run build
```

The built site will be in the `dist/` directory.

## Documentation Structure

### Command Documentation

The command documentation follows a hierarchical structure based on the original `commands.tsx` component:

- **Overview Page** (`/commands`): Lists all command categories with global options and common examples
- **Category Pages** (`/commands/{category}`): Detailed documentation for each command category
  - Container Commands: `create`, `delete`, `exec`, `inspect`, `kill`, `list`, `logs`, `run`, `start`, `stop`
  - Image Commands: `build`, `images` (with subcommands)
  - Registry Commands: `registry` (with subcommands)
  - System Commands: `builder`, `system` (with subcommands)

### Features of Generated Documentation

- **Command Descriptions**: Clear explanations of what each command does
- **Usage Examples**: Proper bash syntax highlighting
- **Option Details**: Complete flag documentation with defaults and requirements
- **Alias Support**: Alternative command names are clearly displayed
- **Subcommand Hierarchy**: Nested commands are properly organized
- **Cross-references**: Internal links between related commands

## Customization

### Adding New Pages

Create new `.mdx` files in `src/content/docs/` and update the sidebar in `astro.config.mjs`.

### Styling

Starlight provides extensive theming options. See the [Starlight documentation](https://starlight.astro.build/guides/customization/) for details.

### Configuration

Edit `astro.config.mjs` to modify:

- Site title and description
- Navigation structure
- Social links
- Theme settings

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run generate-docs` - Generate command documentation from source

## Contributing

1. Make changes to command data in `packages/commands/`
2. Run `bun run generate-docs` to update documentation
3. Test changes with `bun run dev`
4. Submit pull request

The documentation automatically reflects changes in the command structure, ensuring it stays up-to-date with the CLI implementation.
