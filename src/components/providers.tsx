import { HeroUIProvider } from '@heroui/system';
import { NavigateOptions, ToOptions, useRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

export function Providers({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <HeroUIProvider
      navigate={(to, options) => router.navigate({ to, ...options })}
      useHref={(to) => router.buildLocation({ to }).href}
    >
      {children}
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </HeroUIProvider>
  );
}
