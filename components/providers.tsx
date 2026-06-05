'use client';

import { ReactNode } from 'react';
import { AuthProvider, IssueProvider } from '@/lib/context';

export function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <IssueProvider>
        {children}
      </IssueProvider>
    </AuthProvider>
  );
}
