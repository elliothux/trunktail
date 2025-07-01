import { Portal } from '@/components/portal';
import { createFileRoute } from '@tanstack/react-router';
import { containerCommands, Command, CommandOption, CommandCategory } from '@/lib/commands';
import { Folder, SquareTerminal, Terminal } from 'lucide-react';

export const Route = createFileRoute('/_app/commands')({
  component: CommandPage,
});

function CommandPage() {
  return (
    <>
      <Portal name="title">Commands</Portal>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-blue-800">
            <strong>Overview:</strong> {containerCommands.overview}
          </p>
          <p className="text-blue-700 mt-2">
            <strong>Usage:</strong> <code>{containerCommands.usage}</code>
          </p>
        </div>

        {/* Global Options */}
        <section id="global-options" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Global Options</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {containerCommands.globalOptions.map((option, index) => (
                <OptionItem key={index} option={option} />
              ))}
            </ul>
          </div>
        </section>

        {/* Common Examples */}
        <section id="common-examples" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Common Examples</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {containerCommands.commonExamples.map((example, index) => (
              <div key={index}>
                <strong>{example.title}:</strong>
                {example.description && <p className="text-gray-600 text-sm mt-1">{example.description}</p>}
                <br />
                <code className="text-sm bg-gray-200 px-2 py-1 rounded">{example.command}</code>
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
      <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
      <p className="text-gray-600 mb-4">{category.description}</p>
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
    <div id={commandId} className={`border border-gray-200 rounded-lg p-4 ${marginLeft}`}>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold text-blue-600">{command.name}</h3>
        {command.aliases && command.aliases.length > 0 && (
          <span className="text-sm text-gray-500">(aliases: {command.aliases.join(', ')})</span>
        )}
      </div>

      <p className="text-gray-700 mb-3">{command.description}</p>

      <div className="mb-3">
        <strong>Usage:</strong>
        <br />
        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{command.usage}</code>
      </div>

      {command.options.length > 0 && (
        <div className="mb-3">
          <strong>Options:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            {command.options.map((option, index) => (
              <OptionItem key={index} option={option} />
            ))}
          </ul>
        </div>
      )}

      {command.examples && command.examples.length > 0 && (
        <div className="mb-3">
          <strong>Examples:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            {command.examples.map((example, index) => (
              <li key={index} className="ml-4">
                <code className="bg-gray-100 px-1 rounded">{example}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasSubcommands && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Subcommands:</h4>
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
    <div id={subcommandId} className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300">
      <div className="flex items-center gap-2 mb-2">
        <h5 className="font-semibold text-gray-800">{command.name}</h5>
        {command.aliases && command.aliases.length > 0 && (
          <span className="text-sm text-gray-500">({command.aliases.join(', ')})</span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-2">{command.description}</p>

      <div className="mb-2">
        <code className="text-sm bg-gray-200 px-2 py-1 rounded">{command.usage}</code>
      </div>

      {command.options.length > 0 && (
        <div className="mt-2">
          <ul className="text-sm space-y-1">
            {command.options.map((option, index) => (
              <OptionItem key={index} option={option} extraSmall />
            ))}
          </ul>
        </div>
      )}

      {hasSubcommands && (
        <div className="mt-3">
          <h6 className="font-medium text-gray-700 mb-2">Subcommands:</h6>
          <div className="space-y-2">
            {command.subcommands!.map((subcommand, index) => (
              <div key={index} className="ml-4 p-2 bg-white rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">{subcommand.name}</strong>
                  {subcommand.aliases && (
                    <span className="text-xs text-gray-500">({subcommand.aliases.join(', ')})</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-1">{subcommand.description}</p>
                <code className="text-xs bg-gray-100 px-1 rounded">{subcommand.usage}</code>
                {subcommand.options.length > 0 && (
                  <ul className="mt-1 text-xs space-y-0.5">
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
    ? 'bg-gray-100 px-1 rounded text-xs'
    : small
      ? 'bg-gray-100 px-1 rounded text-sm'
      : 'bg-gray-100 px-1 rounded';

  return (
    <li className={`ml-4 ${sizeClass} py-0.5`}>
      <code className={codeClass}>{option.flag}</code>
      {option.required && <span className="text-red-500 ml-1">*</span>}
      <span className="ml-2 text-gray-500">- {option.description}</span>
      {option.defaultValue && <span className="text-gray-400 ml-2">(default: {option.defaultValue})</span>}
    </li>
  );
}

function CommandOverview() {
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  };

  return (
    <div className="space-y-4 py-4">
      {containerCommands.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-4">
          <button
            onClick={() => scrollToElement(`category-${category.name.replace(/\s+/g, '-').toLowerCase()}`)}
            className="font-medium text-gray-700 hover:text-gray-900 mb-2 block"
          >
            <Folder size={18} className="mr-2 inline mb-1" />
            <span>{category.name}</span>
          </button>
          <div className="space-y-1 ml-4">
            {category.commands.map((command, commandIndex) => {
              const commandId = `command-${command.name.replace(/\s+/g, '-').toLowerCase()}`;
              return (
                <div key={commandIndex} className="mt-1">
                  <button
                    onClick={() => scrollToElement(commandId)}
                    className="text-blue-600 hover:text-blue-800 text-sm block w-full text-left py-1"
                  >
                    <SquareTerminal size={16} className="mr-2 inline mb-0.5" />
                    <span>{command.name}</span>
                  </button>

                  {/* Subcommands */}
                  {command.subcommands && command.subcommands.length > 0 && (
                    <div className="ml-4 space-y-1 mt-1">
                      {command.subcommands.map((subcommand, subIndex) => {
                        const subcommandId = `subcommand-${subcommand.name.replace(/\s+/g, '-').toLowerCase()}`;
                        return (
                          <button
                            key={subIndex}
                            onClick={() => scrollToElement(subcommandId)}
                            className="text-gray-600 hover:text-gray-800 text-sm block w-full text-left py-0.5"
                          >
                            <Terminal size={14} className="mr-1 inline mb-0.5" />
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
