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