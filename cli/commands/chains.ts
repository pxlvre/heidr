#!/usr/bin/env bun
import { Command } from 'commander';
import { listChains, getChainInfo } from '@/config/chains';
import { printError, printInfo } from '@/utils/formatter';
import {
  printChainsListTable,
  printChainsListJson,
  printChainInfoTable,
  printChainInfoJson,
} from '@/cli/printers/chains.printer';

/**
 * Command to list all supported chains or get info about a specific chain
 * @example
 * heidr chains --list
 * heidr chains --info mainnet
 * heidr chains --list --json
 */
export const chainsCommand = new Command('chains')
  .description('List all supported chains or get info about a specific chain')
  .option('-l, --list', 'List all supported chains')
  .option('-i, --info <chain>', 'Get detailed info about a specific chain')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      if (options.list) {
        // Get all chain names
        const chainNames = listChains();

        // Get full chain info for each chain
        const chainsInfo = chainNames
          .map((name) => {
            try {
              return getChainInfo(name);
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        // Print output
        if (options.json) {
          printChainsListJson(chainsInfo);
        } else {
          printChainsListTable(chainsInfo);
        }
      } else if (options.info) {
        // Get specific chain info
        const chainInfo = getChainInfo(options.info);

        // Print output
        if (options.json) {
          printChainInfoJson(chainInfo);
        } else {
          printChainInfoTable(chainInfo);
        }
      } else {
        printInfo('Use --list to see all supported chains or --info <chain> to get chain details');
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });
