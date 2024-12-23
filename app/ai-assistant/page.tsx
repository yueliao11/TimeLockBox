'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { SendIcon, Loader2Icon, BellIcon, TagIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Reminder {
  id: string;
  date: Date;
  title: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

// 在组件外定义初始消息数组
const initialMessages = [
  {
    role: 'assistant',
    content: '你好!我是你的AI助手,可以帮你:1)提供胶囊内容建议 2)设置重要时刻提醒 3)管理内容分类。有什么我可以帮你的吗?'
  },
  {
    role: 'user',
    content: '如何创建一个有意义的时光胶囊?'
  },
  {
    role: 'assistant', 
    content: '创建有意义的时光胶囊,我建议:\n1. 选择特殊的时间节点(生日、纪念日等)\n2. 加入照片、视频等多媒体内容\n3. 写下当下的感受和期望\n4. 设定一个有意义的解锁时间\n\n需要我为你推荐具体的内容模板吗?'
  },
  {
    role: 'user',
    content: '好的,请推荐一个生日主题的内容模板'
  },
  {
    role: 'assistant',
    content: '这是一个生日主题的胶囊模板:\n\n📝 文字内容:\n- 今年的生日愿望\n- 过去一年的重要时刻\n- 对未来的期待\n\n📸 建议添加:\n- 生日派对照片\n- 与亲朋好友的合影\n- 一段生日祝福视频\n\n⏰ 建议设置在明年生日时解锁,这样可以回顾这一年的成长!'
  },
  {
    role: 'user',
    content: '系统是如何保护胶囊内容安全的?'
  },
  {
    role: 'assistant',
    content: '我们采用多重安全保护机制:\n\n1. 加密存储:\n- 使用平台公钥加密内容\n- 仅平台私钥可解密\n\n2. 去中心化存储:\n- 加密数据存储在海象网络\n- 存储ID记录在Sui区块链\n\n3. 时间锁机制:\n- 通过智能合约控制解锁时间\n- 确保内容不会提前泄露\n\n你的隐私安全是我们的首要考虑!'
  },
  {
    role: 'user',
    content: '提醒我记录重要时刻'
  },
  {
    role: 'assistant',
    content: '好的!我来帮你设置重要时刻提醒:\n\n📅 常见的记录时机:\n- 生日和纪念日\n- 节假日\n- 人生重要阶段(毕业、结婚等)\n- 季节更替\n\n要为哪个具体时刻设置提醒呢?我可以帮你规划内容哦!'
  },
  {
    role: 'user',
    content: '如何管理我的胶囊内容?'
  },
  {
    role: 'assistant',
    content: '我建议通过以下方式管理胶囊:\n\n🏷️ 使用分类标签:\n- 按主题(生日、节日、纪念等)\n- 按时间(年度、季节、月份)\n- 按接收对象(自己、家人、朋友)\n\n📊 组织方式:\n1. 创建个性化分类\n2. 设置颜色标记\n3. 添加重要性标识\n\n需要我帮你创建一个分类方案吗?'
  },
  {
    role: 'user',
    content: '胶囊可以发给别人吗?'
  },
  {
    role: 'assistant',
    content: '当然可以!发送胶囊给他人是一个表达关心的好方式。\n\n🎁 发送方式:\n1. 输入接收者的Sui钱包地址\n2. 设置解锁时间\n3. 对方会收到通知\n\n💝 创意玩法:\n- 生日惊喜\n- 节日祝福\n- 未来寄语\n- 时光信件\n\n要为特别的人创建一个胶囊吗?我可以提供更多创意建议!'
  }
];

export default function AIAssistant() {
  const account = useCurrentAccount();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>(initialMessages);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  if (!account) {
    redirect('/');
  }

  // 加载提醒和分类
  useEffect(() => {
    // TODO: 从本地存储加载数据
    const loadSavedData = () => {
      const savedReminders = localStorage.getItem('reminders');
      const savedCategories = localStorage.getItem('categories');
      
      if (savedReminders) setReminders(JSON.parse(savedReminders));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
    };
    
    loadSavedData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setLoading(true);
    try {
      // TODO: 调用 AI API
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // 添加提醒
  function handleAddReminder() {
    // TODO: 实现添加提醒的逻辑
  }

  // 添加分类
  function handleAddCategory() {
    // TODO: 实现添加分类的逻辑
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">AI 助手</h1>
          <div className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <BellIcon className="w-4 h-4 mr-2" />
                  提醒
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>管理提醒</DialogTitle>
                </DialogHeader>
                {/* 提醒管理界面 */}
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <TagIcon className="w-4 h-4 mr-2" />
                  分类
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>管理分类</DialogTitle>
                </DialogHeader>
                {/* 分类管理界面 */}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card className="min-h-[400px] max-h-[600px] overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg ${
                  message.role === 'assistant' ? 'bg-primary/10' : ''
                }`}
              >
                <p>{message.content}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="询问任何关于时光胶囊的问题..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? 
                <Loader2Icon className="w-4 h-4 animate-spin" /> : 
                <SendIcon className="w-4 h-4" />
              }
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}