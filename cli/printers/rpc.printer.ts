import Table from 'cli-table3';
import chalk from 'chalk';
import type { Chain, Log, TransactionReceipt } from 'viem';

export const printBytecodeTable = (
  address: string,
  bytecode: string | undefined,
  chain: Chain
): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push(
    [chalk.bold('Address'), address],
    [chalk.bold('Chain'), `${chain.name} (${chain.id})`],
    [
      chalk.bold('Bytecode'),
      bytecode ? chalk.green(`${bytecode.slice(0, 66)}…`) : chalk.gray('(no bytecode — EOA)'),
    ],
    [chalk.bold('Size'), bytecode ? `${(bytecode.length - 2) / 2} bytes` : '0 bytes']
  );
  console.log(table.toString());
};

export const printBytecodeJson = (
  address: string,
  bytecode: string | undefined,
  chain: Chain
): void => {
  console.log(
    JSON.stringify(
      {
        address,
        chain: chain.name,
        chainId: chain.id,
        bytecode: bytecode ?? null,
        size: bytecode ? (bytecode.length - 2) / 2 : 0,
      },
      null,
      2
    )
  );
};

export const printNonceTable = (address: string, nonce: number, chain: Chain): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push(
    [chalk.bold('Address'), address],
    [chalk.bold('Chain'), `${chain.name} (${chain.id})`],
    [chalk.bold('Nonce'), chalk.yellow(nonce.toString())]
  );
  console.log(table.toString());
};

export const printNonceJson = (address: string, nonce: number, chain: Chain): void => {
  console.log(JSON.stringify({ address, chain: chain.name, chainId: chain.id, nonce }, null, 2));
};

export const printStorageTable = (
  address: string,
  slot: string,
  value: string | undefined,
  chain: Chain
): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push(
    [chalk.bold('Address'), address],
    [chalk.bold('Chain'), `${chain.name} (${chain.id})`],
    [chalk.bold('Slot'), slot],
    [chalk.bold('Value'), chalk.green(value ?? '0x0')]
  );
  console.log(table.toString());
};

export const printStorageJson = (
  address: string,
  slot: string,
  value: string | undefined,
  chain: Chain
): void => {
  console.log(
    JSON.stringify(
      { address, chain: chain.name, chainId: chain.id, slot, value: value ?? null },
      null,
      2
    )
  );
};

export const printCallTable = (
  to: string,
  data: string,
  result: { data?: string } | undefined,
  chain: Chain
): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push(
    [chalk.bold('To'), to],
    [chalk.bold('Chain'), `${chain.name} (${chain.id})`],
    [chalk.bold('Input Data'), data],
    [chalk.bold('Result'), chalk.green(result?.data ?? '0x')]
  );
  console.log(table.toString());
};

export const printCallJson = (
  to: string,
  data: string,
  result: { data?: string } | undefined,
  chain: Chain
): void => {
  console.log(
    JSON.stringify(
      { to, chain: chain.name, chainId: chain.id, data, result: result?.data ?? null },
      null,
      2
    )
  );
};

export const printEstimateTable = (gas: bigint, chain: Chain): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push(
    [chalk.bold('Chain'), `${chain.name} (${chain.id})`],
    [chalk.bold('Estimated Gas'), chalk.yellow(gas.toString())]
  );
  console.log(table.toString());
};

export const printEstimateJson = (gas: bigint, chain: Chain): void => {
  console.log(
    JSON.stringify({ chain: chain.name, chainId: chain.id, estimatedGas: gas.toString() }, null, 2)
  );
};

export const printLogsTable = (logs: Log[], chain: Chain): void => {
  const table = new Table({
    style: { head: ['cyan'] },
    head: ['#', 'Address', 'Block', 'Tx Hash', 'Topics', 'Data'],
  });
  if (logs.length === 0) {
    console.log(chalk.gray(`No logs found on ${chain.name}`));
    return;
  }
  logs.forEach((log, i) => {
    table.push([
      i.toString(),
      log.address,
      log.blockNumber?.toString() ?? 'N/A',
      log.transactionHash ? `${log.transactionHash.slice(0, 18)}…` : 'N/A',
      log.topics.length.toString(),
      log.data ? `${log.data.slice(0, 18)}…` : '0x',
    ]);
  });
  console.log(table.toString());
};

