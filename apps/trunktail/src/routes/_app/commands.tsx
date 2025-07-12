import { Portal } from '@/components/portal';
import { Button } from '@heroui/button';
import { createFileRoute } from '@tanstack/react-router';
import { openUrl } from '@tauri-apps/plugin-opener';
import { Command, CommandCategory, CommandOption, containerCommands } from '@trunktail/commands';
import { ExternalLink, Folder, SquareTerminal, Terminal } from 'lucide-react';

export const Route = createFileRoute('/_app/commands')({
  component: CommandPage,
});

function CommandPage() {
  return (
    <>
      <Portal name="title">
        <div className="flex w-full items-center justify-between" data-tauri-drag-region>
          <p className="pointer-events-none select-none">Commands</p>
          <Button
            size="sm"
            color="primary"
            endContent={<ExternalLink size={16} />}
            onPress={() => {
              void openUrl('https://trunktail.pages.dev/commands/');
            }}
          >
            View on Website
          </Button>
        </div>
      </Portal>

      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6 border-l-4 border-blue-600 bg-gray-900 p-4">
          <p className="text-blue-300">
            <strong>Overview:</strong> {containerCommands.overview}
          </p>
          <p className="mt-2 text-blue-300">
            <strong>Usage:</strong> <code>{containerCommands.usage}</code>
          </p>
        </div>

        {/* Global Options */}
        <section id="global-options" className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-200">Global Options</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <ul className="space-y-2">
              {containerCommands.globalOptions.map((option, index) => (
                <OptionItem key={index} option={option} />
              ))}
            </ul>
          </div>
        </section>

        {/* Common Examples */}
        <section id="common-examples" className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-200">Common Examples</h2>
          <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-950 p-4">
            {containerCommands.commonExamples.map((example, index) => (
              <div key={index}>
                <strong className="text-gray-200">{example.title}:</strong>
                {example.description && <p className="mt-1 text-sm text-gray-400">{example.description}</p>}
                <br />
                <code className="rounded bg-gray-800 px-2 py-1 text-sm text-gray-200">{example.command}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Command Categories */}
        {containerCommands.categories.map((category, index) => (
          <CategorySection key={index} category={category} />
        ))}
      </div>

      <Portal name="right-panel-title">
        <p>Overview</p>
      </Portal>
      <Portal name="right-panel">
        <CommandOverview />
      </Portal>
    </>
  );
}

interface CategorySectionProps {
  category: CommandCategory;
}

function CategorySection({ category }: CategorySectionProps) {
  const categoryId = `category-${category.name.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <section id={categoryId} className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold text-gray-200">{category.name}</h2>
      <p className="mb-4 text-gray-400">{category.description}</p>
      <div className="space-y-6">
        {category.commands.map((command, index) => (
          <CommandCard key={index} command={command} />
        ))}
      </div>
    </section>
  );
}

interface CommandCardProps {
  command: Command;
  level?: number;
}

function CommandCard({ command, level = 0 }: CommandCardProps) {
  const marginLeft = level > 0 ? `ml-${level * 4}` : '';
  const hasSubcommands = command.subcommands && command.subcommands.length > 0;
  const commandId = `command-${command.name.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div id={commandId} className={`rounded-lg border border-gray-800 bg-gray-950 p-4 ${marginLeft}`}>
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-blue-300">{command.name}</h3>
        {command.aliases && command.aliases.length > 0 && (
          <span className="text-sm text-gray-400">(aliases: {command.aliases.join(', ')})</span>
        )}
      </div>

      <p className="mb-3 text-gray-300">{command.description}</p>

      <div className="mb-3">
        <strong className="text-gray-200">Usage:</strong>
        <br />
        <code className="rounded bg-gray-800 px-2 py-1 text-sm text-gray-200">{command.usage}</code>
      </div>

      {command.options.length > 0 && (
        <div className="mb-3">
          <strong className="text-gray-200">Options:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            {command.options.map((option, index) => (
              <OptionItem key={index} option={option} />
            ))}
          </ul>
        </div>
      )}

      {command.examples && command.examples.length > 0 && (
        <div className="mb-3">
          <strong className="text-gray-200">Examples:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            {command.examples.map((example, index) => (
              <li key={index} className="ml-4">
                <code className="rounded bg-gray-800 px-1 text-gray-200">{example}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasSubcommands && (
        <div className="mt-4">
          <h4 className="mb-3 font-semibold text-gray-200">Subcommands:</h4>
          <div className="space-y-4">
            {command.subcommands!.map((subcommand, index) => (
              <SubcommandCard key={index} command={subcommand} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface SubcommandCardProps {
  command: Command;
}

function SubcommandCard({ command }: SubcommandCardProps) {
  const hasSubcommands = command.subcommands && command.subcommands.length > 0;
  const subcommandId = `subcommand-${command.name.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div id={subcommandId} className="bg-gray-black rounded-lg border-l-4 border-gray-800 p-4">
      <div className="mb-2 flex items-center gap-2">
        <h5 className="font-semibold text-gray-200">{command.name}</h5>
        {command.aliases && command.aliases.length > 0 && (
          <span className="text-sm text-gray-400">({command.aliases.join(', ')})</span>
        )}
      </div>

      <p className="mb-2 text-sm text-gray-400">{command.description}</p>

      <div className="mb-2">
        <code className="rounded bg-gray-800 px-2 py-1 text-sm text-gray-200">{command.usage}</code>
      </div>

      {command.options.length > 0 && (
        <div className="mt-2">
          <ul className="space-y-1 text-sm">
            {command.options.map((option, index) => (
              <OptionItem key={index} option={option} extraSmall />
            ))}
          </ul>
        </div>
      )}

      {hasSubcommands && (
        <div className="mt-3">
          <h6 className="mb-2 font-medium text-gray-300">Subcommands:</h6>
          <div className="space-y-2">
            {command.subcommands!.map((subcommand, index) => (
              <div key={index} className="ml-4 rounded border border-gray-700 bg-gray-800 p-2">
                <div className="mb-1 flex items-center gap-2">
                  <strong className="text-sm text-gray-200">{subcommand.name}</strong>
                  {subcommand.aliases && (
                    <span className="text-xs text-gray-400">({subcommand.aliases.join(', ')})</span>
                  )}
                </div>
                <p className="mb-1 text-xs text-gray-400">{subcommand.description}</p>
                <code className="rounded bg-gray-700 px-1 text-xs text-gray-200">{subcommand.usage}</code>
                {subcommand.options.length > 0 && (
                  <ul className="mt-1 space-y-0.5 text-xs">
                    {subcommand.options.map((option, optIndex) => (
                      <OptionItem key={optIndex} option={option} extraSmall />
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface OptionItemProps {
  option: CommandOption;
  small?: boolean;
  extraSmall?: boolean;
}

function OptionItem({ option, small = false, extraSmall = false }: OptionItemProps) {
  const sizeClass = extraSmall ? 'text-xs' : small ? 'text-sm' : '';
  const codeClass = extraSmall
    ? 'bg-gray-700 px-1 rounded text-xs text-gray-200'
    : small
      ? 'bg-gray-700 px-1 rounded text-sm text-gray-200'
      : 'bg-gray-700 px-1 rounded text-gray-200';

  return (
    <li className={`ml-4 ${sizeClass} py-0.5`}>
      <code className={codeClass}>{option.flag}</code>
      {option.required && <span className="ml-1 text-red-400">*</span>}
      <span className="ml-2 text-gray-400">- {option.description}</span>
      {option.defaultValue && <span className="ml-2 text-gray-500">(default: {option.defaultValue})</span>}
    </li>
  );
}

function CommandOverview() {
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  return (
    <div className="space-y-4 py-4">
      {containerCommands.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-4">
          <button
            onClick={() => scrollToElement(`category-${category.name.replace(/\s+/g, '-').toLowerCase()}`)}
            className="mb-2 block font-medium text-gray-200 hover:text-white"
          >
            <Folder size={18} className="mr-2 mb-1 inline" />
            <span>{category.name}</span>
          </button>
          <div className="ml-4 space-y-1">
            {category.commands.map((command, commandIndex) => {
              const commandId = `command-${command.name.replace(/\s+/g, '-').toLowerCase()}`;
              return (
                <div key={commandIndex} className="mt-1">
                  <button
                    onClick={() => scrollToElement(commandId)}
                    className="block w-full py-1 text-left text-sm text-blue-500 hover:text-blue-200"
                  >
                    <SquareTerminal size={16} className="mr-2 mb-0.5 inline" />
                    <span>{command.name}</span>
                  </button>

                  {/* Subcommands */}
                  {command.subcommands && command.subcommands.length > 0 && (
                    <div className="mt-1 ml-4 space-y-1">
                      {command.subcommands.map((subcommand, subIndex) => {
                        const subcommandId = `subcommand-${subcommand.name.replace(/\s+/g, '-').toLowerCase()}`;
                        return (
                          <button
                            key={subIndex}
                            onClick={() => scrollToElement(subcommandId)}
                            className="block w-full py-0.5 text-left text-sm text-gray-400 hover:text-gray-200"
                          >
                            <Terminal size={14} className="mr-1 mb-0.5 inline" />
                            <span>{subcommand.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
