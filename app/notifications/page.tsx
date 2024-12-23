'use client';

import { useEffect, useState } from 'react';
import { SuiClient } from '@mysten/sui.js/client';
import { Card } from '@/components/ui/card';

// 初始化 Sui 客户端
const suiClient = new SuiClient({
  url: 'https://fullnode.testnet.sui.io'
});

// 示例通知数据
const sampleNotifications = [
  {
    id: 'n1',
    type: 'received',
    title: '收到新的时光胶囊',
    message: '您的好友 Alice 给您发送了一个时光胶囊,将在2024年12月25日解锁。',
    read: false,
    createdAt: new Date('2024-03-15T10:30:00')
  },
  {
    id: 'n2', 
    type: 'unlock',
    title: '胶囊已解锁',
    message: '您在2023年3月创建的"给未来的自己"胶囊已解锁,快来查看吧!',
    read: true,
    createdAt: new Date('2024-03-14T16:20:00')
  },
  {
    id: 'n3',
    type: 'system',
    title: '系统升级通知',
    message: '系统将于本周日凌晨2点进行例行维护升级,期间服务可能短暂中断。',
    read: false, 
    createdAt: new Date('2024-03-13T09:00:00')
  },
  {
    id: 'n4',
    type: 'received',
    title: '收到新的时光胶囊',
    message: '您的好友 Bob 给您发送了一个生日胶囊,将在您生日当天解锁。',
    read: true,
    createdAt: new Date('2024-03-12T14:45:00')
  },
  {
    id: 'n5',
    type: 'unlock',
    title: '胶囊即将解锁',
    message: '您有一个胶囊将在3天后解锁,别忘了来查看哦!',
    read: false,
    createdAt: new Date('2024-03-10T11:20:00')
  },
  {
    id: 'n6',
    type: 'system',
    title: '新功能上线',
    message: '现在您可以为胶囊添加更多类型的多媒体内容啦!快来体验新功能。',
    read: true,
    createdAt: new Date('2024-03-08T15:30:00')
  },
  {
    id: 'n7',
    type: 'received',
    title: '收到新的时光胶囊',
    message: '您的好友 Carol 给您发送了一个毕业纪念胶囊。',
    read: true,
    createdAt: new Date('2024-03-05T09:15:00')
  },
  {
    id: 'n8',
    type: 'unlock',
    title: '胶囊已解锁',
    message: '您的"2023年度总结"胶囊已解锁,快来回顾这一年的精彩时刻!',
    read: true,
    createdAt: new Date('2024-03-01T00:00:00')
  },
  {
    id: 'n9',
    type: 'system',
    title: '安全提醒',
    message: '请注意保护您的账户安全,不要将密钥泄露给他人。',
    read: true,
    createdAt: new Date('2024-02-28T10:00:00')
  },
  {
    id: 'n10',
    type: 'received',
    title: '收到新的时光胶囊',
    message: '您的好友 David 给您发送了一个新年祝福胶囊。',
    read: true,
    createdAt: new Date('2024-02-25T16:40:00')
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // 获取当前账户
    const getCurrentAccount = async () => {
      // 这里添加获取当前账户的逻辑
      const acc = {
        address: '0x123' // 示例地址,需要替换为实际地址
      };
      setAccount(acc);
    };

    getCurrentAccount();
  }, []);

  useEffect(() => {
    if (!account) return;

    let unsubscribe: () => void;

    // 监听新胶囊事件
    const subscribe = async () => {
      try {
        const subscription = await suiClient.subscribeEvent({
          filter: {
            MoveEventType: 'TimeCapsule::CapsuleCreated'
          },
          onMessage: (event) => {
            if (event.recipient === account.address) {
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
        unsubscribe = subscription.unsubscribe;
      } catch (error) {
        console.error('Failed to subscribe to events:', error);
      }
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [account]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">通知中心</h1>
        
        <div className="space-y-4">
          {notifications.map(notification => (
            <Card 
              key={notification.id}
              className="p-4"
            >
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-gray-600 mt-1">{notification.message}</p>
              <div className="text-sm text-gray-500 mt-2">
                {notification.createdAt.toLocaleString()}
              </div>
            </Card>
          ))}
          {notifications.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              暂无通知
            </div>
          )}
        </div>
      </div>
    </div>
  );
}