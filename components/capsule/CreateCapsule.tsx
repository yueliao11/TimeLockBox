'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCapsule } from '@/hooks/useCreateCapsule';
import StorageSDK from "walrus-sdk";
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Wand2Icon } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import MDEditor from '@uiw/react-md-editor';

// 初始化 Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp" });

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
    recipient: '0xa7110cb126d5553ff02616f9100cb385db200b2368766903b707b4275baa09c7'
  });
  const [contentType, setContentType] = useState<'text' | 'image' | 'video'>('text');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createCapsule, loading, account } = useCreateCapsule();
  const sdk = new StorageSDK();

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const prompt = formData.content 
        ? `请将以下文字改写得更加文艺优美，但保持原意：\n${formData.content}`
        : `请以时光胶囊的主题，写一段富有诗意的文字，表达对未来的期待和当下的感悟。要求：\n1. 语言优美\n2. 富有感情\n3. 100-200字左右`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      setFormData(prev => ({
        ...prev,
        content: text
      }));
    } catch (error) {
      console.error('AI生成错误:', error);
      toast.error('内容生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 添加递归查找函数
  const findBlobId = (obj: any): string | null => {
    // 如果是null或undefined,返回null
    if (!obj) return null;
    
    // 如果找到blobId属性,直接返回
    if (obj.blobId) return obj.blobId;
    
    // 如果是对象,递归搜索所有属性
    if (typeof obj === 'object') {
      for (const key in obj) {
        const result = findBlobId(obj[key]);
        if (result) return result;
      }
    }
    
    return null;
  };

  // 修改uploadToWalrus函数
  const uploadToWalrus = async (file: File) => {
    try {
      console.log('Uploading to Walrus:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      const response = await sdk.storeFile(file, 5);
      console.log('Walrus upload response:', response);
      
      // 使用递归函数查找blobId
      const blobId = findBlobId(response);
      if (!blobId) {
        throw new Error('Failed to find blobId in response');
      }
      
      console.log('Found blobId:', blobId);
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
      await createCapsule({
        content: String(formData.content || ''),
        mediaContent: String(formData.mediaContent || ''),
        contentType,
        unlockTime: formData.unlockTime,
        recipient: formData.recipient
      });

      // 重置表单
      setFormData({
        content: '',
        mediaContent: null,
        unlockTime: '',
        recipient: '0xa7110cb126d5553ff02616f9100cb385db200b2368766903b707b4275baa09c7'
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
        <div className="relative markdown-editor-container">
          <MDEditor
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
            preview="edit"
            height={300}
            className="rounded-lg border border-input hover:border-accent"
            textareaProps={{
              placeholder: "写下你想说的话...",
              required: true
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={generateContent}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <Wand2Icon className="w-4 h-4" />
            )}
          </Button>
        </div>

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