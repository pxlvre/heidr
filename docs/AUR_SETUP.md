# AUR Automation Setup

This guide explains how to set up automated publishing to the Arch User Repository (AUR).

## Prerequisites

1. **AUR Account**: Create at https://aur.archlinux.org/register
2. **SSH Key**: Generate a key pair for GitHub Actions
3. **AUR Package**: Must be created manually first time

## One-Time Setup Steps

### Step 1: Create AUR Account

- Go to https://aur.archlinux.org/register
- Create an account

### Step 2: Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "github-actions-aur" -f ~/.ssh/aur_deploy_key
# Press Enter for no passphrase (required for automation)
```

### Step 3: Add Public Key to AUR

1. Log in to https://aur.archlinux.org
2. Go to "My Account" → "SSH Public Keys"
3. Paste contents of `~/.ssh/aur_deploy_key.pub`
4. Save

### Step 4: Initialize AUR Package

```bash
# Clone empty AUR repo
git clone ssh://aur@aur.archlinux.org/heidr.git aur-heidr
cd aur-heidr

# Copy PKGBUILD from main repo
cp ../PKGBUILD .

# Generate .SRCINFO
makepkg --printsrcinfo > .SRCINFO

# Initial commit
git add PKGBUILD .SRCINFO
git commit -m "Initial import: heidr 0.0.5"
git push
```

### Step 5: Add GitHub Secrets

Go to: https://github.com/pxlvre/heidr/settings/secrets/actions

Add these three secrets:

| Secret Name           | Value                                    |
| --------------------- | ---------------------------------------- |
| `AUR_SSH_PRIVATE_KEY` | Full contents of `~/.ssh/aur_deploy_key` |
| `AUR_USERNAME`        | Your AUR username                        |
| `AUR_EMAIL`           | Your git email                           |

## How It Works

On each release:

1. `packages.yml` uploads tarball
2. `aur.yml` updates PKGBUILD and pushes to AUR automatically

## Done!

After setup, every release will automatically publish to AUR.
