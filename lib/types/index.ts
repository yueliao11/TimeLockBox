export interface User {
  id: string;
  walletAddress: string;
  nickname: string;
  avatar: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  linkedWallets: string[];
}

export interface TimeCapsule {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  type: 'one-time' | 'recurring';
  status: 'pending' | 'unlocked' | 'cancelled';
  unlockTimes: UnlockTime[];
  recipients: string[];
  contents: Content[];
  encryptionKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnlockTime {
  date: Date;
  type: 'fixed' | 'yearly';
  notified: boolean;
}

export interface Content {
  id: string;
  type: 'image' | 'video' | 'audio' | 'text';
  mimeType: string;
  size: number;
  url: string;
  thumbnail?: string;
  duration?: number;
}