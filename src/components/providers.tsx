import { PortalProvider } from '@/components/portal';
import { HeroUIProvider } from '@heroui/system';
import { NavigateOptions, ToOptions, useRouter } from '@tanstack/react-router';
import { PropsWithChildren, StrictMode } from 'react';
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
    <StrictMode>
      <HeroUIProvider
        navigate={(to, options) => router.navigate({ to, ...(options ?? {}) })}
        useHref={(to) => router.buildLocation({ to }).href}
      >
        <PortalProvider>
          {children}
          <Toaster />
          {/*<TanStackRouterDevtools position="bottom-right" />*/}
        </PortalProvider>
      </HeroUIProvider>
    </StrictMode>
  );
}
