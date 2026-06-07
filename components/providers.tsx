'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner'; // [INTEGRATED] Toast notification display
import { AuthProvider, IssueProvider } from '@/lib/context';

export function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <IssueProvider>
        {children}
        {/* [INTEGRATED] Toast notifications will display here globally */}
        <Toaster position="top-right" richColors />
      </IssueProvider>
    </AuthProvider>
  );
}
