'use client';

import { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { CONTRACT } from '@/config/constants';

interface Capsule {
  id: string;
  content: string;
  unlockTime: number;
}

export function CapsuleList() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const account = useCurrentAccount();
  const client = useSuiClient();

  useEffect(() => {
    if (!account) return;

    const fetchCapsules = async () => {
      const objects = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${CONTRACT.PACKAGE_ID}::capsule::TimeCapsule`
        },
        options: {
          showContent: true
        }
      });

      const capsuleData = objects.data
        .filter(obj => obj.data && obj.data.content)
        .map(obj => {
          const content = typeof obj.data.content === 'object' 
            ? JSON.stringify(obj.data.content)
            : String(obj.data.content);
            
          return {
            id: obj.data!.objectId,
            content: content,
            unlockTime: Number(obj.data!.unlock_time)
          };
        });

      setCapsules(capsuleData);
    };

    fetchCapsules();
  }, [account, client]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Time Capsules</h2>
      
      {capsules.map(capsule => (
        <div 
          key={capsule.id}
          className="p-4 border rounded-lg"
        >
          <div className="font-medium">
            Unlock Time: {new Date(capsule.unlockTime).toLocaleString()}
          </div>
          <div className="mt-2">
            {Date.now() < capsule.unlockTime ? (
              <span className="text-yellow-500">
                🔒 Content is locked until {new Date(capsule.unlockTime).toLocaleString()}
              </span>
            ) : (
              <div className="text-green-500">
                🔓 {capsule.content}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}