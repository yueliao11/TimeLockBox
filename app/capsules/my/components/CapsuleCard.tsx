'use client';

import { Card } from '@/components/ui/card';
import { CalendarIcon, LockIcon, UnlockIcon } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StorageSDK from "walrus-sdk";
import dynamic from 'next/dynamic';
import '@uiw/react-markdown-preview/markdown.css';

const storage = new StorageSDK();

// 添加默认图片配置
const DEFAULT_IMAGES = {
  locked: [
    '/timebox.jpg',
    '/timebox.jpg'
  ],
  unlocked: [
    '/unlock.jpg',
    '/unlock.jpg'
  ]
};

const DEFAULT_CLOSED_IMG = '/timebox.jpg'
const DEFAULT_OPENED_IMG = '/unlock.jpg'

interface CapsuleProps {
  capsule: {
    id: string;
    content: string;
    contentType: string;
    mediaContent?: string;
    unlockTime: number;
    owner: string;
    recipient: string;
    mediaUrl?: string;
  };
  currentAddress: string;
  mediaUrl?: string;
}

interface CapsuleInfo {
  // 基础信息
  id: string;            // 胶囊ID
  owner: string;         // 发送者地址
  recipient: string;     // 接收者地址
  unlockTime: number;    // 解锁时间戳
  
  // 内容信息
  content: string;       // 文本内容
  contentType: string;   // 内容类型: text/image/video
  mediaContent?: string; // 媒体内容ID
  mediaUrl?: string;     // 媒体访问URL
  
  // 状态信息
  status: 'locked' | 'unlocked';  // 锁定状态
  timeLeft?: string;    // 剩余解锁时间
}

interface CapsuleCardProps extends CapsuleProps {
  isPreview?: boolean;
}

// 添加工具函数转换Uint8Array到base64
const arrayBufferToBase64 = (buffer: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
};

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

export function CapsuleCard({ capsule, currentAddress, isPreview = false }: CapsuleCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 根据状态获取默认图片
  const getDefaultImage = () => {
    const images = status === 'locked' ? DEFAULT_IMAGES.locked : DEFAULT_IMAGES.unlocked;
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (capsule.mediaContent) {
        setLoading(true);
        try {
          const uploadImageUrl = "https://aggregator.walrus-testnet.walrus.space/";
          const imageUrl = uploadImageUrl + `v1/${capsule.mediaContent}`;
          
          console.log("imageUrl:", imageUrl);
          setImageUrl(imageUrl);
        } catch (error) {
          console.error('Error fetching image:', error);
          setImageUrl(getDefaultImage());
        } finally {
          setLoading(false);
        }
      } else {
        setImageUrl(getDefaultImage());
      }
    };

    fetchImage();
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [capsule.mediaContent]);

  const formatAddress = (address?: string) => {
    if (!address) return '未知地址';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getValidTimestamp = (timestamp: number): number => {
    try {
      if (!timestamp) return Date.now();
      if (String(timestamp).length < 13) {
        return timestamp * 1000;
      }
      return timestamp;
    } catch (error) {
      console.error('Invalid timestamp:', timestamp);
      return Date.now();
    }
  };

  const getCapsuleStatus = () => {
    const timestamp = getValidTimestamp(capsule.unlockTime);
    const now = Date.now();
    const isLocked = now < timestamp;
    const timeLeft = timestamp - now;

    if (!isLocked) return { 
      status: 'unlocked', 
      label: '已解锁',
      color: 'bg-green-100 text-green-700'
    };
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    if (days > 0) return { 
      status: 'locked', 
      label: `还剩 ${days} 天`,
      color: 'bg-amber-100 text-amber-700'
    };
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    if (hours > 0) return { 
      status: 'locked', 
      label: `还剩 ${hours} 小时`,
      color: 'bg-amber-100 text-amber-700'
    };
    
    const minutes = Math.floor(timeLeft / (1000 * 60));
    return { 
      status: 'locked', 
      label: `还剩 ${minutes} 分钟`,
      color: 'bg-amber-100 text-amber-700'
    };
  };

  const { status, label, color } = getCapsuleStatus();
  const isOwner = capsule.owner === currentAddress;
  const isRecipient = capsule.recipient === currentAddress;

  // 格式化胶囊信息
  const capsuleInfo: CapsuleInfo = {
    // 基础信息
    id: capsule.id,
    owner: formatAddress(capsule.owner),
    recipient: formatAddress(capsule.recipient),
    unlockTime: getValidTimestamp(capsule.unlockTime),
    
    // 内容信息
    content: capsule.content || '',
    contentType: capsule.contentType,
    mediaContent: capsule.mediaContent,
    mediaUrl: imageUrl,
    
    // 状态信息
    status: getCapsuleStatus().status,
    timeLeft: getCapsuleStatus().label
  };

  // 在使用mediaContent时进行转换
  const imgSrc = capsuleInfo.mediaContent ? 
    `data:image/jpeg;base64,${arrayBufferToBase64(new Uint8Array(Buffer.from(capsuleInfo.mediaContent, 'base64')))}` :
    (status === 'unlocked' ? DEFAULT_OPENED_IMG : DEFAULT_CLOSED_IMG);

  return (
    <motion.div
      whileHover={isPreview ? { scale: 1.02 } : {}}
      className={`
        overflow-hidden bg-white shadow-sm
        ${isPreview 
          ? 'h-[220px] rounded-[24px]' // 预览卡片样式调整
          : 'min-h-[600px] rounded-[32px]' // 详情卡片样式调整
        }
      `}
    >
      <div className={`relative ${isPreview ? 'h-[220px]' : 'h-[300px]'}`}>
        <Image
          src={imgSrc}
          alt="胶囊封面"
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = status === 'unlocked' ? DEFAULT_OPENED_IMG : DEFAULT_CLOSED_IMG
          }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {isPreview ? (
          <PreviewContent capsuleInfo={capsuleInfo} isOwner={isOwner} />
        ) : (
          <DetailContent 
            capsuleInfo={capsuleInfo} 
            isOwner={isOwner}
            status={status}
          />
        )}
      </div>

      {!isPreview && (
        <div className="p-8 space-y-6">
          <UnlockTimer unlockTime={capsuleInfo.unlockTime} />
          <CapsuleContent 
            capsuleInfo={capsuleInfo}
            status={status}
            isOwner={isOwner}
          />
        </div>
      )}
    </motion.div>
  );
}

