import type { RpcProvider } from '@/providers/rpc.provider';
import { getChain } from '@/config/chains';
import { formatUnits } from 'viem';

const erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;

export interface TokenBalanceResult {
  address: `0x${string}`;
  tokenAddress: `0x${string}`;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  rawBalance: bigint;
  formattedBalance: string;
}

export interface BalanceResult {
  address: `0x${string}`;
  balance: bigint;
  ensName?: string;
}

/**
 * Service for balance-related operations
 */
export class BalanceService {
  constructor(private provider: RpcProvider) {}

  /**
   * Resolve ENS name to address
   * @param ensName - ENS name to resolve
   * @returns Resolved address
   */
  private async resolveEnsName(ensName: string): Promise<`0x${string}`> {
    const mainnetChain = getChain('mainnet');
    const mainnetProvider = new (await import('@/providers/rpc.provider')).RpcProvider(
      mainnetChain.rpcUrls.default.http[0]!,
      mainnetChain
    );

    const resolved = await mainnetProvider.getClient().getEnsAddress({ name: ensName });
    if (!resolved) {
      throw new Error(`Could not resolve ENS name: ${ensName}`);
    }

    return resolved;
  }

  /**
   * Get balance for an address or ENS name
   * @param addressOrEns - Address or ENS name
   * @returns Balance result with address and balance
   */
  async getBalance(addressOrEns: string): Promise<BalanceResult> {
    let address: `0x${string}`;
    let ensName: string | undefined;

    // Check if it's an ENS name
    if (addressOrEns.endsWith('.eth')) {
      address = await this.resolveEnsName(addressOrEns);
      ensName = addressOrEns;
    } else {
      address = addressOrEns as `0x${string}`;
    }

    // Get balance
    const balance = await this.provider.getBalance(address);

    return {
      address,
      balance,
      ensName,
    };
  }

  async getTokenBalance(walletAddress: string, tokenAddress: string): Promise<TokenBalanceResult> {
    const wallet = walletAddress as `0x${string}`;
    const token = tokenAddress as `0x${string}`;

    const [rawBalance, decimals, symbol, name] = await Promise.all([
      this.provider.readContract({
        address: token,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [wallet],
      }) as Promise<bigint>,
      this.provider.readContract({
        address: token,
        abi: erc20Abi,
        functionName: 'decimals',
      }) as Promise<number>,
      this.provider.readContract({
        address: token,
        abi: erc20Abi,
        functionName: 'symbol',
      }) as Promise<string>,
      this.provider.readContract({
        address: token,
        abi: erc20Abi,
        functionName: 'name',
      }) as Promise<string>,
    ]);

    return {
      address: wallet,
      tokenAddress: token,
      tokenName: name,
      tokenSymbol: symbol,
      tokenDecimals: decimals,
      rawBalance,
      formattedBalance: formatUnits(rawBalance, decimals),
    };
  }
}
