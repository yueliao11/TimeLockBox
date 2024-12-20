'use client';

import { SuiProvider } from '@/components/providers/SuiProvider';
import { Header } from '@/components/layout/Header';
import { Toaster } from "@/components/ui/toaster";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <SuiProvider>
      <Header />
      {children}
      <Toaster />
    </SuiProvider>
  );
} 