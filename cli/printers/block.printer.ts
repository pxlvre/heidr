import Table from 'cli-table3';
import { prettyPrint } from '@/utils/formatter';
import type { Block } from 'viem';

/**
 * Print block in table format
 * @param block - Block data
 */
export const printBlockTable = (block: Block): void => {
  const table = new Table({
    style: { head: ['cyan'] },
  });

  table.push(
    ['Block Number', block.number?.toString() || 'N/A'],
    ['Block Hash', block.hash || 'N/A'],
    ['Timestamp', new Date(Number(block.timestamp) * 1000).toISOString()],
    ['Transactions', block.transactions.length.toString()],
    ['Gas Used', block.gasUsed.toString()],
    ['Gas Limit', block.gasLimit.toString()],
    ['Base Fee Per Gas', block.baseFeePerGas?.toString() || 'N/A'],
    ['Miner', block.miner]
  );

  console.log(table.toString());
};

/**
 * Print block in JSON format
 * @param block - Block data
 */
export const printBlockJson = (block: Block): void => {
  prettyPrint(block);
};
