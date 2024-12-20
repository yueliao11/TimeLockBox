'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function Decorations() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute top-40 right-20"
      >
        <Image src="/gift-box.png" width={100} height={100} alt="礼物盒" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="absolute top-60 left-20"
      >
        <Image src="/vinyl.png" width={120} height={120} alt="唱片" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="absolute bottom-40 right-40"
      >
        <Image src="/capsule.png" width={60} height={60} alt="胶囊" />
      </motion.div>
    </div>
  );
} 