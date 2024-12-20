'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { redirect } from 'next/navigation';
import { UploadForm } from './components/UploadForm';

export default function CreateCapsulePage() {
  const account = useCurrentAccount();
  
  if (!account) {
    redirect('/');
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Create Time Capsule</h1>
        <p className="text-muted-foreground">
          Upload your memories and set when they should be unlocked
        </p>
        <UploadForm />
      </div>
    </div>
  );
} 