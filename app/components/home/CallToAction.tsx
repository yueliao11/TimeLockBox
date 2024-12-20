'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function CallToAction() {
  return (
    <div className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a"
          alt="Vintage memories"
          fill
          className="object-cover brightness-50"
        />
      </div>

      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-2xl mx-auto text-center text-white space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold">Start Creating Your Legacy</h2>
          <p className="text-lg opacity-90">
            Every moment is precious. Capture them now, share them when the time is right.
          </p>
          <Button size="lg" asChild className="bg-white text-black hover:bg-white/90">
            <Link href="/capsules/create">Create Your First Capsule</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 