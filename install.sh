#!/bin/bash
set -e

# heidr installation script
# Installs heidr globally using Bun

echo "Installing heidr..."

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "Error: Bun is not installed."
    echo "Please install Bun first: https://bun.sh"
    exit 1
fi

# Detect OS
OS="$(uname -s)"
case "$OS" in
    Linux*)     PLATFORM=linux;;
    Darwin*)    PLATFORM=macos;;
    *)          echo "Unsupported OS: $OS"; exit 1;;
esac

# Create temporary directory
TMP_DIR=$(mktemp -d)
cd "$TMP_DIR"

# Download the latest release
echo "Downloading heidr..."
git clone --depth 1 https://github.com/pxlvre/heidr.git
cd heidr

# Install dependencies
echo "Installing dependencies..."
bun install --production

# Link globally
echo "Linking heidr globally..."
bun link

# Cleanup
cd ~
rm -rf "$TMP_DIR"

# Verify installation
if command -v heidr &> /dev/null; then
    echo ""
    echo "✓ heidr installed successfully!"
    echo ""
    echo "Try running: heidr chains --list"
else
    echo ""
    echo "Installation complete, but heidr command not found in PATH."
    echo "You may need to add Bun's bin directory to your PATH:"
    echo '  export PATH="$HOME/.bun/bin:$PATH"'
fi
