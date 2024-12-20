export const NETWORK = 'testnet' as const;
// #'0x6f1cb1a5abdab54c097e423679c6e7fbb4889b9dcf41f43cb8a3028596e9d113',
 
export const CONTRACT = {
  PACKAGE_ID: '0x1d1e075f3d8e6ee7f1f3c5cb03654790ff4ee412abc46699d2ff2af3dee239d4' ,
  CLOCK_ID: '0x6',
  MODULE: 'capsule',
    TIME_CAPSULE: 'TimeCapsule'
} as const;

export const PAGINATION = {
  PAGE_SIZE: 22,
} as const;

export const CHAIN = {
  TESTNET: 'sui:testnet',
  MAINNET: 'sui:mainnet',
} as const;

// 其他常量可以按模块分类添加
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect wallet first',
  CREATE_FAILED: 'Failed to create time capsule',
  // ...
} as const; 