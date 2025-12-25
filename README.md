# VouchBase 🔵

**On-Chain Builder Credentials for Base Ecosystem**

VouchBase is a decentralized reputation system where builders register their skills and get vouched for by peers. Build your on-chain credibility score and prove your expertise.

---

## 🎯 Features

- **Register Profile**: Claim your username and list your skills
- **Skill Verification**: Other builders vouch for your abilities
- **Credibility Score**: Algorithmic reputation based on vouches received/given
- **Leaderboard**: Top builders ranked by credibility
- **On-Chain**: All data stored permanently on Base

---

## 📊 How Credibility Score Works

```
Score = (Vouches Received × 10) + (Skills Claimed × 5) + (Vouches Given × 2)
```

- Get vouched to earn points
- Vouch for others to earn points
- Claim more skills to earn points

---

## 💰 Fee Structure

| Action | Fee |
|--------|-----|
| Register | 0.0001 ETH |
| Add Skill | 0.00005 ETH |
| Vouch | 0.00005 ETH |
| Update Username | 0.0001 ETH |

---

## 🛠 Skills Available

**Smart Contracts**: Solidity, Vyper, Rust, Cairo

**Frontend**: React, Next.js, TypeScript, Vue

**Backend**: Node.js, Python, Go

**Web3 Tools**: Foundry, Hardhat, Wagmi, Viem, Ethers.js

**Design**: UI/UX, Figma

**Other**: Security, DevRel, Technical Writing

**Blockchain**: Base, Ethereum, DeFi, NFT

---

## 🚀 Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) v18+
- Base mainnet ETH for deployment and interactions

### 1. Clone & Setup

```bash
cd vouchbase
cp .env.example .env
# Edit .env with your private keys and API keys
```

### 2. Install Dependencies

```bash
# Install Foundry dependencies
forge install

# Install script dependencies
cd scripts
npm install
cd ..
```

### 3. Deploy Contract

```bash
# Deploy to Base mainnet
forge script script/Deploy.s.sol \
    --rpc-url https://mainnet.base.org \
    --broadcast \
    --verify \
    -vvvv

# Note the deployed address and update:
# 1. .env file: VOUCHBASE_ADDRESS=0x...
# 2. frontend/index.html: CONTRACT_ADDRESS = '0x...'
```

### 4. Run Frontend

```bash
# Simple local server
cd frontend
python -m http.server 8000
# or
npx serve .

# Open http://localhost:8000
```

### 5. Run Interaction Scripts

```bash
cd scripts

# Register all wallets
npm run register

# Add skills to wallets
npm run skills

# Cross-vouch between wallets
npm run vouch

# Run all interactions
npm run all

# Run on schedule (every 2 hours)
npm run scheduled
```

---

## 📁 Project Structure

```
vouchbase/
├── contracts/
│   └── VouchBase.sol          # Main smart contract
├── script/
│   └── Deploy.s.sol           # Foundry deployment script
├── scripts/
│   ├── interact.js            # Node.js interaction scripts
│   └── package.json
├── frontend/
│   └── index.html             # React frontend (single file)
├── foundry.toml               # Foundry configuration
├── .env.example               # Environment template
└── README.md
```

---

## 🔧 Contract Functions

### User Functions

```solidity
// Register with username and initial skills
function register(string username, string github, string twitter, uint8[] skills) payable

// Add a skill to your profile
function addSkill(uint8 skillId) payable

// Add multiple skills
function addSkills(uint8[] skillIds) payable

// Vouch for another builder's skill
function vouch(address builder, uint8 skillId) payable

// Vouch for multiple skills
function vouchMultiple(address builder, uint8[] skillIds) payable

// Update your username
function updateUsername(string newUsername) payable

// Update social links (free)
function updateSocials(string github, string twitter)
```

### View Functions

```solidity
// Get full builder profile
function getBuilder(address wallet) view returns (...)

// Get builder by username
function getBuilderByUsername(string username) view returns (address)

// Get skills with vouch counts
function getSkillsWithVouches(address builder) view returns (uint8[], uint256[])

// Check if vouched
function checkVouch(address voucher, address builder, uint8 skillId) view returns (bool)

// Get paginated builders list
function getBuilders(uint256 offset, uint256 limit) view returns (address[])
```

---

## 📈 Boosting Your Base Builder Ranking

VouchBase generates legitimate on-chain activity:

1. **Multiple registrations** - Each wallet registration is a paid transaction
2. **Skill additions** - Add skills over time for more transactions
3. **Cross-vouching** - Vouch between your wallets for transaction volume
4. **Fee generation** - Contract collects fees, showing real economic activity

### Recommended Wallet Setup

- Use 3-5 wallets for natural-looking activity
- Fund each with 0.005-0.01 ETH
- Run scripts on different schedules
- Mix automated and manual interactions

### Script Schedule

```javascript
// Suggested cron schedule
0 */6 * * *  node interact.js register   // Every 6 hours
0 */4 * * *  node interact.js skills     // Every 4 hours
0 */2 * * *  node interact.js vouch      // Every 2 hours
```

---

## 🔐 Security Notes

- Contract is owned by deployer
- Owner can update fees and withdraw collected fees
- Ownership is transferable
- No upgradability (immutable after deployment)

---

## 📜 License

MIT

---

## 🔗 Links

- **Base Mainnet**: https://base.org
- **BaseScan**: https://basescan.org
- **Contract**: `YOUR_DEPLOYED_ADDRESS`

---

Built for Base Builders 🔵
