'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlusIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { User } from '@/lib/types';

interface Friend extends User {
  status: 'friend' | 'pending' | 'requested';
}

export default function Friends() {
  const account = useCurrentAccount();
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchInput, setSearchInput] = useState('');
  
  if (!account) {
    redirect('/');
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchInput.trim() || loading) return;

    setLoading(true);
    try {
      // TODO: Implement friend search
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFriend: Friend = {
        id: Date.now().toString(),
        walletAddress: '0x...' + Math.random().toString(36).substring(2, 8),
        nickname: 'User ' + Math.floor(Math.random() * 1000),
        avatar: '',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        linkedWallets: []
      };
      
      setFriends(prev => [...prev, mockFriend]);
      setSearchInput('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Friends</h1>
        
        <Card className="p-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by wallet address or nickname..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !searchInput.trim()}>
              {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <UserPlusIcon className="w-4 h-4" />}
            </Button>
          </form>
        </Card>
        
        <Tabs defaultValue="friends">
          <TabsList>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="requested">Requested</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="space-y-4">
            {friends.filter(f => f.status === 'friend').map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {friends.filter(f => f.status === 'pending').map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </TabsContent>
          
          <TabsContent value="requested" className="space-y-4">
            {friends.filter(f => f.status === 'requested').map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function FriendCard({ friend }: { friend: Friend }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={friend.avatar} />
            <AvatarFallback>{friend.nickname[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{friend.nickname}</h3>
            <p className="text-sm text-muted-foreground">{friend.walletAddress}</p>
          </div>
        </div>
        
        {friend.status === 'pending' && (
          <div className="space-x-2">
            <Button size="sm">Accept</Button>
            <Button size="sm" variant="outline">Decline</Button>
          </div>
        )}
        
        {friend.status === 'requested' && (
          <Button size="sm" variant="outline" disabled>Pending</Button>
        )}
        
        {friend.status === 'friend' && (
          <Button size="sm" variant="outline">Remove</Button>
        )}
      </div>
    </Card>
  );
}