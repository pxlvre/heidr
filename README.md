<div align="center">

<img src="./public/heidr_logo.png" alt="heidr logo" width="200"/>

# heidr

> EVM blockchain CLI tool

</div>

**heidr** is a command-line interface for inspecting and interacting with EVM blockchains.

## Installation

### Via npm

```bash
npm install -g heidr
```

### Via install script

```bash
curl -fsSL https://raw.githubusercontent.com/pxlvre/heidr/main/install.sh | bash
```

### From source

```bash
git clone https://github.com/pxlvre/heidr.git
cd heidr
bun install
bun link
```

## Usage

```bash
# List all supported chains
heidr chains --list

# Get chain info
heidr chains --info mainnet

# Get chain info as JSON
heidr chains --info arbitrum --json
```

## Container Usage

Build and run heidr using Podman (or Docker):

```bash
# Build the image
podman build -t heidr .

# Run heidr commands
podman run --rm heidr chains --list
podman run --rm heidr chains --info mainnet
podman run --rm heidr chains --list --json

# Get help
podman run --rm heidr --help
```

## Development

```bash
# Run CLI in development
bun run dev chains --list

# Format code
bun run format

# Lint code
bun run lint
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features including JSON-RPC methods, Etherscan integration, Tenderly, Dune Analytics, and Gelato support.

**Current Version:** v0.1 (in development)

## Tech Stack

- [Bun](https://bun.sh) - JavaScript runtime
- [Viem](https://viem.sh) - Ethereum library
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [CLI-Table3](https://github.com/cli-table/cli-table3) - ASCII tables

## License

AGPL-3.0-or-later - see [LICENSE.md](./LICENSE.md)
