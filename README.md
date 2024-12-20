
# 时光锁盒 (Time Capsule)

一个基于 Sui + 海象存储 区块链的去中心化时光胶囊应用。用户可以创建包含文字、图片等内容的数字时光胶囊,并设定未来的解锁时间。

## ✨ 特性

- 🔒 创建加密时光胶囊
- 📬 发送给未来的自己或他人
- 🎯 设定解锁时间
- 📱 支持文字、图片等多媒体内容
- 🔔 解锁提醒通知
- 🎨 精美的用户界面和动画效果

## 🛠 技术栈

- **Frontend**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Blockchain**: Sui Network
- **Storage**: Walrus SDK
- **Authentication**: @mysten/dapp-kit

## 🚀 快速开始

1. 克隆项目
```bash
git clone https://github.com/your-username/time-capsule.git
cd time-capsule
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env.local
```

4. 启动开发服务器
```bash
npm run dev
```

## 📦 主要功能模块

### 胶囊列表

```21:77:app/capsules/my/components/CapsuleList.tsx
export function CapsuleList({ 
  filters, 
  page = 1,
  pageSize = 12,
  onPageChange,
  onTotalChange 
}: CapsuleListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(false);
  const account = useCurrentAccount();
  const client = useSuiClient();
          options: { showContent: true }
  useEffect(() => {
    if (!account) return;
      });
    const fetchCapsules = async () => {
      setLoading(true);
      try {
        // 获取链上胶囊数据
        const response = await client.getOwnedObjects({
          owner: account.address,
          filter: { StructType: 'TimeCapsule::Capsule' },
          options: { showContent: true },
          cursor: null, // 可以实现后端分页
          limit: 50 // 先获取较多数据,在前端分页
        });
            owner: fields.owner,
        // 格式化胶囊数据
        const formattedCapsules = response.data.map(formatCapsuleData);
          };
        // 根据过滤条件筛选
        const filteredCapsules = formattedCapsules.filter(capsule => {
          if (filters.status === 'all') return true;
          const isUnlocked = new Date() >= new Date(capsule.unlockTime);
          return filters.status === (isUnlocked ? 'unlocked' : 'locked');
        });
  }, [account, client]);
        // 计算总数
        const total = filteredCapsules.length;
        onTotalChange?.(total);
    if (filters.status === 'locked') return isLocked;
        // 分页切片
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedCapsules = filteredCapsules.slice(startIndex, endIndex);
  return (
        setCapsules(paginatedCapsules);
      } catch (error) {
        console.error('Error fetching capsules:', error);
      } finally {
        setLoading(false);
      }
    };
                key={capsule.id}
    fetchCapsules();
  }, [account, filters, page, pageSize]);
```


### 通知系统

```20:61:app/notifications/page.tsx
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
      <div className="space-y-6">
    return () => {
      unsubscribe();
    };
  }, [account]);
```


### 创建胶囊

```1:29:app/capsules/new/page.tsx
'use client';

import { motion } from 'framer-motion';
import { PageLayout } from '@/app/components/layouts/PageLayout';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buttonStyles } from '@/app/components/ui/styles';
import { CreateCapsule } from '@/components/capsule/CreateCapsule'

export default function NewCapsule() {
  return (
    <PageLayout
      title="创建新时光胶囊"
      description="记录此刻珍贵的回忆，在未来的某一天重新发现"
      icon={<PlusIcon className="w-12 h-12 text-teal-500" />}
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100 hover:shadow-xl transition-shadow space-y-6"
        >
          <CreateCapsule />
        </motion.div>
      </div>
    </PageLayout>
  );
}
```


## 📝 项目结构

```
time-capsule/
├── app/
│   ├── capsules/         # 胶囊相关页面
│   ├── notifications/    # 通知系统
│   ├── components/       # 共享组件
│   └── page.tsx         # 首页
├── components/          # UI组件
├── config/             # 配置文件
└── public/             # 静态资源
```

## 🔗 相关链接

- [Sui Network](https://sui.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 📄 许可证

MIT License

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 👥 作者

- 开发者名字 - [@github_username](https://github.com/yueliao11)

## 🙏 致谢

- Sui Network 团队
- Next.js 团队
- 所有贡献者
