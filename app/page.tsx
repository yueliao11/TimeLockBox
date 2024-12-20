'use client'

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusIcon, BoxIcon, InboxIcon, SparklesIcon, UserIcon, BellIcon, UsersIcon, CompassIcon } from 'lucide-react';
import { ConnectButton } from '@mysten/dapp-kit';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-50">
      {/* 导航栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-teal-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-8 h-8" />
            <span className="font-semibold text-lg bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              TimeLockBox
            </span>
          </motion.div>
          <ConnectButton />
        </div>
      </div>

      <div className="relative pt-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[50vh] flex flex-col items-center justify-center"
        >
          {/* 背景光效 */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,178,172,0.15)_0%,rgba(255,255,255,0)_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,white_100%)]" />
          </div>
          
          {/* Logo */}
          <div className="relative w-[400px] h-[300px] mb-8">
            <Image
              src="/logo.png"
              alt="TimeLockBox Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* 标题文案 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative text-center z-10"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-4">
              时光锁盒
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              将珍贵回忆封存，在最美好的时刻绽放
            </p>
          </motion.div>
        </motion.div>

        {/* 功能区域 */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 创建板块 */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-teal-700">
                <PlusIcon className="w-6 h-6 text-teal-500" />
                创建时光盒
              </h2>
              <div className="space-y-3">
                <Button
                  variant="default"
                  className="w-full justify-start gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-all duration-300"
                  onClick={() => router.push('/capsules/new')}
                >
                  <PlusIcon className="w-4 h-4" />
                  创建新胶囊
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-teal-200 hover:bg-teal-50 transition-colors duration-300"
                  onClick={() => router.push('/ai-assistant')}
                >
                  <SparklesIcon className="w-4 h-4" />
                  AI 创作助手
                </Button>
              </div>
            </motion.div>

            {/* 管理板块 */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-teal-700">
                <BoxIcon className="w-6 h-6 text-teal-500" />
                我的时光盒
              </h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 hover:bg-teal-50 transition-colors duration-300"
                  onClick={() => router.push('/capsules/my')}
                >
                  <BoxIcon className="w-4 h-4" />
                  已发送
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 hover:bg-teal-50 transition-colors duration-300"
                  onClick={() => router.push('/capsules/received')}
                >
                  <InboxIcon className="w-4 h-4" />
                  已收到
                </Button>
              </div>
            </motion.div>

            {/* 社交板块 */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-teal-700">
                <UsersIcon className="w-6 h-6 text-teal-500" />
                社交中心
              </h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 hover:bg-teal-50 transition-colors duration-300"
                  onClick={() => router.push('/friends')}
                >
                  <UsersIcon className="w-4 h-4" />
                  好友
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 hover:bg-teal-50 transition-colors duration-300"
                  onClick={() => router.push('/explore')}
                >
                  <CompassIcon className="w-4 h-4" />
                  发现
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 hover:bg-teal-50 transition-colors duration-300"
                  onClick={() => router.push('/notifications')}
                >
                  <BellIcon className="w-4 h-4" />
                  通知
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 hover:bg-teal-50 transition-colors duration-300"
                  onClick={() => router.push('/profile')}
                >
                  <UserIcon className="w-4 h-4" />
                  个人中心
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}