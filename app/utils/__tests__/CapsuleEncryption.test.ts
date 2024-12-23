import { CapsuleEncryption } from '../CapsuleEncryption';

describe('CapsuleEncryption', () => {
  let capsuleEncryption: CapsuleEncryption;

  beforeEach(() => {
    capsuleEncryption = new CapsuleEncryption();
  });

  test('should encrypt and store content successfully', async () => {
    const content = {
      text: 'Hello World',
      mediaId: 'abc123'
    };

    const storageId = await capsuleEncryption.encryptAndStore(content);
    expect(storageId).toBeTruthy();
  });

  test('should retrieve and decrypt content correctly', async () => {
    const originalContent = {
      text: 'Hello World',
      mediaId: 'abc123'
    };

    const storageId = await capsuleEncryption.encryptAndStore(originalContent);
    const decryptedContent = await capsuleEncryption.retrieveAndDecrypt(storageId);

    expect(decryptedContent).toEqual(originalContent);
  });
}); 