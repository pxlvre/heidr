<div align="center">

<img src="./public/heidr_logo.png" alt="heidr logo" width="200"/>

# heidr

> EVM blockchain CLI tool

</div>

**heidr** is a command-line interface for inspecting and interacting with EVM blockchains.

---

> _Nought was there but byte and hex,_  
> _ne'er a prompt nor token gleamed,_  
> _till heidr's runes were cast by hand._  
> _Nine commands I saw, and nine the worlds,_  
> _each chain a branch on the cosmic tree,_  
> _and each flag a beacon to realms unseen._

---

## Installation

### Via Homebrew (macOS/Linux)

```bash
brew tap pxlvre/heidr
brew install heidr
```

### Via package manager (Linux)

**Debian/Ubuntu (.deb):**

```bash
# Download from releases
wget https://github.com/pxlvre/heidr/releases/latest/download/heidr_0.0.5_amd64.deb
sudo dpkg -i heidr_0.0.5_amd64.deb
```

**Fedora/RHEL/CentOS (.rpm):**

```bash
# Download from releases
wget https://github.com/pxlvre/heidr/releases/latest/download/heidr-0.0.5.x86_64.rpm
sudo rpm -i heidr-0.0.5.x86_64.rpm
```

**Arch Linux (AUR):**

```bash
# Using yay or your preferred AUR helper
yay -S heidr

# Or manually
git clone https://aur.archlinux.org/heidr.git
cd heidr
makepkg -si
```

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

### Chains

```bash
# List all supported chains
heidr chains --list

# Get chain info
heidr chains --info mainnet

# Get chain info as JSON
heidr chains --info arbitrum --json
```

### Blocks

```bash
# Get latest block from Ethereum mainnet
heidr block latest

# Get latest block from Arbitrum
heidr block latest --chain arbitrum

# Get specific block from Polygon
heidr block 70000000 --chain polygon
```

### Transactions

```bash
# Get transaction from Ethereum mainnet
heidr tx 0x086164dca926230a5b67e572888a26dee10708a328477b49fdb94ac7bc446260

# Get transaction from Arbitrum
heidr tx 0x4fedc9635b64f4d3012345da58e71fc366c789045a9046e9836f81a0eafac198 --chain arbitrum

# Get transaction as JSON
heidr tx 0x123... --json
```

## Container Usage

Build and run heidr using Podman (or Docker):

```bash
# From GitHub Container Registry
podman pull ghcr.io/pxlvre/heidr:latest
podman run --rm ghcr.io/pxlvre/heidr chains --list

# From Docker Hub
docker pull pxlvre/heidr:latest
docker run --rm pxlvre/heidr chains --list

# Get help
podman run --rm ghcr.io/pxlvre/heidr --help
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

**Current Version:** v0.0.5

## Tech Stack

- [Bun](https://bun.sh) - JavaScript runtime
- [Viem](https://viem.sh) - Ethereum library
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [CLI-Table3](https://github.com/cli-table/cli-table3) - ASCII tables

## License

AGPL-3.0-or-later - see [LICENSE.md](./LICENSE.md)
