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
        console.log('Fetching capsules for account:', account.address);
        console.log('Current filters:', filters);

        // 获取所有胶囊
        const response = await client.getOwnedObjects({
          owner: account.address,
          filter: { StructType: `${CONTRACT.PACKAGE_ID}::capsule::TimeCapsule` },
          options: { showContent: true }
        });

        console.log('Contract address:', CONTRACT.PACKAGE_ID);
        console.log('Filter:', { StructType: `${CONTRACT.PACKAGE_ID}::capsule::TimeCapsule` });

        console.log('Raw response:', response);
        console.log('Number of capsules found:', response.data.length);

        // 格式化胶囊数据
        const formattedCapsules = await Promise.all(
          response.data.map(async (item) => {
            const capsule = item.data;
            const fields = capsule?.content?.fields;
            
            console.log('Processing capsule:', item.data?.objectId);
            console.log('Capsule fields:', fields);
            
            return {
              id: item.data?.objectId,
              content: fields?.content,
              mediaContent: fields?.media_content,
              contentType: fields?.content_type,
              unlockTime: Number(fields?.unlock_time),
              owner: fields?.owner,
              recipient: fields?.recipient
            };
          })
        );

        console.log('Formatted capsules:', formattedCapsules);

        // 根据类型过滤
        const filteredCapsules = formattedCapsules.filter(capsule => {
          // 我创建的胶囊
          if (filters.type === 'created') {
            const isCreated = capsule.owner === account.address;
            console.log(`Capsule ${capsule.id} created filter:`, {
              owner: capsule.owner,
              currentUser: account.address,
              isCreated
            });
            return isCreated;
          }
          // 我收到的胶囊
          if (filters.type === 'received') {
            const isReceived = capsule.recipient === account.address;
            console.log(`Capsule ${capsule.id} received filter:`, {
              recipient: capsule.recipient,
              currentUser: account.address,
              isReceived
            });
            return isReceived;
          }
          return true;
        });

        console.log('After type filtering:', {
          type: filters.type,
          count: filteredCapsules.length,
          capsules: filteredCapsules
        });

        // 根据状态过滤
        const statusFilteredCapsules = filteredCapsules.filter(capsule => {
          if (filters.status === 'all') return true;
          const isUnlocked = Date.now() >= capsule.unlockTime;
          console.log(`Capsule ${capsule.id} status filter:`, {
            unlockTime: new Date(capsule.unlockTime).toISOString(),
            currentTime: new Date().toISOString(),
            isUnlocked,
            status: filters.status
          });
          return filters.status === (isUnlocked ? 'unlocked' : 'locked');
        });

        console.log('After status filtering:', {
          status: filters.status,
          count: statusFilteredCapsules.length,
          capsules: statusFilteredCapsules
        });

        // 分页
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedCapsules = statusFilteredCapsules.slice(startIndex, endIndex);

        console.log('Final paginated results:', {
          page,
          pageSize,
          total: statusFilteredCapsules.length,
          displayed: paginatedCapsules.length,
          capsules: paginatedCapsules
        });

        setCapsules(paginatedCapsules);
        onTotalChange?.(statusFilteredCapsules.length);
      } catch (error) {
        console.error('Error fetching capsules:', {
          error,
          message: error.message,
          stack: error.stack
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, [account, filters, page, pageSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        {/* 左侧列表 */}
        <div className="w-1/2">
          <div className="grid grid-cols-2 gap-4">
            {capsules.map((capsule) => (
              <motion.div
                key={capsule.id}
                layoutId={capsule.id}
                onClick={() => setSelectedId(capsule.id)}
                whileHover={{ scale: 1.02, translateY: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-2xl shadow-lg border border-teal-100 hover:shadow-xl transition-shadow overflow-hidden"
              >
                <CapsuleCard
                  capsule={capsule}
                  currentAddress={account?.address || ''}
                  isPreview={true}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* 右侧详情 */}
        <AnimatePresence>
          {selectedId && (
            <motion.div 
              className="w-1/2 sticky top-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {capsules
                .filter(capsule => capsule.id === selectedId)
                .map(capsule => (
                  <div key={capsule.id} className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
                    <CapsuleCard
                      capsule={capsule}
                      currentAddress={account?.address || ''}
                      isPreview={false}
                    />
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 