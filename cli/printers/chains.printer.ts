import Table from 'cli-table3';
import { prettyPrint, printInfo } from '@/utils/formatter';
import type { ChainInfo } from '@/config/chains';

/**
 * Print list of chains in table format
 * @param chainsInfo - Array of chain information
 */
export const printChainsListTable = (chainsInfo: ChainInfo[]): void => {
  const table = new Table({
    head: ['Chain ID', 'Chain Name', 'Native Currency'],
    style: { head: ['cyan'] },
  });

  chainsInfo.forEach((chainInfo) => {
    table.push([chainInfo.id.toString(), chainInfo.name, chainInfo.nativeCurrency.symbol]);
  });

  console.log(table.toString());
  printInfo(`\nTotal: ${chainsInfo.length} chains supported`);
};

/**
 * Print list of chains in JSON format
 * @param chainsInfo - Array of chain information
 */
export const printChainsListJson = (chainsInfo: ChainInfo[]): void => {
  prettyPrint(chainsInfo);
};

/**
 * Print single chain info in table format
 * @param chainInfo - Chain information
 */
export const printChainInfoTable = (chainInfo: ChainInfo): void => {
  const table = new Table({
    style: { head: ['cyan'] },
  });

  table.push(
    ['Name', chainInfo.name],
    ['Chain ID', chainInfo.id.toString()],
    [
      'Native Currency',
      `${chainInfo.nativeCurrency.name} (${chainInfo.nativeCurrency.symbol}) - ${chainInfo.nativeCurrency.decimals} decimals`,
    ],
    ['RPC URL', chainInfo.rpcUrls?.default.http[0] || 'N/A'],
    ['Block Explorer', chainInfo.blockExplorers?.default.url || 'N/A']
  );

  console.log(table.toString());
};

/**
 * Print single chain info in JSON format
 * @param chainInfo - Chain information
 */
export const printChainInfoJson = (chainInfo: ChainInfo): void => {
  prettyPrint(chainInfo);
};
