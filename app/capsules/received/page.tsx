'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { redirect } from 'next/navigation';
import { CapsuleList } from '../my/components/CapsuleList';
import { CapsuleFilters } from '../my/components/CapsuleFilters';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isValid } from 'date-fns';
import Image from 'next/image';
import StorageSDK from "walrus-sdk";
import { LockIcon, UnlockIcon } from 'lucide-react';
import { Button } from "@/components/ui/button"

const storage = new StorageSDK();

const getImage = async (blobId: string) => {
  try {
    const response = await storage.downloadBlob(blobId);
    return URL.createObjectURL(response);
  } catch (error) {
    console.error('Error getting image:', error);
    return '';
  }
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return isValid(date) ? format(date, 'PPP') : 'Invalid Date';
};

const CapsuleCard = ({ capsule }) => {
  const isUnlocked = new Date() >= new Date(capsule.unlockTime);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        {capsule.mediaContent && (
          <Image
            src={getImage(capsule.mediaContent)}
            alt={capsule.title || 'Capsule media'}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-4 right-4">
          {isUnlocked ? (
            <UnlockIcon className="text-green-400 w-6 h-6" />
          ) : (
            <LockIcon className="text-yellow-400 w-6 h-6" />
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-semibold truncate mb-1">{capsule.title}</h3>
          <p className="text-sm opacity-80">
            From: {capsule.sender.slice(0, 6)}...{capsule.sender.slice(-4)}
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Unlock Date:</span>
            <span className="font-medium">{formatDate(capsule.unlockTime)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Type:</span>
            <span className="font-medium capitalize">{capsule.dataType}</span>
          </div>

          {isUnlocked && (
            <p className="text-sm mt-2 line-clamp-2">
              {capsule.content}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

function Pagination({ 
  current, 
  pageSize, 
  total, 
  onChange, 
  onShowSizeChange 
}: {
  current: number
  pageSize: number
  total: number
  onChange: (page: number) => void
  onShowSizeChange: (current: number, size: number) => void
}) {
  const totalPages = Math.ceil(total / pageSize)
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        上一页
      </Button>
      
      <span className="mx-4">
        第 {current} 页 / 共 {totalPages} 页
      </span>

      <Button
        variant="outline" 
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
      >
        下一页
      </Button>

      <select 
        value={pageSize}
        onChange={(e) => onShowSizeChange(1, Number(e.target.value))}
        className="ml-4 p-2 border rounded"
      >
        <option value={12}>12 条/页</option>
        <option value={24}>24 条/页</option>
        <option value={36}>36 条/页</option>
      </select>
    </div>
  )
}

export default function ReceivedCapsules() {
  const account = useCurrentAccount();
  const [filters, setFilters] = useState({
    status: 'all',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-medium text-gray-900">
              Time Capsules Gallery
            </h1>
            <div className="flex items-center gap-4">
              <CapsuleFilters filters={filters} setFilters={setFilters} />
            </div>
          </div>

          <CapsuleList 
            filters={filters}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onTotalChange={setTotal}
          />
          
          <div className="mt-8 flex justify-center">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={setPage}
              onShowSizeChange={(current, size) => {
                setPage(1);
                setPageSize(size);
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}