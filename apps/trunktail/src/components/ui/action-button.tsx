import { Button } from '@heroui/button';
import { ChevronRight } from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';

interface Props {
  startContent?: ReactNode;
  onPress?: () => void;
}

export function ActionButton({ startContent, onPress, children }: PropsWithChildren<Props>) {
  return (
    <Button
      className="hover:bg-primary hover:border-primary justify-between border-neutral-600 text-gray-100"
      variant="bordered"
      startContent={startContent}
      endContent={<ChevronRight className="ml-auto h-5 w-5" />}
      onPress={onPress}
    >
      {children}
    </Button>
  );
}
