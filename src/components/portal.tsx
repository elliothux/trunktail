import {
  ComponentProps,
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

interface PortalContextValue {
  portals: Record<string, HTMLDivElement | null>;
  setPortal: (name: string, el: HTMLDivElement | null) => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: PropsWithChildren) {
  const [portals, setPortals] = useState<Record<string, HTMLDivElement | null>>({});
  const setPortal: PortalContextValue['setPortal'] = useCallback((name, el) => {
    setPortals((portals) => {
      return portals[name] === el ? portals : { ...portals, [name]: el };
    });
  }, []);

  return (
    <PortalContext
      value={useMemo(
        () => ({
          portals,
          setPortal,
        }),
        [portals],
      )}
    >
      {children}
    </PortalContext>
  );
}

function usePortalContext() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortalContext must be used within a PortalProvider');
  }
  return context;
}

export function PortalRoot({ name, ...props }: { name: string } & Omit<ComponentProps<'div'>, 'children'>) {
  const { setPortal } = usePortalContext();

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPortal(name, ref.current);
    return () => {
      setPortal(name, null);
    };
  }, [name]);

  return <div ref={ref} {...props} />;
}

export function Portal({ name, fallback, children }: PropsWithChildren<{ name: string; fallback?: () => ReactNode }>) {
  const { portals } = usePortalContext();
  const target = portals[name];

  if (!target) {
    return fallback ? fallback() : null;
  }

  return createPortal(children, target);
}
