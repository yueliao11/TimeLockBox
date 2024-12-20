'use client';

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageIcon, FileIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_SIZE = 200 * 1024 * 1024; // 200MB
const ACCEPTED_FILES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
  'video/*': ['.mp4'],
  'audio/*': ['.mp3'],
  'text/*': ['.txt']
};

export function FileUpload({ form }) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    const totalSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    
    if (totalSize > MAX_SIZE) {
      alert("Total file size exceeds 200MB limit");
      return;
    }
    
    setFiles(newFiles);
    form.setValue('files', newFiles);
  }, [files, form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILES,
    maxSize: MAX_SIZE
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    form.setValue('files', newFiles);
  };

  return (
    <FormField
      control={form.control}
      name="files"
      render={() => (
        <FormItem>
          <FormLabel>Upload Files</FormLabel>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports images, videos, audio and text files (Max 200MB total)
                </p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center space-x-2">
                    <FileIcon className="w-4 h-4" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 