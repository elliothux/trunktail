import { cn } from '@/lib/utils';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { Loader2 } from 'lucide-react';
import { ComponentProps, ComponentType } from 'react';

interface Props {
  title?: string;
  active: boolean;
  icon: ComponentType<ComponentProps<'svg'>>;
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function OperationButton({ title, active, icon, onClick, isLoading, disabled }: Props) {
  const Icon = isLoading ? Loader2 : icon;
  const button = (
    <Button size="sm" variant="light" onPress={onClick} isDisabled={disabled} isIconOnly>
      <Icon className={cn('h-4 w-4', active ? 'text-white' : 'text-gray-300', isLoading ? 'animate-spin' : null)} />
    </Button>
  );
  return title ? (
    <Tooltip className="text-white" content={title}>
      {button}
    </Tooltip>
  ) : (
    button
  );
}
