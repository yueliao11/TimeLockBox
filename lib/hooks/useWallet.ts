'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WALLET_MESSAGES } from '@/lib/constants';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError(WALLET_MESSAGES.INSTALL_METAMASK);
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAddress(accounts[0]);
      setError(null);
    } catch (err) {
      setError(WALLET_MESSAGES.CONNECT_ERROR);
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
  };

  useEffect(() => {
    // Check if already connected
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.send('eth_accounts', [])
        .then(accounts => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
          }
        })
        .catch(console.error);
    }
  }, []);

  return {
    address,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet
  };
}