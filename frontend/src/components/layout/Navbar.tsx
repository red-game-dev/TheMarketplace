'use client';

import { memo } from 'react';
import Link from 'next/link';
import { WalletConnect } from '@/components/features/wallet/WalletConnect';
import { useWallet } from '@/providers/WalletProvider';
import { NetworkSelector } from '@/components/features/wallet/NetworkSelector';

export const Navbar = memo(function Navbar() {
  const { address } = useWallet();

  return (
    <nav className="border-b border-border bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              Web3 Wallet
            </Link>
            {address && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/nfts"
                  className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  My NFTs
                </Link>
                <Link
                  href="/profile"
                  className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {address && <NetworkSelector />}
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
});
