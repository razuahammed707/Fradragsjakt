// app/providers.tsx
'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export function ProgressbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ProgressBar
        height="2px"
        color="#fff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
