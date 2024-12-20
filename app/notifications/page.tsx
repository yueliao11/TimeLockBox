'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellIcon, Loader2Icon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TransactionBlock } from '@mysten/sui.js/transactions';

interface Notification {
  id: string;
  type: 'unlock' | 'received' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export default function Notifications() {
  const account = useCurrentAccount();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  if (!account) {
    redirect('/');
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (!account) return;

    // 监听新胶囊事件
    const unsubscribe = suiClient.subscribeEvent({
      filter: {
        MoveEventType: 'TimeCapsule::CapsuleCreated'
      },
      onMessage: (event) => {
        if (event.recipient === account.address) {
          // 添���新通知
          const newNotification = {
            id: event.id,
            type: 'received',
            title: '收到新的时光胶囊',
            message: '您的好友给您发送了一个时光胶囊，将在未来的某一天解锁。',
            read: false,
            createdAt: new Date()
          };
          
          setNotifications(prev => [newNotification, ...prev]);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [account]);

  async function loadNotifications() {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications: Notification[] = Array(8).fill(null).map((_, i) => {
        const types = ['unlock', 'received', 'system'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        
        let title = '';
        let message = '';
        
        switch (type) {
          case 'unlock':
            title = '时光胶囊已解锁';
            message = '您的一个时光胶囊已到达解锁时间，快来查看里面的内容吧！';
            break;
          case 'received':
            title = '收到新的时光胶囊';
            message = '您的好友给您发送了一个时光胶囊，将在未来的某一天解锁。';
            break;
          case 'system':
            title = '系统通知';
            message = '欢迎使用时光锁盒，记录此刻珍贵的回忆，在未来的某一天重新发现。';
            break;
        }

        return {
          id: `notification-${i}`,
          type,
          title,
          message,
          read: Math.random() > 0.5,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 7) // 7天内的随机时间
        };
      });
      
      // 按时间倒序排序
      mockNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="outline" onClick={() => loadNotifications()}>
            Refresh
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2Icon className="w-6 h-6 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <BellIcon className="w-12 h-12 mx-auto mb-4" />
            <p>No notifications yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <Card
                key={notification.id}
                className={`p-4 ${notification.read ? 'bg-background' : 'bg-primary/5'}`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}