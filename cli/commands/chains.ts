#!/usr/bin/env bun
import { Command } from 'commander';
import Table from 'cli-table3';
import { listChains, getChainInfo } from '../../config/chains.js';
import { prettyPrint, printError, printInfo } from '../../utils/formatter.js';

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
        const chainNames = listChains();

        if (options.json) {
          // Get full chain info for each chain name
          const chainsInfo = chainNames
            .map((name) => {
              try {
                return getChainInfo(name);
              } catch {
                return null;
              }
            })
            .filter(Boolean);
          prettyPrint(chainsInfo);
        } else {
          const table = new Table({
            head: ['Chain ID', 'Chain Name', 'Native Currency'],
            style: { head: ['cyan'] },
          });

          chainNames.forEach((chainName) => {
            try {
              const chainInfo = getChainInfo(chainName);
              table.push([
                chainInfo.id.toString(),
                chainInfo.name,
                chainInfo.nativeCurrency.symbol,
              ]);
            } catch {
              // Skip chains that fail to load
            }
          });

          console.log(table.toString());
          printInfo(`\nTotal: ${chainNames.length} chains supported`);
        }
      } else if (options.info) {
        const chainInfo = getChainInfo(options.info);
        prettyPrint(chainInfo);
      } else {
        printInfo('Use --list to see all supported chains or --info <chain> to get chain details');
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });
