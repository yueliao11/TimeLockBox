'use client';

import { APP_NAME } from '@/lib/constants';
import { LockIcon } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <LockIcon className="w-6 h-6" />
          <span className="font-bold text-xl">{APP_NAME}</span>
        </Link>
      </div>
    </header>
  );
}