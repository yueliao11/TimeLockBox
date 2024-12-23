import { StorageSDK } from 'walrus-sdk';
import { publicEncrypt, privateDecrypt } from 'crypto';

interface CapsuleContent {
  text?: string;
  mediaId?: string;
}

export class CapsuleEncryption {
  private storage: StorageSDK;
  private platformPublicKey: string;
  private platformPrivateKey: string;

  constructor() {
    this.storage = new StorageSDK();
    // 从环境变量或配置中获取密钥
    this.platformPublicKey = process.env.PLATFORM_PUBLIC_KEY || '';
    this.platformPrivateKey = process.env.PLATFORM_PRIVATE_KEY || '';
  }

  // 加密并上传内容
  async encryptAndStore(content: CapsuleContent): Promise<string> {
    // 1. 打包成JSON
    const contentJson = JSON.stringify(content);
    
    // 2. 使用平台公钥加密
    const encryptedData = publicEncrypt(
      this.platformPublicKey,
      Buffer.from(contentJson)
    );
    
    // 3. 上传到海象存储
    const response = await this.storage.storeFile(
      new Blob([encryptedData]), 
      5
    );
    
    // 4. 返回存储ID
    return this.extractBlobId(response);
  }

  // 获取并解密内容
  async retrieveAndDecrypt(storageId: string): Promise<CapsuleContent> {
    // 1. 从海象存储获取加密数据
    const encryptedData = await this.storage.retrieveFile(storageId);
    
    // 2. 使用平台私钥解密
    const decryptedData = privateDecrypt(
      this.platformPrivateKey,
      Buffer.from(encryptedData)
    );
    
    // 3. 解析JSON
    return JSON.parse(decryptedData.toString());
  }

  private extractBlobId(response: any): string {
    if (!response?.blobId) {
      throw new Error('Failed to get storage ID');
    }
    return response.blobId;
  }
} 