'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCapsule } from '@/hooks/useCreateCapsule';
import StorageSDK from "walrus-sdk";
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { isExists } from 'date-fns';

interface FormData {
  content: string;
  mediaContent: string | File | null;
  unlockTime: string;
  recipient: string;
}

export function CreateCapsule() {
  const [formData, setFormData] = useState<FormData>({
    content: '',
    mediaContent: null,
    unlockTime: '',
    recipient: '0x7865c7cbd6dc262645ba44713f260e62a66ea99d74746e8823658270cb4a4398'
  });
  const [contentType, setContentType] = useState<'text' | 'image' | 'video'>('text');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createCapsule, loading, account } = useCreateCapsule();
  const sdk = new StorageSDK();

  const uploadToWalrus = async (file: File) => {
    try {
      console.log('Uploading to Walrus:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      const response = await sdk.storeFile(file, 5);
      console.log('Walrus upload response:', response);
      
      // 递归查找 blobId
      const findBlobId = (obj: any): string | null => {
        if (!obj || typeof obj !== 'object') {
          return null;
        }

        if ('blobId' in obj) {
          return obj.blobId;
        }

        for (const key in obj) {
          const result = findBlobId(obj[key]);
          if (result) {
            return result;
          }
        }

        return null;
      };

      const blobId = findBlobId(response);
      if (!blobId) {
        throw new Error('No blobId found in response');
      }

      console.log('Extracted blobId:', blobId);
      return blobId;

    } catch (error) {
      console.error('Walrus upload error:', error);
      throw error;
    }
  };

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        console.log('No file selected');
        return;
      }

      console.log('Starting media upload...', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      setIsUploading(true);
      const blobId = await uploadToWalrus(file);
      
      console.log('Media uploaded to Walrus:', {
        blobId
      });

      // 更新表单数据，使用 blobId
      setFormData(prev => ({
        ...prev,
        mediaContent: blobId
      }));
      
      // 设置预览URL，使用 blobId
      const uploadImageUrl = "https://aggregator.walrus-testnet.walrus.space/";
      const imageUrl = uploadImageUrl + `v1/${blobId}`;
      console.log('Setting preview URL:', imageUrl);
      setPreviewUrl(imageUrl);

      console.log('Current form data:', {
        formData,
        previewUrl,
        isUploading
      });

    } catch (error) {
      console.error('Failed to upload media:', error);
      toast.error('Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content && !formData.mediaContent) {
      toast.error('Please provide either text content or media content');
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      
      const result = await createCapsule({
        content: String(formData.content || ''),
        mediaContent: String(formData.mediaContent || ''),
        contentType,
        unlockTime: formData.unlockTime,
        recipient: formData.recipient
      });

      console.log('Create capsule result:', result);
      
      // 重置表单
      setFormData({
        content: '',
        mediaContent: null,
        unlockTime: '',
        recipient: '0x7865c7cbd6dc262645ba44713f260e62a66ea99d74746e8823658270cb4a4398'
      });
      setPreviewUrl(null);
      setContentType('text');
      
    } catch (error) {
      console.error('Error creating capsule:', error);
      toast.error('Failed to create capsule');
    }
  };

  const handleMediaButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Enter your message..."
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
        />

        {/* 隐藏的文件输入 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleMediaUpload}
          accept="image/*"
          className="hidden"
        />

        {/* 媒体上传按钮 */}
        <Button
          type="button"
          variant="outline"
          onClick={handleMediaButtonClick}
          className="w-full"
          disabled={isUploading}
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            "Media Upload (Optional if text provided)"
          )}
        </Button>

        {/* 显示上传状态 */}
        {isUploading && (
          <div className="mt-2">
            <p>Uploading media...</p>
          </div>
        )}

        {/* 显示预览图片 */}
        {previewUrl && (
          <div className="mt-4">
            <img 
              src={previewUrl}
              alt="Preview" 
              className="max-w-xs rounded-lg shadow-md"
              onError={(e) => console.error('Image load error:', e)}
            />
          </div>
        )}

        <Input
          type="datetime-local"
          value={formData.unlockTime}
          onChange={(e) => setFormData(prev => ({ ...prev, unlockTime: e.target.value }))}
          required
        />

        <Input
          placeholder="Recipient Address"
          value={formData.recipient}
          onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
          required
        />
      </div>

      <Button type="submit" disabled={loading || isUploading}>
        {loading ? 'Creating...' : 'Create Time Capsule'}
      </Button>
    </form>
  );
}