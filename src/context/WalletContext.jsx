import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BrowserProvider, formatEther, getAddress } from 'ethers';
import api, { authToken } from '../lib/api';

const WalletContext = createContext(undefined);

const CELO_NETWORKS = {
  '0xa4ec': {
    chainId: '0xa4ec',
    chainName: 'Celo Mainnet',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    rpcUrls: ['https://forno.celo.org'],
    blockExplorerUrls: ['https://celoscan.io'],
  },
  '0xaef3': {
    chainId: '0xaef3',
    chainName: 'Celo Alfajores',
    nativeCurrency: { name: 'Celo', symbol: 'A-CELO', decimals: 18 },
    rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
    blockExplorerUrls: ['https://alfajores.celoscan.io'],
  },
};

const PREFERRED_CELO_CHAIN = '0xa4ec';

const shortAddress = (address = '') => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const parseProviderError = (err) => {
  if (err?.code === 4001 || err?.code === 'ACTION_REJECTED' || err?.info?.error?.code === 4001) {
    if (err?.message?.includes('sign')) {
      return 'User rejected signature. Please sign the message to verify your identity.';
    }
    return 'User rejected account access in MetaMask. Please connect and approve.';
  }
  if (err?.code === -32002) return 'MetaMask is already processing a request. Open MetaMask and complete it.';
  if (err?.code === 4100) return 'MetaMask denied account access. Reconnect and approve account permissions.';
  return err?.message || 'Wallet operation failed.';
};

