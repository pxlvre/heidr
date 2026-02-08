# Heid - EVM CLI Tool

A CLI tool for inspecting and interacting with EVM blockchains.

## Vision

Single CLI to do everything you need with EVM chains:

- All JSON-RPC methods
- Etherscan API (basic & pro)
- Tenderly API
- Dune Analytics API
- Gelato Bundler API
- Chain-specific APIs (zkSync, etc.)

## Roadmap

### v0.1 - JSON-RPC Foundation

- [x] Project setup
- [ ] Core architecture
  - [ ] Service layer for JSON-RPC methods
  - [ ] Chain configuration
  - [ ] Pretty JSON printing
  - [ ] Error handling
- [ ] Commands
  - [ ] `heid tx` - Transaction queries (all JSON-RPC tx methods)
  - [ ] `heid block` - Block queries (all JSON-RPC block methods)
  - [ ] `heid account` - Account queries (balance, nonce, code, storage)
  - [ ] `heid call` - eth_call, eth_estimateGas
  - [ ] `heid send` - Send transactions
  - [ ] `heid logs` - Event logs
  - [ ] `heid net` - Network info
  - [ ] `heid debug` - Debug methods (if available)
  - [ ] `heid trace` - Trace methods (if available)

### v0.2 - Etherscan Basic

- [ ] `heid etherscan` namespace
  - [ ] Account API (balance, txlist, etc.)
  - [ ] Contract API (ABI, source code)
  - [ ] Transaction API
  - [ ] Block API
  - [ ] Logs API
  - [ ] Token API

### v0.3 - Advanced Features

- [ ] Etherscan Pro features
- [ ] zkSync-specific JSON-RPC methods
- [ ] zkSync era APIs
- [ ] Chain-specific method detection

### v0.4 - Tenderly Integration

- [ ] `heid tenderly` namespace
  - [ ] Simulation API
  - [ ] Gas estimation
  - [ ] Transaction analysis

### v0.5 - Dune Analytics

- [ ] `heid dune` namespace
  - [ ] Query execution
  - [ ] Results fetching
  - [ ] Data export

### v0.6 - Gelato

- [ ] `heid gelato` namespace
  - [ ] Bundler API
  - [ ] Task creation
  - [ ] Status checking

## Usage Examples

```bash
# JSON-RPC commands
heid tx --hash 0x...
heid block --number 12345
heid account --address 0x... --method balance

# Etherscan commands
heid etherscan account --address 0x... --action txlist
heid etherscan contract --address 0x... --action getsourcecode

# Tenderly commands
heid tenderly simulate --from 0x... --to 0x... --data 0x...

# Dune commands
heid dune query --id 12345 --execute
```

## Architecture

```
heid/
├── cli/
│   ├── commands/
│   │   ├── tx.ts
│   │   ├── block.ts
│   │   ├── account.ts
│   │   ├── call.ts
│   │   ├── send.ts
│   │   ├── logs.ts
│   │   ├── net.ts
│   │   ├── debug.ts
│   │   ├── trace.ts
│   │   └── etherscan/
│   │       ├── account.ts
│   │       ├── contract.ts
│   │       └── ...
│   └── index.ts
├── services/
│   ├── rpc/
│   │   ├── transaction.service.ts
│   │   ├── block.service.ts
│   │   ├── account.service.ts
│   │   └── ...
│   ├── etherscan/
│   │   └── ...
│   └── tenderly/
│       └── ...
├── providers/
│   ├── rpc.provider.ts
│   ├── etherscan.provider.ts
│   ├── tenderly.provider.ts
│   └── ...
├── utils/
│   ├── formatter.ts (pretty JSON printing)
│   ├── hex.ts
│   └── ...
├── config/
│   ├── chains.ts
│   └── ...
└── types/
    └── ...
```

## Tech Stack

- **Bun** - Runtime
- **Viem** - Ethereum library
- **Commander.js** - CLI framework
- **Chalk** - Terminal colors
- **CLI-Table3** - Table formatting

## Current Status

🏗️ **In Development** - v0.0.1 (JSON-RPC Foundation)
