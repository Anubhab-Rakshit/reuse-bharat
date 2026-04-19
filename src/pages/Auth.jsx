import React, { useMemo } from 'react';
import { ShieldCheck, Wallet, RefreshCw, AlertTriangle, LogOut } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useWallet } from '../context/WalletContext';
import './Auth.css';

const chainLabel = (chainId, isCeloNetwork) => {
  if (!chainId) return 'Not connected';
  if (!isCeloNetwork) return `Unsupported (${chainId})`;
  return chainId === '0xa4ec' ? 'Celo Mainnet' : 'Celo Alfajores';
};

export default function Auth() {
  const {
    address,
    shortAddress,
    chainId,
    isCeloNetwork,
    isConnected,
    isAuthenticated,
    sessionUser,
    balance,
    symbol,
    isConnecting,
    error,
    connectWallet,
    authenticateGoogle,
    reconnectAndAuthenticate,
    disconnectWallet,
    refreshBalance,
    switchToCelo,
  } = useWallet();

  const statusTone = useMemo(() => {
    if (!isConnected) return 'idle';
    return isCeloNetwork ? 'ok' : 'warn';
  }, [isConnected, isCeloNetwork]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await authenticateGoogle(credentialResponse.credential);
    } catch (err) {
      console.error('Google Login Error:', err);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-bg-glow" />

      <div className="auth-card glass-panel">
        <div className="auth-heading">
          <div className="auth-badge">
            <ShieldCheck size={14} />
            Web3 & Google Sign In
          </div>
          <h1>Login to Reuse Bharat</h1>
          <p>Connect using your Celo wallet or standard Google Account.</p>
        </div>

        {/* --- Wallet Login Section --- */}
        <div className={`wallet-status wallet-status--${statusTone}`}>
          <div className="wallet-status-left">
            <Wallet size={18} />
            <div>
              <div className="wallet-status-title">
                {isConnected ? (isAuthenticated ? 'Wallet Authenticated' : 'Wallet Connected') : 'Wallet Not Connected'}
              </div>
              <div className="wallet-status-subtitle">{chainLabel(chainId, isCeloNetwork)}</div>
            </div>
          </div>

          {isConnected && (
            <button className="wallet-ghost-btn" type="button" onClick={() => refreshBalance()}>
              <RefreshCw size={14} /> Refresh
            </button>
          )}
        </div>

        {!isConnected && !isAuthenticated ? (
          <button className="wallet-main-btn" type="button" onClick={connectWallet} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        ) : isConnected && (
          <div className="wallet-details-grid">
            <div className="wallet-detail-box">
              <span className="detail-label">Address</span>
              <span className="detail-value mono" title={address}>{shortAddress}</span>
              <span className="detail-helper mono">{address}</span>
            </div>

            <div className="wallet-detail-box">
              <span className="detail-label">Balance</span>
              <span className="detail-value">{balance} {symbol}</span>
              <span className="detail-helper">Live from current chain</span>
            </div>
          </div>
        )}

        {isConnected && !isCeloNetwork && (
          <div className="wallet-warning">
            <AlertTriangle size={16} />
            <span>Please switch to Celo to use wallet-enabled features.</span>
            <button className="wallet-inline-btn" type="button" onClick={switchToCelo}>Switch Network</button>
          </div>
        )}

        {error && <div className="wallet-error">{error}</div>}

        {error && isConnected && (
          <button className="wallet-main-btn" type="button" onClick={reconnectAndAuthenticate} disabled={isConnecting}>
            {isConnecting ? 'Retrying...' : 'Retry Signature Login'}
          </button>
        )}

        {/* --- Divider --- */}
        {!isAuthenticated && (
          <div className="auth-divider">
            <span>OR</span>
          </div>
        )}

        {/* --- Google Login Section --- */}
        {!isAuthenticated && (
          <div className="google-auth-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error('Google Login Failed')}
              useOneTap
              theme="filled_black"
              shape="pill"
            />
          </div>
        )}

        {/* --- Authenticated State --- */}
        {isAuthenticated && (
          <div className="wallet-session-note">
            Logged in as <strong>{sessionUser?.name || 'User'}</strong>
            <br/>
            {sessionUser?.email && <span className="text-sm opacity-70">{sessionUser.email}</span>}
          </div>
        )}

        {isAuthenticated && (
          <button className="wallet-disconnect" type="button" onClick={disconnectWallet}>
            <LogOut size={14} /> Sign Out
          </button>
        )}
      </div>
    </section>
  );
}
