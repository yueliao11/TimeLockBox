import { useState, useEffect } from 'react';
//import { useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';

import { toast } from 'sonner';
import { CONTRACT, CHAIN, ERROR_MESSAGES } from '@/config/constants';
import StorageSDK from "walrus-sdk";

interface CreateCapsuleParams {
  content: string;
  mediaContent: string;
  contentType: 'text' | 'image' | 'video';
  unlockTime: string;
  recipient: string;
}

export function useCreateCapsule() {
  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const sdk = new StorageSDK();

  useEffect(() => {
    if (account) {
      const network = account.chains[0].split(':')[1];
      toast.info(`Connected to ${network}`);
    }
  }, [account]);

  const uploadToWalrus = async (file: File): Promise<string> => {
    try {
      setUploadingMedia(true);
      toast.info('Uploading media to Walrus...');
      
      const result = await sdk.storeFile(file);
      toast.success('Media uploaded successfully');
      return result.id;
      
    } catch (error) {
      console.error('Walrus upload failed:', error);
      toast.error('Failed to upload media');
      throw error;
    } finally {
      setUploadingMedia(false);
    }
  };

  const createCapsule = async ({
    content,
    mediaContent,
    contentType,
    unlockTime,
    recipient
  }: CreateCapsuleParams) => {
    if (!account) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    if (!content && !mediaContent) {
      toast.error('Please provide either text content or media content');
      return;
    }

    const tx = new Transaction();
    const timestamp = new Date(unlockTime).getTime();

    try {
      setLoading(true);
      
      const mediaId = mediaContent || '';
      
      const contentStr = content ? String(content) : '';
      
      console.log('\n=== Create Time Capsule Transaction Parameters ===');
      console.log('Package ID:', CONTRACT.PACKAGE_ID, '(string)');
      console.log('Module:', 'capsule', '(string)');
      console.log('Function:', 'create_capsule', '(string)');
      
      console.log('\nArguments with types:');
      console.log('1. content:', {
        value: contentStr,
        type: 'string',
        length: contentStr.length
      });
      
      console.log('2. media_content:', {
        value: mediaId,
        type: 'string',
        length: mediaId.length
      });
      
      console.log('3. content_type:', {
        value: contentType,
        type: 'string',
        validValues: ['text', 'image', 'video']
      });
      
      console.log('4. unlock_time:', {
        value: timestamp,
        type: 'u64',
        date: new Date(timestamp).toISOString()
      });
      
      console.log('5. recipient:', {
        value: recipient,
        type: 'address',
        length: recipient.length
      });
      
      console.log('6. clock:', {
        value: CONTRACT.CLOCK_ID,
        type: 'shared_object',
        mutable: false,
        version: '1'
      });

      const args = [
        tx.pure.string(contentStr),
        tx.pure.string(mediaId),
        tx.pure.string(contentType),
        tx.pure.u64(timestamp),
        tx.pure.address(recipient),
        tx.sharedObjectRef({
          objectId: CONTRACT.CLOCK_ID,
          mutable: false,
          initialSharedVersion: '1'
        })
      ];

      tx.moveCall({
        target: `${CONTRACT.PACKAGE_ID}::capsule::create_capsule`,
        arguments: args
      });

      console.log('\n=== Executing Transaction ===');
      
      await signAndExecuteTransaction(
        {
          transaction: tx,
          chain :"sui:testnet"
        },
        {
          onSuccess: (result) => {
            console.log('\n=== Transaction Result ===');
            console.log('Status: Success');
            console.log('Digest:', result.digest);
            console.log('Effects:', result.effects);
            toast.success('Time capsule created!');
          },
          onError: (error) => {
            console.log('\n=== Transaction Error ===');
            console.error('Status: Failed');
            console.error('Error:', error);
            toast.error('Failed to create time capsule');
          }
        }
      );
    } catch (error) {
      console.error('Error creating capsule:', error);
      toast.error('Error creating time capsule');
    } finally {
      setLoading(false);
    }
  };

  return { 
    createCapsule, 
    loading: loading || uploadingMedia,
    account 
  };
} 