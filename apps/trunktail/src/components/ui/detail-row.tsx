import { PropsWithChildren, ReactNode } from 'react';
import { SnippetText } from './snippet-text';

interface Props {
  label: string;
  copyable?: boolean;
  suffix?: ReactNode;
}

export function DetailRow({ label, children, copyable = false, suffix }: PropsWithChildren<Props>) {
  return (
    <>
      <div className="font-medium text-gray-400">{label}</div>
      {copyable ? (
        <SnippetText className="mb-4 max-w-full bg-transparent p-0 font-mono">{children}</SnippetText>
      ) : (
        <div className="mb-2 max-w-full bg-transparent p-0 font-mono text-sm text-gray-200">{children}</div>
      )}
      {suffix}
    </>
  );
}
