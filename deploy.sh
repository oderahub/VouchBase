#!/bin/bash

# VouchBase Deployment Helper
# Usage: ./deploy.sh [network]
# Networks: base-mainnet (default), base-sepolia

set -e

NETWORK=${1:-base-mainnet}

echo "═══════════════════════════════════════════════════"
echo "🔵 VouchBase Deployment Script"
echo "═══════════════════════════════════════════════════"
echo ""

# Check for required tools
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry not installed. Install from https://getfoundry.sh"
    exit 1
fi

# Check for .env file
if [ ! -f .env ]; then
    echo "❌ .env file not found. Copy .env.example and fill in values."
    exit 1
fi

source .env

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set in .env"
    exit 1
fi

# Set RPC URL based on network
case $NETWORK in
    "base-mainnet")
        RPC_URL="https://mainnet.base.org"
        CHAIN_ID=8453
        EXPLORER="https://basescan.org"
        ;;
    "base-sepolia")
        RPC_URL="https://sepolia.base.org"
        CHAIN_ID=84532
        EXPLORER="https://sepolia.basescan.org"
        ;;
    *)
        echo "❌ Unknown network: $NETWORK"
        echo "   Supported: base-mainnet, base-sepolia"
        exit 1
        ;;
esac

echo "📍 Network: $NETWORK"
echo "🔗 RPC: $RPC_URL"
echo "🔍 Explorer: $EXPLORER"
echo ""

# Check wallet balance
echo "💰 Checking wallet balance..."
BALANCE=$(cast balance $(cast wallet address $PRIVATE_KEY) --rpc-url $RPC_URL)
echo "   Balance: $BALANCE wei"
echo ""

# Compile contract
echo "🔨 Compiling contract..."
forge build
echo "   ✅ Compilation successful"
echo ""

# Deploy
echo "🚀 Deploying VouchBase..."
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol \
    --rpc-url $RPC_URL \
    --broadcast \
    --private-key $PRIVATE_KEY \
    -vvv 2>&1)

# Extract deployed address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'VouchBase deployed to: \K0x[a-fA-F0-9]{40}' || echo "")

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "⚠️  Could not extract contract address from output"
    echo "$DEPLOY_OUTPUT"
else
    echo "   ✅ Deployed to: $CONTRACT_ADDRESS"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Update .env: VOUCHBASE_ADDRESS=$CONTRACT_ADDRESS"
    echo "   2. Update frontend/index.html: CONTRACT_ADDRESS = '$CONTRACT_ADDRESS'"
    echo "   3. Verify contract on BaseScan"
    echo ""
    echo "🔍 View on explorer:"
    echo "   $EXPLORER/address/$CONTRACT_ADDRESS"
fi

echo ""
echo "═══════════════════════════════════════════════════"

# Verify contract if API key is set
if [ ! -z "$BASESCAN_API_KEY" ] && [ ! -z "$CONTRACT_ADDRESS" ]; then
    echo ""
    echo "🔎 Verifying contract on BaseScan..."
    forge verify-contract $CONTRACT_ADDRESS \
        contracts/VouchBase.sol:VouchBase \
        --chain-id $CHAIN_ID \
        --etherscan-api-key $BASESCAN_API_KEY \
        --watch || echo "⚠️  Verification may take a few minutes"
fi
