import { ContainerStatus } from '@/lib/bridge/containers';
import { cn } from '@/lib/utils';

interface Props {
  status: ContainerStatus;
  size?: number;
  className?: string;
}

export function ContainerStatusIndicator({ status, size = 8, className }: Props) {
  return (
    <span
      className={cn(
        'inline-block rounded-full',
        status === ContainerStatus.running
          ? 'bg-green-500'
          : status === ContainerStatus.stopped
            ? 'bg-gray-400'
            : 'bg-orange-300',
        className,
      )}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
