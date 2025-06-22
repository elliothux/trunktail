import { ReactNode } from '@tanstack/react-router';
import { PropsWithChildren } from 'react';
import { SnippetText } from './snippet-text';

interface Props {
  label: string;
  copyable?: boolean;
  suffix?: ReactNode;
}

export function DetailRow({ label, children, copyable = false, suffix }: PropsWithChildren<Props>) {
  return (
    <>
      <div className="font-medium text-gray-500 dark:text-gray-400">{label}</div>
      {copyable ? (
        <SnippetText className="mb-4 max-w-full bg-transparent p-0 font-mono">{children}</SnippetText>
      ) : (
        <p className="mb-2 max-w-full bg-transparent p-0 font-mono">{children}</p>
      )}
      {suffix}
    </>
  );
}
