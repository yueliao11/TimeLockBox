 'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectItem } from '@/components/ui/select';

interface CreateCapsuleProps {
  content: string;
  contentType: 'text' | 'image' | 'video';
  unlockTime: string;
  recipient: string;
}

export function CreateCapsule() {
  const [formData, setFormData] = useState<CreateCapsuleProps>({
    content: '',
    contentType: 'text',
    unlockTime: '',
    recipient: ''
  });
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAccount) {
      toast.error('Please connect wallet first');
      return;
    }

    const tx = new Transaction();
    const [capsule] = tx.moveCall({
      target: '${PACKAGE_ID}::capsule::create_capsule',
      arguments: [
        tx.pure.string(formData.content),
        tx..string(formData.contentType),
        tx.pure.u8(new Date(formData.unlockTime).getTime()),
        tx.pure.address(formData.recipient)
      ],
    });

    try {
      await signAndExecute({
        transaction: tx
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        value={formData.contentType}
        onValueChange={(value) => setFormData({...formData, contentType: value})}
      >
        <SelectItem value="text">Text</SelectItem>
        <SelectItem value="image">Image</SelectItem>
        <SelectItem value="video">Video</SelectItem>
      </Select>

      {formData.contentType === 'text' ? (
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          placeholder="Write your message..."
          className="min-h-[200px]"
        />
      ) : (
        <Input 
          type="file"
          accept={formData.contentType === 'image' ? 'image/*' : 'video/*'}
          onChange={handleFileUpload}
        />
      )}
      
      <Input
        type="datetime-local"
        value={formData.unlockTime}
        onChange={(e) => setFormData({...formData, unlockTime: e.target.value})}
      />

      <Input
        placeholder="Recipient wallet address"
        value={formData.recipient}
        onChange={(e) => setFormData({...formData, recipient: e.target.value})}
      />

      <Button type="submit">
        Create Time Capsule
      </Button>
    </form>
  );
} 
