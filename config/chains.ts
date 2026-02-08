import type { Chain } from 'viem';
import * as chains from 'viem/chains';
import { ConfigurationError } from '../errors';

/**
 * All supported chains from viem
 * Dynamically imported from viem/chains
 */
export const SUPPORTED_CHAINS: Record<string, Chain> = Object.entries(chains).reduce(
  (acc, [key, chain]) => {
    if (chain && typeof chain === 'object' && 'id' in chain && 'name' in chain) {
      // Use both the camelCase name and a kebab-case version
      acc[key] = chain as Chain;
      acc[key.toLowerCase()] = chain as Chain;

      // Also add kebab-case version for better CLI UX
      const kebabCase = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      if (kebabCase !== key.toLowerCase()) {
        acc[kebabCase] = chain as Chain;
      }
    }
    return acc;
  },
  {} as Record<string, Chain>
);

/**
 * Gets a chain by name or defaults to mainnet
 * @param chainName - Name of the chain (supports camelCase, lowercase, or kebab-case)
 * @returns The chain configuration
 * @throws {ConfigurationError} If chain name is not supported
 *
 * @example
 * getChain('mainnet') // Ethereum mainnet
 * getChain('arbitrum') // Arbitrum One
 * getChain('polygon-zkevm') // Polygon zkEVM
 */
export const getChain = (chainName?: string): Chain => {
  const name = (chainName || 'mainnet').toLowerCase();
  const chain = SUPPORTED_CHAINS[name];

  if (!chain) {
    throw new ConfigurationError(
      `Unsupported chain: ${name}. Run "heidr chains --list" to see all supported chains.`
    );
  }

  return chain;
};

/**
 * List all supported chain names
 * @returns Array of unique chain names
 */
export const listChains = (): string[] => {
  const uniqueChains = new Map<number, string>();

  Object.entries(SUPPORTED_CHAINS).forEach(([name, chain]) => {
    if (!uniqueChains.has(chain.id)) {
      uniqueChains.set(chain.id, name);
    }
  });

  return Array.from(uniqueChains.values()).sort();
};

/**
 * Get chain information by name
 * @param chainName - Name of the chain
 * @returns Chain information
 */
export const getChainInfo = (
  chainName: string
): {
  name: string;
  id: number;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls?: { default: { http: readonly string[] } };
  blockExplorers?: { default: { name: string; url: string } };
} => {
  const chain = getChain(chainName);
  return {
    name: chain.name,
    id: chain.id,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: chain.rpcUrls,
    blockExplorers: chain.blockExplorers,
  };
};
