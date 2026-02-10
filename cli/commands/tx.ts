#!/usr/bin/env bun
/**
 * Command to get transaction information
 * @example
 * heidr tx 0x123...
 * heidr tx 0x123... --chain arbitrum
 * heidr tx 0x123... --json
 */
import { Command } from 'commander';
import { RpcProvider } from '@/providers/rpc.provider';
import { getChain } from '@/config/chains';
import { TransactionService } from '@/services/rpc/transaction.service';
import { printTransactionTable, printTransactionJson } from '@/cli/printers/transaction.printer';
import { printError } from '@/utils/formatter';

export const txCommand = new Command('tx')
  .description('Get transaction information')
  .argument('<hash>', 'Transaction hash')
  .option('-c, --chain <chain>', 'Chain name or ID', 'mainnet')
  .option('--json', 'Output as JSON')
  .action(async (hash: string, options) => {
    try {
      // Get chain configuration
      const chain = getChain(options.chain);
      const rpcUrl = chain.rpcUrls.default.http[0];

      if (!rpcUrl) {
        throw new Error(`No RPC URL available for chain: ${chain.name}`);
      }

      // Initialize provider and service
      const provider = new RpcProvider(rpcUrl, chain);
      const transactionService = new TransactionService(provider);

      // Get transaction
      const tx = await transactionService.getTransaction(hash);

      // Print output
      if (options.json) {
        printTransactionJson(tx);
      } else {
        printTransactionTable(tx);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });
