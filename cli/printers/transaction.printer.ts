import Table from 'cli-table3';
import { prettyPrint } from '@/utils/formatter';
import type { Transaction } from 'viem';

/**
 * Print transaction in table format
 * @param tx - Transaction data
 */
export const printTransactionTable = (tx: Transaction): void => {
  const table = new Table({
    style: { head: ['cyan'] },
  });

  table.push(
    ['Hash', tx.hash],
    ['From', tx.from],
    ['To', tx.to || 'Contract Creation'],
    ['Value', `${tx.value.toString()} wei`],
    ['Gas', tx.gas.toString()],
    ['Gas Price', tx.gasPrice?.toString() || 'N/A'],
    ['Nonce', tx.nonce.toString()],
    ['Block Number', tx.blockNumber?.toString() || 'Pending'],
    ['Block Hash', tx.blockHash || 'Pending'],
    ['Transaction Index', tx.transactionIndex?.toString() || 'Pending'],
    ['Type', tx.type]
  );

  console.log(table.toString());
};

/**
 * Print transaction in JSON format
 * @param tx - Transaction data
 */
export const printTransactionJson = (tx: Transaction): void => {
  prettyPrint(tx);
};
