import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import Image from 'next/image';
import Link from 'next/link';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function PageLayout({ children, title, description, icon }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-50">
      {/* 导航栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-teal-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-8 h-8" />
            <span className="font-semibold text-lg bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              TimeLockBox
            </span>
          </Link>
          <ConnectButton />
        </div>
      </div>

      <div className="pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* 页面标题区 */}
          <div className="mb-8 text-center">
            {icon && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-4 inline-flex"
              >
                {icon}
              </motion.div>
            )}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-gray-600">{description}</p>
            )}
          </div>

          {/* 内容区 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 