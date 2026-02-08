<div align="center">

# heiðr

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

**Debian/Ubuntu (APT Repository):**

```bash
curl -s https://pxlvre.github.io/heidr/apt/pubkey.gpg | sudo apt-key add -
echo "deb [arch=amd64] https://pxlvre.github.io/heidr/apt stable main" | sudo tee /etc/apt/sources.list.d/heidr.list
sudo apt update
sudo apt install heidr
```

Or download the `.deb` package directly:

```bash
wget https://github.com/pxlvre/heidr/releases/latest/download/heidr_0.0.6_amd64.deb
sudo dpkg -i heidr_0.0.6_amd64.deb
```

**Fedora/RHEL/CentOS (.rpm):**

```bash
# Download from releases
wget https://github.com/pxlvre/heidr/releases/latest/download/heidr-0.0.6.x86_64.rpm
sudo rpm -i heidr-0.0.6.x86_64.rpm
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

### Balances

```bash
# Get balance of an address
heidr balance 0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97

# Get balance on Arbitrum
heidr balance 0x123... --chain arbitrum

# Get balance as JSON
heidr balance 0x123... --json
```

### Gas Prices

```bash
# Get current gas price on Ethereum mainnet
heidr gas

# Get gas price on a different chain
heidr gas --chain arbitrum

# Get gas price as JSON
heidr gas --json
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

**Current Version:** v0.0.6

## Tech Stack

- [Bun](https://bun.sh) - JavaScript runtime
- [Viem](https://viem.sh) - Ethereum library
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [CLI-Table3](https://github.com/cli-table/cli-table3) - ASCII tables

## License

AGPL-3.0-or-later - see [LICENSE.md](./LICENSE.md)
