import { Loader2 } from 'lucide-react';
import { ComponentProps, ComponentType, PropsWithChildren } from 'react';

export function EmptyScreen({
  icon: Icon,
  loading,
  children,
}: PropsWithChildren<{
  loading?: boolean;
  icon: ComponentType<ComponentProps<'svg'>>;
}>) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 text-sm text-gray-300">
      {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : <Icon className="h-10 w-10 opacity-30" />}
      <div className="text-gray-400">{loading ? null : children}</div>
    </div>
  );
}
