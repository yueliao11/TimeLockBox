import { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { toast } from 'sonner';

interface Capsule {
  id: string;
  content: string;
  contentType: string;
  unlockTime: number;
  owner: string;
  recipient: string;
}

export function useGetMyCapsules() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();

  useEffect(() => {
    const fetchCapsules = async () => {
      if (!account) return;

      try {
        setLoading(true);
        // 查询当前钱包地址发送的胶囊
        const { data } = await suiClient.queryMoveObjects({
          filter: {
            MatchAll: [
              { StructType: `${CONTRACT.PACKAGE_ID}::capsule::TimeCapsule` },
              { AddressOwner: account.address }
            ]
          }
        });

        const formattedCapsules = data.map(obj => ({
          id: obj.objectId,
          content: obj.content,
          contentType: obj.content_type,
          unlockTime: Number(obj.unlock_time),
          owner: obj.owner,
          recipient: obj.recipient
        }));

        setCapsules(formattedCapsules);
      } catch (error) {
        console.error('Failed to fetch capsules:', error);
        toast.error('Failed to load capsules');
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, [account, suiClient]);

  return { capsules, loading };
} 