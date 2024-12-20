import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT } from '@/config/constants';
import { error } from 'console';

interface CreateCapsuleData {
  content: string;
  mediaContent?: string;
  contentType: "text" | "image" | "video";
  unlockTime: string;
  unlockType?: "single" | "periodic";
  recipient: string;  // 改为 recipient 匹配调用方
}

export function useCreateCapsule() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const createCapsule = async (data: CreateCapsuleData) => {
    console.log('=== Contract Call Comparison ===');
    
    console.log('Form Schema Format:', {
      content: 'string',
      mediaContent: 'string?',
      contentType: '"text" | "image" | "video"',
      unlockTime: 'string',
      unlockType: '"single" | "periodic"?',
      recipient: 'string (0x...)'
    });

    const tx = new Transaction();
    const timestamp = Math.floor(new Date(data.unlockTime).getTime() / 1000);

    console.log('Final Contract Call:', {
      target: `${CONTRACT.PACKAGE_ID}::capsule::create_capsule`,
      arguments: [
        tx.pure.string(data.content || ''),
        tx.pure.string(data.mediaContent || ''),
        tx.pure.string(data.contentType),
        tx.pure.u64(timestamp),
        tx.pure.address(data.recipient),  // 使用 recipient
        tx.sharedObjectRef({
          objectId: CONTRACT.CLOCK_ID,
          mutable: false,
          initialSharedVersion: '1'
        })
      ]
    });

    return signAndExecute({
      transaction: tx,
      chain: 'sui:testnet',
    }, {
      onSuccess: (result) => {
        console.log('executed transaction', result);
      },
      onError: (error) => {
        console.log('exceed error', error);
      }
    });
  };

  return {
    createCapsule
  };
} 