'use client';

import { useState, useEffect } from 'react';
import { CapsuleCard } from './CapsuleCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { CONTRACT } from '@/config/constants';

interface CapsuleListProps {
  filters: {
    status: string;
    type: string;
    search: string;
  };
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onTotalChange?: (total: number) => void;
}

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

  useEffect(() => {
    if (!account) return;

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

        // 格式化胶囊数据
        const formattedCapsules = response.data.map(formatCapsuleData);
        
        // 根据过滤条件筛选
        const filteredCapsules = formattedCapsules.filter(capsule => {
          if (filters.status === 'all') return true;
          const isUnlocked = new Date() >= new Date(capsule.unlockTime);
          return filters.status === (isUnlocked ? 'unlocked' : 'locked');
        });

        // 计算总数
        const total = filteredCapsules.length;
        onTotalChange?.(total);

        // 分页切片
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedCapsules = filteredCapsules.slice(startIndex, endIndex);

        setCapsules(paginatedCapsules);
      } catch (error) {
        console.error('Error fetching capsules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, [account, filters, page, pageSize]);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {capsules.map(capsule => (
        <CapsuleCard key={capsule.id} capsule={capsule} />
      ))}
    </div>
  );
} 