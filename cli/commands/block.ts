#!/usr/bin/env bun
/**
 * Command to get block information
 * @example
 * heidr block latest
 * heidr block latest --chain arbitrum
 * heidr block 12345 --chain polygon
 */
import { Command } from 'commander';
import { RpcProvider } from '@/providers/rpc.provider';
import { getChain } from '@/config/chains';
import { BlockService } from '@/services/rpc/block.service';
import { printBlockTable, printBlockJson } from '@/cli/printers/block.printer';
import { printError } from '@/utils/formatter';

export const blockCommand = new Command('block')
  .description('Get block information')
  .argument('[block]', 'Block number or "latest"', 'latest')
  .option('-c, --chain <chain>', 'Chain name or ID', 'mainnet')
  .option('--json', 'Output as JSON')
  .action(async (blockArg: string, options) => {
    try {
      // Get chain configuration
      const chain = getChain(options.chain);
      const rpcUrl = chain.rpcUrls.default.http[0];

      if (!rpcUrl) {
        throw new Error(`No RPC URL available for chain: ${chain.name}`);
      }

      // Initialize provider and service
      const provider = new RpcProvider(rpcUrl, chain);
      const blockService = new BlockService(provider);

      // Get block
      const block = await blockService.getBlock(blockArg);

      // Print output
      if (options.json) {
        printBlockJson(block);
      } else {
        printBlockTable(block);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });
