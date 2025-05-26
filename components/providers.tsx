'use client';

import { ThemeProvider } from 'next-themes';
import { DataProvider } from '@/lib/data-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <DataProvider>
        {children}
      </DataProvider>
    </ThemeProvider>
  );
}