'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import StorageSDK from "walrus-sdk";
import Image from 'next/image';

export function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [blobId, setBlobId] = useState<string | null>(null);

  const sdk = new StorageSDK();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      setUploading(true);
      
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      
      const result = await sdk.storeFile(file);
      setBlobId(result.id);
      
      console.log('Upload success:', result);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="imageInput"
      />
      
      <Button 
        variant="outline"
        onClick={() => document.getElementById('imageInput')?.click()}
      >
        Select Image
      </Button>

      {selectedImage && (
        <div className="space-y-4">
          <div className="relative w-full h-[200px]">
            <Image
              src={selectedImage}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
          
          <Button
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload to Walrus'}
          </Button>

          {blobId && (
            <div className="text-sm text-muted-foreground">
              Blob ID: {blobId}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 