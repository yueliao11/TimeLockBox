'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { LockIcon, HeartIcon, ClockIcon } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <LockIcon className="w-6 h-6 text-primary" />,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
      title: "Securely Encrypted",
      description: "Your memories are safely encrypted and stored until the moment you choose to share them."
    },
    {
      icon: <HeartIcon className="w-6 h-6 text-primary" />,
      image: "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a",
      title: "Share with Love",
      description: "Send your capsules to loved ones, letting them discover your precious memories at the perfect time."
    },
    {
      icon: <ClockIcon className="w-6 h-6 text-primary" />,
      image: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065",
      title: "Time-Released Magic",
      description: "Set the perfect moment for your capsules to be opened, creating magical moments of discovery."
    }
  ];

  return (
    <div className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 