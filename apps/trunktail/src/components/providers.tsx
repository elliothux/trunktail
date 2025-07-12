import { PortalProvider } from '@/components/portal';
import { HeroUIProvider } from '@heroui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigateOptions, ToOptions, useRouter } from '@tanstack/react-router';
import { PropsWithChildren, StrictMode } from 'react';
import { Toaster } from 'sonner';
import { SystemProvider } from './system-context';
import { Updater } from './updater';
// import { UpdaterProvider } from './updater-context';

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <StrictMode>
      <HeroUIProvider
        navigate={(to, options) => router.navigate({ to, ...(options ?? {}) })}
        useHref={(to) => router.buildLocation({ to }).href}
      >
        <QueryClientProvider client={queryClient}>
          <PortalProvider>
            <SystemProvider>
              {children}
              <Updater />
            </SystemProvider>
            <Toaster richColors />
            {/*<TanStackRouterDevtools position="bottom-right" />*/}
          </PortalProvider>
        </QueryClientProvider>
      </HeroUIProvider>
    </StrictMode>
  );
}
