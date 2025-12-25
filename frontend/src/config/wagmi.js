import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { base } from '@reown/appkit/networks';

// Project ID from Reown Cloud (https://cloud.reown.com)
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

if (!projectId) {
  console.warn('VITE_REOWN_PROJECT_ID is not set. Please add it to your .env.local file.');
}

// Define networks - Base Mainnet
const networks = [base];

// Metadata for the dApp
const metadata = {
  name: 'VouchBase',
  description: 'On-Chain Builder Credentials for Base',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://vouchbase.app',
  icons: [`${typeof window !== 'undefined' ? window.location.origin : 'https://vouchbase.app'}/vouchbase-icon.png`]
};

// Create AppKit instance with Ethers adapter
export const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true, // Optional: enable analytics
    email: false,    // Disable email login
    socials: false   // Disable social logins
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#0052ff', // Base blue
    '--w3m-border-radius-master': '12px',
    '--w3m-font-family': 'Outfit, sans-serif'
  }
});
