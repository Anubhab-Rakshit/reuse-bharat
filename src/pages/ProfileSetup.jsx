import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { Shield, Smartphone, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';
import './ProfileSetup.css';

export default function ProfileSetup() {
  const { isAuthenticated, sessionUser } = useWallet();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [setupStatus, setSetupStatus] = useState('idle'); // idle, loading, error, success
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated && sessionUser && !sessionUser.isTotpEnabled) {
      generateTotp();
    }
  }, [isAuthenticated, sessionUser]);

  const generateTotp = async () => {
    try {
      const data = await api.authTotpGenerate();
      setQrCodeUrl(data.qrCodeUrl);
      setSecret(data.secret);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to generate 2FA QR code.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (totpCode.length !== 6) return;

    try {
      setSetupStatus('loading');
      setErrorMsg('');
      await api.authTotpVerify(null, totpCode);
      setSetupStatus('success');
      // Update session user or reload to reflect isTotpEnabled = true
      window.location.reload(); 
    } catch (err) {
      setSetupStatus('error');
      setErrorMsg(err.message || 'Invalid 6-digit code. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-setup-page">
        <div className="glass-panel text-center">
          <h2>Please Login First</h2>
          <p>You need to be authenticated to access profile settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-setup-page">
      <div className="glass-panel profile-container">
        <div className="setup-header">
          <Shield size={32} color="var(--bijli)" />
          <h2>Security & 2FA Setup</h2>
          <p>Protect your Reuse Bharat account and Wallet using Google Authenticator.</p>
        </div>

        {sessionUser?.isTotpEnabled ? (
          <div className="totp-success-banner">
            <CheckCircle2 size={24} color="var(--patta)" />
            <div>
              <h3>Two-Factor Authentication is Enabled</h3>
              <p>Your account is highly secure.</p>
            </div>
          </div>
        ) : (
          <div className="totp-setup-flow">
            <div className="totp-step">
              <div className="step-num">1</div>
              <div>
                <h3>Download Google Authenticator</h3>
                <p>Install the app on your mobile device.</p>
              </div>
            </div>

            <div className="totp-step">
              <div className="step-num">2</div>
              <div>
                <h3>Scan QR Code</h3>
                <p>Open the app and scan this code:</p>
                {qrCodeUrl ? (
                  <div className="qr-wrapper">
                    <img src={qrCodeUrl} alt="TOTP QR Code" />
                    <code className="totp-secret-text">{secret}</code>
                  </div>
                ) : (
                  <div className="qr-skeleton">Loading...</div>
                )}
              </div>
            </div>

            <div className="totp-step">
              <div className="step-num">3</div>
              <div style={{ width: '100%' }}>
                <h3>Enter 6-Digit Code</h3>
                <form onSubmit={handleVerify} className="totp-verify-form">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  />
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={setupStatus === 'loading' || totpCode.length !== 6}
                  >
                    {setupStatus === 'loading' ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                </form>
                {errorMsg && <div className="totp-error">{errorMsg}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
