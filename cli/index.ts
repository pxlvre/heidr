#!/usr/bin/env bun
/**
 * Main CLI entry point for heidr - EVM blockchain CLI tool
 */
import { Command } from 'commander';
import { chainsCommand } from './commands/chains.js';

const program = new Command();

program
  .name('heidr')
  .description('EVM blockchain CLI tool')
  .version('0.0.1', '-v, --version', 'Output the current version')
  .addHelpText(
    'after',
    `
Examples:
  $ heidr chains --list              List all supported chains
  $ heidr chains --info mainnet      Get info about mainnet
  $ heidr --version                  Show version
  $ heidr --help                     Show help
`
  );

// Add commands
program.addCommand(chainsCommand);

program.parse();
