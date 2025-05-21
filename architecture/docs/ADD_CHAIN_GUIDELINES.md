# Network Configuration Guide

## Overview of Changes

The network configuration has been updated to include additional popular blockchain networks and replace deprecated testnets. Key changes include:

1. **Added new mainnet networks:**

   - Base (Coinbase's Ethereum L2)
   - Solana (non-EVM)
   - Avalanche
   - BNB Chain (formerly Binance Smart Chain)
   - Fantom
   - Cronos
   - Harmony

2. **Updated testnets:**

   - Replaced Goerli with Sepolia (Ethereum's primary testnet)
   - Replaced Mumbai with Polygon Amoy
   - Added L2 testnets (Arbitrum Sepolia, Optimism Sepolia, Base Sepolia)
   - Added Solana Devnet and Testnet
   - Added Avalanche Fuji, Binance Testnet, and Fantom Testnet

3. **Structural improvements:**
   - Added `isEVM` flag to distinguish between EVM and non-EVM chains
   - Created separate `NON_EVM_CHAINS` object for frontend configuration

## Using the Network Configurations

### Backend (NestJS)

The network configurations are managed through the ConfigService and can be accessed in your NestJS application:

```typescript
import { ConfigService } from "@nestjs/config";
import { getNetworkConfigs, ChainId, NetworkConfig } from "./path-to-config";

@Injectable()
export class YourService {
  private networkConfigs: Record<ChainId, Partial<NetworkConfig>>;

  constructor(private configService: ConfigService) {
    this.networkConfigs = getNetworkConfigs(this.configService);
  }

  getNetworkDetails(chainId: ChainId): NetworkConfig {
    return this.networkConfigs[chainId] as NetworkConfig;
  }
}
```

### Frontend (React/Next.js)

For the frontend, you can use the CHAIN_PARAMS object to interact with wallets:

```typescript
import { CHAIN_PARAMS, NON_EVM_CHAINS, ChainId } from "@/path-to-config";

// To add an EVM network to MetaMask or other EVM wallets
const addNetwork = async (chainId: ChainId) => {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [CHAIN_PARAMS[chainId]],
    });
  } catch (error) {
    console.error("Error adding network:", error);
  }
};

// For non-EVM chains, use a different approach
const connectToSolana = async () => {
  if (!window.solana) {
    alert("Please install Phantom wallet");
    return;
  }

  try {
    // Use Solana connection details from NON_EVM_CHAINS
    // Implementation depends on the Solana wallet API
  } catch (error) {
    console.error("Error connecting to Solana:", error);
  }
};
```

## Environment Variables

Make sure to add these environment variables to your `.env` file for proper configuration:

```
# Mainnet RPC URLs
ETHEREUM_RPC_URL=https://eth.llamarpc.com
POLYGON_RPC_URL=https://polygon-rpc.com
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
OPTIMISM_RPC_URL=https://mainnet.optimism.io
BASE_RPC_URL=https://mainnet.base.org
AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
BINANCE_RPC_URL=https://bsc-dataseed.binance.org
CRONOS_RPC_URL=https://evm.cronos.org
HARMONY_RPC_URL=https://api.harmony.one
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Testnet RPC URLs
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
OPTIMISM_SEPOLIA_RPC_URL=https://sepolia.optimism.io
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
AVALANCHE_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
BINANCE_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com
SOLANA_TESTNET_RPC_URL=https://api.testnet.solana.com

# Blockchain Explorer API Keys
ETHEREUM_SCAN_API_KEY=your_etherscan_api_key
POLYGON_SCAN_API_KEY=your_polygonscan_api_key
ARBITRUM_SCAN_API_KEY=your_arbiscan_api_key
OPTIMISM_SCAN_API_KEY=your_optimistic_etherscan_api_key
BASE_SCAN_API_KEY=your_basescan_api_key
AVALANCHE_SCAN_API_KEY=your_snowtrace_api_key
BINANCE_SCAN_API_KEY=your_bscscan_api_key
CRONOS_SCAN_API_KEY=your_cronoscan_api_key
SOLANA_SCAN_API_KEY=your_solscan_api_key
```

## Required Logo Files

Make sure to add the following SVG logo files to your public/networks directory:

```
ethereum.svg
ethereum-testnet.svg
polygon.svg
polygon-testnet.svg
arbitrum.svg
arbitrum-testnet.svg
optimism.svg
optimism-testnet.svg
base.svg
base-testnet.svg
avalanche.svg
avalanche-testnet.svg
binance.svg
binance-testnet.svg
fantom.svg
fantom-testnet.svg
cronos.svg
harmony.svg
solana.svg
solana-testnet.svg
```

## Notes on Chain IDs

- Solana and other non-EVM chains don't have EVM-compatible chain IDs, so we've used high numbers (999997-999999) to represent them in our enum
- For EVM chains, the chain IDs match their standard network identifiers

## Handling Different Chain Types

When using these network configurations, always check the `isEVM` flag before attempting EVM-specific operations:

```typescript
const networkConfig = getNetworkDetails(chainId);
if (networkConfig.isEVM) {
  // Use EVM-specific code
} else {
  // Use chain-specific approach (e.g., Solana)
}
```