const parseAuthError = (err) => {
  const message = err?.message || '';

  if (/invalid login nonce|signature verification failed/i.test(message)) {
    return 'Nonce/signature mismatch. Your login attempt is invalid or expired. Please retry.';
  }

  if (/failed to fetch|networkerror|load failed|cors/i.test(message)) {
    return 'Backend unreachable / CORS / port mismatch. Please ensure backend is running on port 5050.';
  }

  return message || 'Authentication failed. Please try again.';
};

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [balance, setBalance] = useState('0.0000');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [sessionToken, setSessionToken] = useState(authToken.get() || '');
  const [sessionUser, setSessionUser] = useState(null);

  const isCeloNetwork = Boolean(CELO_NETWORKS[chainId]);
  const isConnected = Boolean(address);
  const isAuthenticated = Boolean(sessionToken && sessionUser);

  const getProvider = useCallback(() => {
    if (!window.ethereum) return null;
    return new BrowserProvider(window.ethereum);
  }, []);

  const refreshBalance = useCallback(async (walletAddress = address) => {
    if (!walletAddress) {
      setBalance('0.0000');
      return;
    }

    const provider = getProvider();
    if (!provider) return;

    try {
      const weiBalance = await provider.getBalance(walletAddress);
      const celoBalance = Number(formatEther(weiBalance));
      setBalance(celoBalance.toFixed(4));
    } catch (err) {
      console.error('Failed to fetch wallet balance:', err);
    }
  }, [address, getProvider]);

  const hydrateSession = useCallback(async () => {
    const token = authToken.get();
    if (!token) {
      setSessionToken('');
      setSessionUser(null);
      return;
    }

    try {
      const data = await api.authMe(token);
      setSessionToken(token);
      setSessionUser(data.user || null);
    } catch (err) {
      authToken.clear();
      setSessionToken('');
      setSessionUser(null);
    }
  }, []);

  const syncWalletState = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

      setChainId(currentChainId || '');
      const first = accounts?.[0] || '';
      setAddress(first);

      if (first) {
        await refreshBalance(first);
        if (sessionUser?.walletAddress && sessionUser.walletAddress !== first.toLowerCase()) {
          setSessionUser(null);
          setSessionToken('');
          authToken.clear();
        }
      }
    } catch (err) {
      console.error('Failed to sync wallet state:', err);
    }
  }, [refreshBalance, sessionUser]);

  const switchToCelo = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install it first.');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: PREFERRED_CELO_CHAIN }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [CELO_NETWORKS[PREFERRED_CELO_CHAIN]],
        });
      } else {
        throw switchError;
      }
    }
  }, []);

  const authenticateWallet = useCallback(async (walletAddress) => {
    const provider = getProvider();
    if (!provider) throw new Error('MetaMask provider unavailable');

    const signer = await provider.getSigner();
    const checksumAddress = getAddress(walletAddress);
    const nonceData = await api.authRequestNonce(checksumAddress);
    const signature = await signer.signMessage(nonceData.message);
    const verifyData = await api.authVerifySignature({
      walletAddress: checksumAddress,
      nonce: nonceData.nonce,
      signature,
    });

    authToken.set(verifyData.token);
    setSessionToken(verifyData.token);
    setSessionUser(verifyData.user || null);
  }, [getProvider]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask not found. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      await switchToCelo();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const walletAddress = accounts?.[0] || '';

      if (!walletAddress) {
        throw new Error('No wallet account returned by MetaMask');
      }

      setAddress(walletAddress);
      setChainId(currentChainId || '');
      await refreshBalance(walletAddress);
      try {
        await authenticateWallet(walletAddress);
      } catch (authErr) {
        authToken.clear();
        setSessionToken('');
        setSessionUser(null);
        throw new Error(parseAuthError(authErr));
      }
    } catch (err) {
      console.error('Wallet connect/auth failed:', err);
      setError(parseProviderError(err));
    } finally {
      setIsConnecting(false);
    }
  }, [authenticateWallet, refreshBalance, switchToCelo]);

  const authenticateGoogle = useCallback(async (credential) => {
    try {
      setIsConnecting(true);
      setError('');
      const data = await api.authGoogle(credential);
      authToken.set(data.token);
      setSessionToken(data.token);
      setSessionUser(data.user || null);
    } catch (err) {
      console.error('Google connect failed:', err);
      setError(err.message || 'Google authentication failed');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress('');
    setBalance('0.0000');
    setError('');
    setSessionUser(null);
    setSessionToken('');
    authToken.clear();
  }, []);

  const reconnectAndAuthenticate = useCallback(async () => {
    setError('');
    await connectWallet();
  }, [connectWallet]);

  useEffect(() => {
    syncWalletState();
    hydrateSession();

    if (!window.ethereum) return;

    const onAccountsChanged = (accounts) => {
      const nextAddress = accounts?.[0] || '';
      setAddress(nextAddress);

      if (nextAddress) {
        refreshBalance(nextAddress);
        if (sessionUser?.walletAddress && sessionUser.walletAddress !== nextAddress.toLowerCase()) {
          setSessionUser(null);
          setSessionToken('');
          authToken.clear();
        }
      } else {
        disconnectWallet();
      }
    };

    const onChainChanged = (nextChainId) => {
      setChainId(nextChainId || '');
      if (address) refreshBalance(address);
    };

    window.ethereum.on('accountsChanged', onAccountsChanged);
    window.ethereum.on('chainChanged', onChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', onAccountsChanged);
      window.ethereum?.removeListener('chainChanged', onChainChanged);
    };
  }, [address, disconnectWallet, hydrateSession, refreshBalance, sessionUser, syncWalletState]);

  const value = useMemo(() => ({
    address,
    shortAddress: shortAddress(address),
    chainId,
    isCeloNetwork,
    isConnected,
    isAuthenticated,
    sessionUser,
    balance,
    symbol: isCeloNetwork ? CELO_NETWORKS[chainId]?.nativeCurrency?.symbol || 'CELO' : 'CELO',
    isConnecting,
    error,
    connectWallet,
    authenticateGoogle,
    reconnectAndAuthenticate,
    disconnectWallet,
    refreshBalance,
    switchToCelo,
  }), [
    address,
    chainId,
    isCeloNetwork,
    isConnected,
    isAuthenticated,
    sessionUser,
    balance,
    isConnecting,
    error,
    connectWallet,
    authenticateGoogle,
    reconnectAndAuthenticate,
    disconnectWallet,
    refreshBalance,
    switchToCelo,
  ]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used inside WalletProvider');
  }
  return context;
};
