import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Wallet, PlusCircle, History } from 'lucide-react';
import api from '../../lib/api';
import './PlatformWallet.css';

export default function PlatformWallet() {
  const { isAuthenticated, sessionUser } = useWallet();
  const [balance, setBalance] = useState(0);
  const [addAmount, setAddAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
    }
  }, [isAuthenticated, sessionUser]);

  const fetchBalance = async () => {
    try {
      const data = await api.getWalletBalance();
      setBalance(data.balance);
    } catch (err) {
      console.error('Failed to fetch wallet balance', err);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!addAmount || isNaN(addAmount) || Number(addAmount) <= 0) return;

    try {
      setLoading(true);
      const data = await api.addWalletFunds(null, addAmount);
      setBalance(data.balance);
      setAddAmount('');
    } catch (err) {
      console.error('Failed to add funds', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="platform-wallet-card glass-panel">
      <div className="pw-header">
        <Wallet size={24} color="var(--haldi)" />
        <h3>Reuse Platform Wallet</h3>
      </div>
      
      <div className="pw-balance-section">
        <span className="pw-label">Current Balance</span>
        <div className="pw-amount">₹{balance.toLocaleString('en-IN')}</div>
      </div>

      <div className="pw-actions">
        <form onSubmit={handleAddFunds} className="pw-add-form">
          <input 
            type="number" 
            placeholder="Amount (₹)" 
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            min="1"
          />
          <button type="submit" disabled={loading || !addAmount} className="btn-primary pw-btn-add">
            {loading ? 'Processing...' : <><PlusCircle size={16}/> Add</>}
          </button>
        </form>
      </div>

      <div className="pw-footer">
        <History size={14} />
        <span>View Transaction History (Coming Soon)</span>
      </div>
    </div>
  );
}
