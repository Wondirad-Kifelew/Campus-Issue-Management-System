'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner'; // [INTEGRATED] Toast notification display
import { AuthProvider, IssueProvider, AdminProvider } from '@/lib/context';

export function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <IssueProvider>
        <AdminProvider>
          {children}
          {/* [INTEGRATED] Toast notifications will display here globally */}
          <Toaster position="top-right" richColors />
        </AdminProvider>
      </IssueProvider>
    </AuthProvider>
  );
}
