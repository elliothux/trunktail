import { cn } from '@/lib/utils';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { ComponentProps, ComponentType } from 'react';

interface Props {
  title: string;
  active: boolean;
  icon: ComponentType<ComponentProps<'svg'>>;
  onClick?: () => void;
}

export function OperationButton({ title, active, icon: Icon, onClick }: Props) {
  return (
    <Tooltip content={title}>
      <Button size="sm" variant="light" onPress={onClick} isIconOnly>
        <Icon className={cn('h-4 w-4', active ? 'text-white' : 'text-gray-900')} />
      </Button>
    </Tooltip>
  );
}
