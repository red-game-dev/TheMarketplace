import React, { memo } from 'react';
import { formatDistance } from 'date-fns';
import { Transaction } from '@/types/api';
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { shortenAddress } from '@/utils/string/shortenWeb3Address';
import { TransactionStatus } from './TransactionStatus';
import Link from 'next/link';

interface TransactionRowProps {
    address: string
  tx: Transaction;
}

export const TransactionRow =  memo(function TransactionRow({ tx, address }: TransactionRowProps) {
  return (
    <div key={tx.id} className="transaction-item">
        <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
            {tx.from_address.toLowerCase() === address?.toLowerCase() ? (
            <ArrowUpRight className="w-5 h-5 text-error" />
            ) : (
            <ArrowDownLeft className="w-5 h-5 text-success" />
            )}
            <div>
            <p className="font-medium text-foreground">
                {tx.from_address.toLowerCase() === address?.toLowerCase()
                ? 'Sent'
                : 'Received'}{' '}
                {tx.nftMetadata?.name || `NFT #${tx.token_id}`}
            </p>
            <p className="text-sm text-muted-foreground">
                {tx.from_address.toLowerCase() === address?.toLowerCase()
                ? `To: ${shortenAddress(tx.to_address)}`
                : `From: ${shortenAddress(tx.from_address)}`}
            </p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-sm text-muted-foreground">
            {formatDistance(new Date(tx.created_at), new Date(), {
                addSuffix: true,
            })}
            </p>
            <div className="mt-1">
            <TransactionStatus status={tx.status} />
            </div>
        </div>
        </div>
        {tx.tx_hash && (
        <Link
            href={`https://polygonscan.com/tx/${tx.tx_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-sm text-muted-foreground hover:text-muted-foreground/80"
        >
            View on PolygonScan
            <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
        )}
    </div>
  );
})