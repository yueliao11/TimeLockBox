'use client';

import Image from 'next/image';
import { motion, useAnimationControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

export function Hero() {
  const controls = useAnimationControls();
  const text = "Preserve Today's Memories for Tomorrow's Stories";
  
  useEffect(() => {
    const animateText = async () => {
      while (true) {
        // 打字效果
        for (let i = 0; i <= text.length; i++) {
          await controls.start({
            text: text.slice(0, i),
            transition: { duration: 0.05 }
          });
        }
        
        // 停留一会
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 删除效果
        for (let i = text.length; i >= 0; i--) {
          await controls.start({
            text: text.slice(0, i),
            transition: { duration: 0.05 }
          });
        }
        
        // 停留一会再重新开始
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    animateText();
  }, [controls, text]);

  return (
    <div className="relative min-h-[55vh] sm:min-h-[60vh] flex items-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1516541196182-6bdb0516ed27"
          alt="Vintage letters and postcards"
          fill
          className="object-cover brightness-[0.65] saturate-[1.2]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 mix-blend-overlay" />
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl space-y-4 sm:space-y-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] relative">
            <motion.span
              initial={{ text: "" }}
              animate={controls}
              className="inline-block"
            >
              {text}
            </motion.span>
            <span className="inline-block w-[2px] h-[1em] bg-white ml-1 animate-blink" />
          </h1>
          <p className="text-xl sm:text-2xl font-medium opacity-90">
            Create digital time capsules to capture moments, thoughts, and feelings. 
            Share them with loved ones when the time is right.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <Button 
              size="lg" 
              asChild 
              className="w-full sm:w-auto text-lg h-12 sm:h-14"
            >
              <Link href="/capsules/create">Start Your Journey</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-lg h-12 sm:h-14 backdrop-blur-sm border-white/30 hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 