import type { Command, CommandCategory, CommandOption } from '@trunktail/commands';
import { containerCommands } from '@trunktail/commands';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

const docsDir = join(process.cwd(), 'src', 'content', 'docs');
const commandsDir = join(docsDir, 'commands');

// Clean up existing commands directory
if (existsSync(commandsDir)) {
  rmSync(commandsDir, { recursive: true, force: true });
  console.log('Cleaned up existing commands directory');
}

// Ensure directories exist
mkdirSync(commandsDir, { recursive: true });

function escapeMarkdownText(text: string): string {
  // Escape angle brackets that could be interpreted as JSX in MDX (only in regular text, not in code)
  return text.replace(/</g, '\\<').replace(/>/g, '\\>');
}

function generateOptionsList(options: CommandOption[]): string {
  if (options.length === 0) return '';

  return options
    .map((option) => {
      // Don't escape inside backticks - code blocks handle angle brackets fine
      let line = `- \`${option.flag}\`${option.required ? ' **(required)**' : ''}`;
      line += ` - ${escapeMarkdownText(option.description)}`;
      if (option.defaultValue) {
        line += ` (default: \`${option.defaultValue}\`)`;
      }
      return line;
    })
    .join('\n');
}

function generateCommandMarkdown(command: Command, level: number = 3): string {
  const heading = '#'.repeat(level);
  let content = `${heading} ${command.name}\n\n`;

  if (command.aliases && command.aliases.length > 0) {
    content += `**Aliases:** ${command.aliases.map((alias) => `\`${alias}\``).join(', ')}\n\n`;
  }

  content += `${escapeMarkdownText(command.description)}\n\n`;
  // Don't escape in code blocks - they handle angle brackets correctly
  content += `**Usage:**\n\`\`\`bash\n${command.usage}\n\`\`\`\n\n`;

  if (command.options.length > 0) {
    content += `**Options:**\n\n${generateOptionsList(command.options)}\n\n`;
  }

  if (command.examples && command.examples.length > 0) {
    content += `**Examples:**\n\n`;
    command.examples.forEach((example) => {
      // Don't escape in code blocks
      content += `\`\`\`bash\n${example}\n\`\`\`\n\n`;
    });
  }

  if (command.subcommands && command.subcommands.length > 0) {
    content += `${heading}# Subcommands\n\n`;
    command.subcommands.forEach((subcommand) => {
      content += generateCommandMarkdown(subcommand, level + 1);
    });
  }

  return content;
}

function generateCategoryPage(category: CommandCategory): void {
  const fileName = category.name.toLowerCase().replace(/\s+/g, '-');
  const filePath = join(commandsDir, `${fileName}.mdx`);

  let content = `---
title: ${category.name} Commands
description: ${escapeMarkdownText(category.description)}
---

${escapeMarkdownText(category.description)}

`;

  category.commands.forEach((command) => {
    content += generateCommandMarkdown(command);
  });

  writeFileSync(filePath, content);
  console.log(`Generated: ${filePath}`);
}

function generateOverviewPage(): void {
  const filePath = join(commandsDir, 'index.mdx');

  let content = `---
title: Container CLI Commands
description: Complete reference for container CLI commands
---

${escapeMarkdownText(containerCommands.overview)}

## Usage

\`\`\`bash
${containerCommands.usage}
\`\`\`

## Global Options

${generateOptionsList(containerCommands.globalOptions)}

## Command Categories

`;

  containerCommands.categories.forEach((category) => {
    const fileName = category.name.toLowerCase().replace(/\s+/g, '-');
    content += `### [${category.name}](/commands/${fileName})\n\n${escapeMarkdownText(category.description)}\n\n`;
  });

  content += `## Common Examples

`;

  containerCommands.commonExamples.forEach((example) => {
    content += `### ${escapeMarkdownText(example.title)}\n\n`;
    if (example.description) {
      content += `${escapeMarkdownText(example.description)}\n\n`;
    }
    // Don't escape in code blocks
    content += `\`\`\`bash\n${example.command}\n\`\`\`\n\n`;
  });

  writeFileSync(filePath, content);
  console.log(`Generated: ${filePath}`);
}

// Generate documentation
console.log('Generating container CLI documentation...');

// Generate overview page
generateOverviewPage();

// Generate category pages
containerCommands.categories.forEach(generateCategoryPage);

console.log('Documentation generation complete!');
