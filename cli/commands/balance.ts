import { Command } from 'commander';
import { RpcProvider } from '@/providers/rpc.provider';
import { getChain } from '@/config/chains';
import { BalanceService } from '@/services/rpc/balance.service';
import {
  printBalanceTable,
  printBalanceJson,
  printTokenBalanceTable,
  printTokenBalanceJson,
} from '@/cli/printers/balance.printer';
import { printError } from '@/utils/formatter';

/**
 * Command to get balance of an address
 * @example
 * heidr balance 0x123...
 * heidr balance vitalik.eth
 * heidr balance 0x123... --chain arbitrum
 * heidr balance 0x123... --token 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
 */
export const balanceCommand = new Command('balance')
  .description('Get balance of an address')
  .argument('<address>', 'Address to check balance for')
  .option('-c, --chain <chain>', 'Chain to query (default: mainnet)', 'mainnet')
  .option('-t, --token <addr>', 'ERC-20 token contract address')
  .option('-j, --json', 'Output as JSON')
  .action(
    async (addressOrEns: string, options: { chain: string; token?: string; json?: boolean }) => {
      try {
        const chain = getChain(options.chain);
        const rpcUrl = chain.rpcUrls.default.http[0];

        if (!rpcUrl) {
          throw new Error(`No RPC URL available for chain: ${chain.name}`);
        }

        const provider = new RpcProvider(rpcUrl, chain);
        const balanceService = new BalanceService(provider);

        if (options.token) {
          const result = await balanceService.getTokenBalance(addressOrEns, options.token);
          if (options.json) {
            printTokenBalanceJson(result, chain);
          } else {
            printTokenBalanceTable(result, chain);
          }
        } else {
          const result = await balanceService.getBalance(addressOrEns);
          if (options.json) {
            printBalanceJson(result, chain);
          } else {
            printBalanceTable(result, chain);
          }
        }
      } catch (error) {
        printError(error instanceof Error ? error.message : 'Unknown error occurred');
        process.exit(1);
      }
    }
  );
