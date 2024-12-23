'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
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

// 示例好友数据
const sampleFriends: Friend[] = [
  {
    address: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    nickname: 'Alice',
    status: 'friend'
  },
  {
    address: '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef',
    nickname: '小明',
    status: 'friend'
  },
  {
    address: '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef',
    nickname: 'Bob_Web3',
    status: 'friend'
  },
  {
    address: '0x4567890123abcdef4567890123abcdef4567890123abcdef4567890123abcdef',
    nickname: '区块链爱好者',
    status: 'friend'
  },
  {
    address: '0x5678901234abcdef5678901234abcdef5678901234abcdef5678901234abcdef',
    nickname: 'Carol_crypto',
    status: 'friend'
  },
  {
    address: '0x6789012345abcdef6789012345abcdef6789012345abcdef6789012345abcdef',
    nickname: '小红',
    status: 'friend'
  },
  {
    address: '0x7890123456abcdef7890123456abcdef7890123456abcdef7890123456abcdef',
    nickname: 'David_NFT',
    status: 'friend'
  },
  {
    address: '0x8901234567abcdef8901234567abcdef8901234567abcdef8901234567abcdef',
    nickname: '时光收藏家',
    status: 'friend'
  },
  {
    address: '0x9012345678abcdef9012345678abcdef9012345678abcdef9012345678abcdef',
    nickname: 'Eva_Metaverse',
    status: 'pending'
  },
  {
    address: '0xa123456789abcdefa123456789abcdefa123456789abcdefa123456789abcdef',
    nickname: '区块链新人',
    status: 'pending'
  },
  {
    address: '0xb234567890abcdefb234567890abcdefb234567890abcdefb234567890abcdef',
    nickname: 'Frank_Sui',
    status: 'pending'
  },
  {
    address: '0xc345678901abcdefc345678901abcdefc345678901abcdefc345678901abcdef',
    nickname: '小李',
    status: 'requested'
  },
  {
    address: '0xd456789012abcdefd456789012abcdefd456789012abcdefd456789012abcdef',
    nickname: 'Grace_Move',
    status: 'requested'
  }
];

export default function Friends() {
  const account = useCurrentAccount();
  const [friends, setFriends] = useState(sampleFriends);
  
  if (!account) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-medium text-gray-900">好友列表</h1>
            <div className="flex items-center gap-4">
              <Input 
                placeholder="搜索好友..." 
                className="w-64"
              />
              <Button>
                <UserPlusIcon className="w-4 h-4 mr-2" />
                添加好友
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="friend">已添加</TabsTrigger>
              <TabsTrigger value="pending">待确认</TabsTrigger>
              <TabsTrigger value="requested">已发送</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map(friend => (
                  <Card key={friend.address} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${friend.address}`} />
                        <AvatarFallback>{friend.nickname[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{friend.nickname}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {friend.address.slice(0, 6)}...{friend.address.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* 其他 TabsContent 内容相似 */}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}