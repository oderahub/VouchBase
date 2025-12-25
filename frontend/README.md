# VouchBase Frontend

Modern React frontend for VouchBase - On-Chain Builder Credentials for Base.

## Features

- Multi-wallet support via Reown AppKit (MetaMask, Coinbase Wallet, WalletConnect, and more)
- Built with React 18 + Vite
- Ethers.js v6 for blockchain interactions
- Tailwind CSS for styling
- Base network integration

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_REOWN_PROJECT_ID=your_project_id_here
VITE_CONTRACT_ADDRESS=deployed_contract_address
VITE_CHAIN_ID=8453
```

**Get a Reown Project ID:**
1. Visit [https://cloud.reown.com](https://cloud.reown.com)
2. Create a new project
3. Copy your Project ID

### 3. Run Development Server

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Main app component
├── config/
│   ├── wagmi.js               # AppKit configuration
│   ├── contract.js            # Contract ABI & address
│   └── constants.js           # Skills, chains
├── components/
│   ├── Header.jsx             # Header with AppKit button
│   ├── Stats.jsx              # Platform statistics
│   ├── SkillSelector.jsx      # Skill selection UI
│   ├── RegisterForm.jsx       # Registration form
│   ├── BuilderCard.jsx        # Builder profile card
│   └── Leaderboard.jsx        # Leaderboard display
├── hooks/
│   └── useVouchBaseContract.js # Contract instance hook
└── styles/
    └── index.css              # Tailwind + custom styles
```

## Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Reown AppKit** - Multi-wallet connection
- **Ethers.js v6** - Ethereum library
- **Tailwind CSS** - Utility-first CSS
- **TanStack Query** - Data fetching (AppKit dependency)

## Wallet Support

VouchBase supports 600+ wallets via Reown AppKit including:

- MetaMask
- Coinbase Wallet
- WalletConnect
- Rainbow
- Trust Wallet
- Ledger (via WalletConnect)
- And many more...

## Network

The app is configured for **Base Mainnet** (Chain ID: 8453).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### "Please switch to Base network" error
Make sure your wallet is connected to Base Mainnet (Chain ID: 8453). AppKit will prompt you to switch networks.

### AppKit modal not showing
Ensure `VITE_REOWN_PROJECT_ID` is set correctly in `.env.local`.

### Contract calls failing
1. Check that `VITE_CONTRACT_ADDRESS` is correct
2. Ensure you're on Base Mainnet
3. Verify you have enough ETH for gas

## Migration from Old Frontend

This is a complete rewrite of the original single-file HTML frontend:

**What changed:**
- Single HTML file → Proper React project structure
- CDN libraries → npm packages
- MetaMask only → Multi-wallet support via AppKit
- Ethers v5 → Ethers v6
- Manual wallet connection → AppKit hooks
- Inline styles → Tailwind CSS

**What stayed the same:**
- All UI/UX design
- Contract interactions
- Feature set
- Styling (converted to Tailwind)

## Contributing

Built with love for the Base ecosystem 🔵
