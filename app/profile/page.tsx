'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { User } from '@/lib/types';

export default function Profile() {
  const account = useCurrentAccount();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>({
    id: '1',
    walletAddress: account?.address || '',
    nickname: 'User',
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    linkedWallets: []
  });
  
  if (!account) {
    redirect('/');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement profile update
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.nickname[0]}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nickname</Label>
                <Input
                  value={user.nickname}
                  onChange={(e) => setUser(prev => ({ ...prev, nickname: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={user.email || ''}
                  onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <Input value={user.walletAddress} disabled />
              </div>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}