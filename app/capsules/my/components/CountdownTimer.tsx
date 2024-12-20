'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function CountdownTimer({ unlockTime }: { unlockTime: number }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      if (now >= unlockTime) {
        setTimeLeft('已解锁');
        return;
      }
      setTimeLeft(formatDistanceToNow(unlockTime, { addSuffix: true }));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [unlockTime]);

  return (
    <div className="text-center py-4">
      <div className="text-2xl font-bold">{timeLeft}</div>
      <div className="text-sm text-gray-500">距离解锁还有</div>
    </div>
  );
} 