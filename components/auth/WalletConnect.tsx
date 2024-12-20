'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from "@/components/ui/button";

export function WalletConnect() {
  const account = useCurrentAccount();
  
  return (
    <div className="flex flex-col items-center gap-4">
      <ConnectButton connectText="Connect Wallet">
        {({ connecting, connected, connect, disconnect }) => (
          <Button 
            onClick={connected ? disconnect : connect}
            variant={connected ? "outline" : "default"}
          >
            {connecting ? 'Connecting...' : connected ? 'Disconnect' : 'Connect Wallet'}
          </Button>
        )}
      </ConnectButton>
      
      {account && (
        <div className="text-sm text-muted-foreground">
          Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </div>
      )}
    </div>
  );
}