export const printLogsJson = (logs: Log[], chain: Chain): void => {
  const output = logs.map((log) => ({
    address: log.address,
    blockNumber: log.blockNumber?.toString() ?? null,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    topics: log.topics,
    data: log.data,
  }));
  console.log(
    JSON.stringify(
      { chain: chain.name, chainId: chain.id, count: logs.length, logs: output },
      null,
      2
    )
  );
};

export const printChainIdTable = (chainId: number, chainName: string): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push(
    [chalk.bold('Chain Name'), chainName],
    [chalk.bold('Chain ID'), chalk.yellow(chainId.toString())]
  );
  console.log(table.toString());
};

export const printChainIdJson = (chainId: number, chainName: string): void => {
  console.log(JSON.stringify({ chainId, chainName }, null, 2));
};

export const printReceiptTable = (receipt: TransactionReceipt, chain: Chain): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push(
    [chalk.bold('Tx Hash'), receipt.transactionHash],
    [chalk.bold('Chain'), `${chain.name} (${chain.id})`],
    [
      chalk.bold('Status'),
      receipt.status === 'success' ? chalk.green('success') : chalk.red('reverted'),
    ],
    [chalk.bold('Block Number'), receipt.blockNumber.toString()],
    [chalk.bold('Block Hash'), receipt.blockHash],
    [chalk.bold('From'), receipt.from],
    [chalk.bold('To'), receipt.to ?? chalk.gray('(contract creation)')],
    [chalk.bold('Gas Used'), receipt.gasUsed.toString()],
    [chalk.bold('Effective Gas Price'), receipt.effectiveGasPrice.toString()],
    ...(receipt.contractAddress ? [[chalk.bold('Contract Address'), receipt.contractAddress]] : []),
    [chalk.bold('Logs'), receipt.logs.length.toString()]
  );
  console.log(table.toString());
};

export const printReceiptJson = (receipt: TransactionReceipt, chain: Chain): void => {
  console.log(
    JSON.stringify(
      {
        chain: chain.name,
        chainId: chain.id,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber.toString(),
        blockHash: receipt.blockHash,
        status: receipt.status,
        from: receipt.from,
        to: receipt.to,
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice.toString(),
        contractAddress: receipt.contractAddress ?? null,
        logsCount: receipt.logs.length,
      },
      null,
      2
    )
  );
};

export const printProofTable = (
  proof: {
    address: string;
    nonce: bigint;
    balance: bigint;
    storageHash: string;
    codeHash: string;
    accountProof: string[];
    storageProof: { key: string; value: string; proof: string[] }[];
  },
  chain: Chain
): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push(
    [chalk.bold('Address'), proof.address],
    [chalk.bold('Chain'), `${chain.name} (${chain.id})`],
    [chalk.bold('Nonce'), proof.nonce.toString()],
    [chalk.bold('Balance'), proof.balance.toString()],
    [chalk.bold('Storage Hash'), proof.storageHash],
    [chalk.bold('Code Hash'), proof.codeHash],
    [chalk.bold('Account Proof Nodes'), proof.accountProof.length.toString()],
    [chalk.bold('Storage Proofs'), proof.storageProof.length.toString()]
  );
  console.log(table.toString());
};

export const printProofJson = (
  proof: {
    address: string;
    nonce: bigint;
    balance: bigint;
    storageHash: string;
    codeHash: string;
    accountProof: string[];
    storageProof: { key: string; value: string; proof: string[] }[];
  },
  chain: Chain
): void => {
  console.log(
    JSON.stringify(
      {
        chain: chain.name,
        chainId: chain.id,
        address: proof.address,
        nonce: proof.nonce.toString(),
        balance: proof.balance.toString(),
        storageHash: proof.storageHash,
        codeHash: proof.codeHash,
        accountProofLength: proof.accountProof.length,
        storageProof: proof.storageProof,
      },
      null,
      2
    )
  );
};
