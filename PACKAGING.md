# Linux Packaging

heidr now supports multiple Linux package formats!

## Supported Formats

- **.deb** - Debian, Ubuntu, and derivatives
- **.rpm** - Fedora, RHEL, CentOS, and derivatives
- **AUR** - Arch Linux User Repository

## How It Works

### Standalone Binary

We use `bun build --compile` to create a **standalone 58MB executable** that bundles:

- Bun runtime
- All TypeScript source
- All npm dependencies

This means **zero runtime dependencies** - just install and run!

### Package Building

**nfpm** (https://nfpm.goreleaser.com/) generates .deb and .rpm from a single config:

- Compressed to ~22MB per package
- Installs to `/usr/bin/heidr`
- Works on any amd64 Linux system

### Automation

On each GitHub release, the `packages.yml` workflow:

1. Builds standalone Linux binary with `bun --compile`
2. Packages into .deb and .rpm with nfpm
3. Creates tarball for AUR
4. Uploads all artifacts to the release

## Testing Locally

```bash
# Build the standalone binary
bun build --compile ./cli/index.ts --outfile heidr-linux-amd64

# Test it
./heidr-linux-amd64 --version

# Build .deb package
VERSION=0.0.5 nfpm package --packager deb --target heidr_0.0.5_amd64.deb

# Build .rpm package
VERSION=0.0.5 nfpm package --packager rpm --target heidr-0.0.5.x86_64.rpm
```

## AUR Publishing

The PKGBUILD is included in the repo but must be manually published to AUR:

1. Create AUR account at https://aur.archlinux.org
2. Clone AUR repo: `git clone ssh://aur@aur.archlinux.org/heidr.git`
3. Copy PKGBUILD and generate .SRCINFO
4. Push to AUR

See the PKGBUILD file for details.

## Files

- `nfpm.yaml` - Package configuration
- `PKGBUILD` - Arch Linux package build script
- `.github/workflows/packages.yml` - Build automation
- `.gitignore` - Excludes build artifacts
