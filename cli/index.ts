#!/usr/bin/env bun
/**
 * Main CLI entry point for heidr - EVM blockchain CLI tool
 */
import { Command } from 'commander';
import { chainsCommand } from './commands/chains.js';
import { blockCommand } from './commands/block.js';
import { txCommand } from './commands/tx.js';

const program = new Command();

program
  .name('heidr')
  .description('EVM blockchain CLI tool')
  .version('0.0.5', '-v, --version', 'Output the current version')
  .addHelpText(
    'after',
    `
Examples:
  $ heidr chains --list              List all supported chains
  $ heidr chains --info mainnet      Get info about mainnet
  $ heidr block latest               Get latest block from Ethereum mainnet
  $ heidr block latest --chain arbitrum   Get latest block from Arbitrum
  $ heidr block 12345 --chain polygon     Get block 12345 from Polygon
  $ heidr tx 0x123...                Get transaction info from Ethereum mainnet
  $ heidr tx 0x123... --chain arbitrum    Get transaction info from Arbitrum
  $ heidr --version                  Show version
  $ heidr --help                     Show help
`
  );

// Add commands
program.addCommand(chainsCommand);
program.addCommand(blockCommand);
program.addCommand(txCommand);

program.parse();
