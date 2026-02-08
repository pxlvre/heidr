#!/usr/bin/env bun
/**
 * Command to get block information
 * @example
 * heidr block latest
 */
import { Command } from 'commander';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { prettyPrint, printError } from '../../utils/formatter.js';

export const blockCommand = new Command('block')
  .description('Get block information')
  .argument('[block]', 'Block number or "latest"', 'latest')
  .option('--json', 'Output as JSON')
  .action(async (blockArg: string, _options) => {
    try {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(),
      });

      const block = await client.getBlock({
        blockTag: blockArg === 'latest' ? 'latest' : undefined,
        blockNumber: blockArg !== 'latest' ? BigInt(blockArg) : undefined,
      });

      prettyPrint(block);
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });
