import { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

/**
 * Custom hook to get the VouchBase contract instance
 * @returns {Contract|null} Contract instance with signer, or null if not connected
 */
export function useVouchBaseContract() {
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (!isConnected || !walletProvider) {
      setContract(null);
      return;
    }

    const initContract = async () => {
      try {
        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();
        const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error('Failed to create contract instance:', error);
        setContract(null);
      }
    };

    initContract();
  }, [isConnected, walletProvider]);

  return contract;
}
