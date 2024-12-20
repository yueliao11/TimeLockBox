'use client';

import { useState } from 'react';
import { CapsuleList } from './components/CapsuleList';
import { CapsuleFilters } from './components/CapsuleFilters';
import { motion } from 'framer-motion';
import { useCurrentAccount } from '@/hooks/useCurrentAccount';
import { redirect } from 'next/navigation';

export default function MyCapsules() {
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: ''
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold font-serif">Time Capsule Gallery</h1>
          <CapsuleFilters filters={filters} setFilters={setFilters} />
        </div>

        <CapsuleList filters={filters} />
      </motion.div>
    </div>
  );
} 