// 倒计时组件
function UnlockTimer({ unlockTime }: { unlockTime: number }) {
  const isLocked = Date.now() < unlockTime;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-gray-500">
        <CalendarIcon size={16} />
        <span>{format(unlockTime, 'PPP')}</span>
      </div>
      {isLocked && <CountdownTimer unlockTime={unlockTime} />}
    </div>
  );
}

function CountdownTimer({ unlockTime }: { unlockTime: number }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = unlockTime - now;
      
      if (diff <= 0) {
        setTimeLeft('已解锁');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}天 ${hours}时 ${minutes}分 ${seconds}秒`);
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockTime]);

  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-center font-mono text-lg"
    >
      {timeLeft}
    </motion.div>
  );
}

function CapsuleContent({ capsuleInfo, status, isOwner }: {
  capsuleInfo: CapsuleInfo;
  status: string;
  isOwner: boolean;
}) {
  const getMaskedContent = (content: string) => {
    return content.replace(/./g, '*');
  };

  if (status === 'locked') {
    return (
      <div className="text-center py-8">
        <LockIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">内容已锁定</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isOwner ? '等待接收者解锁' : '请等待解锁时间到达'}
        </p>
        {capsuleInfo.content && (
          <p className="mt-4 text-sm text-gray-400 font-mono">
            {getMaskedContent(capsuleInfo.content)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="prose max-w-none markdown-preview-custom">
        <MarkdownPreview source={capsuleInfo.content} />
      </div>
      {capsuleInfo.mediaContent && (
        <div className="relative h-64 rounded-lg overflow-hidden">
          <Image
            src={capsuleInfo.mediaUrl || ''}
            alt="胶囊媒体内容"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

function PreviewContent({ capsuleInfo, isOwner }: { capsuleInfo: CapsuleInfo; isOwner: boolean }) {
  const getMaskedContent = (content: string) => {
    return content.replace(/./g, '*');
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm opacity-75">
            {isOwner ? '发送给: ' + capsuleInfo.recipient : '来自: ' + capsuleInfo.owner}
          </div>
          <div className="font-medium mt-2 line-clamp-2">
            {capsuleInfo.status === 'locked' ? getMaskedContent(capsuleInfo.content) : capsuleInfo.content}
          </div>
        </div>
        {capsuleInfo.status === 'locked' && (
          <div className="flex items-center space-x-2 ml-4">
            <LockIcon size={20} className="text-yellow-400" />
            <span className="text-sm font-medium">{capsuleInfo.timeLeft}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailContent({ capsuleInfo, isOwner, status }: {
  capsuleInfo: CapsuleInfo;
  isOwner: boolean;
  status: string;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm opacity-75">
              {isOwner ? '发送给' : '来自'}
            </div>
            <div className="font-medium">
              {isOwner ? capsuleInfo.recipient : capsuleInfo.owner}
            </div>
          </div>
          {status === 'locked' ? (
            <UnlockTimer unlockTime={capsuleInfo.unlockTime} />
          ) : (
            <UnlockIcon className="text-green-400" />
          )}
        </div>
        <div>
          <div className="text-sm opacity-75">解锁时间</div>
          <div className="font-medium">
            {format(capsuleInfo.unlockTime, 'PPP')}
          </div>
        </div>
      </div>
    </div>
  );
}
