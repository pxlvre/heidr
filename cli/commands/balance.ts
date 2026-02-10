import { Command } from 'commander';
import { RpcProvider } from '@/providers/rpc.provider';
import { getChain } from '@/config/chains';
import { BalanceService } from '@/services/rpc/balance.service';
import { printBalanceTable, printBalanceJson } from '@/cli/printers/balance.printer';
import chalk from 'chalk';

/**
 * Command to get balance of an address
 * @example
 * heidr balance 0x123...
 * heidr balance vitalik.eth
 * heidr balance 0x123... --chain arbitrum
 */
export const balanceCommand = new Command('balance')
  .description('Get balance of an address')
  .argument('<address>', 'Address to check balance for')
  .option('-c, --chain <chain>', 'Chain to query (default: mainnet)', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (addressOrEns: string, options: { chain: string; json?: boolean }) => {
    try {
      // Get chain configuration
      const chain = getChain(options.chain);
      const rpcUrl = chain.rpcUrls.default.http[0];

      if (!rpcUrl) {
        throw new Error(`No RPC URL available for chain: ${chain.name}`);
      }

      // Initialize provider and service
      const provider = new RpcProvider(rpcUrl, chain);
      const balanceService = new BalanceService(provider);

      // Get balance
      const result = await balanceService.getBalance(addressOrEns);

      // Print output
      if (options.json) {
        printBalanceJson(result, chain);
      } else {
        printBalanceTable(result, chain);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      } else {
        console.error(chalk.red('An unknown error occurred'));
      }
      process.exit(1);
    }
  });
