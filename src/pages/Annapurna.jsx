import React, { useState, useEffect } from 'react';
import './Annapurna.css';
import { MapPin, Box, Search } from 'lucide-react';
import api from '../lib/api';

const FILTERS = ["All", "Cooked Meals", "Packaged", "Raw Materials", "Beverages", "Snacks"];

/* ─── Components ───────────────────────────────────── */
const EmptyState = () => (
  <div className="anna-empty-state">
    <div className="bowl-anim-wrapper">
      <svg className="empty-bowl-svg" viewBox="0 0 100 100">
        {/* Spoon */}
        <path d="M 70 20 L 40 50" />
        <ellipse cx="35" cy="55" rx="8" ry="12" transform="rotate(-45 35 55)" />
        {/* Bowl */}
        <path d="M 10 40 C 10 90, 90 90, 90 40 Z" strokeWidth="4" />
        <line x1="10" y1="40" x2="90" y2="40" strokeWidth="4" />
      </svg>
    </div>
    <div className="anna-empty-text">
      The langar is quiet right now.<br />Be the first to share.
    </div>
  </div>
);

const FoodCard = ({ item, onClaim }) => {
  const isClaimed = item.status === 'Claimed';
  
  return (
    <div className={`anna-card ${isClaimed ? 'is-claimed' : ''}`}>
      <div className="anna-card-image">
        <img src={item.image || 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=1000&auto=format&fit=crop'} alt={item.title} loading="lazy" />
        <div className="anna-gradient-overlay" />
        
        {isClaimed && (
          <div className="anna-stamp-claimed">Claimed</div>
        )}

        {!isClaimed && (
          <div className={`anna-pickup-badge ${item.isUrgent ? 'pulse-urgent' : ''}`}>
            {item.timeLimit || 'Available'}
          </div>
        )}
      </div>

      <div className="anna-card-body">
        <h3 className="anna-card-title">{item.title}</h3>
        
        <div className="anna-card-meta">
          <div className="anna-chip">
            <MapPin size={14} /> {item.location}
          </div>
          <div className="anna-chip">
            <Box size={14} /> {item.quantity}
          </div>
        </div>

        {isClaimed ? (
          <div className="anna-btn-claimed-state">Already Claimed</div>
        ) : (
          <button className="anna-btn-claim" onClick={() => onClaim?.(item._id)}>Claim Food</button>
        )}
      </div>
    </div>
  );
};


/* ─── Main Page ────────────────────────────────────── */
export default function Annapurna() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await api.getListings({ module: 'Annapurna' });
      setListings(data);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (listingId) => {
    try {
      await api.claimListing(listingId, '680e5c5b1234567890000001');
      loadListings();
    } catch (err) {
      console.error('Failed to claim:', err);
    }
  };

  const filteredListings = activeFilter === "All" 
    ? listings 
    : listings.filter(item => item.category === activeFilter);

  const displayedListings = activeFilter === "Beverages" ? [] : filteredListings;

  return (
    <div className="annapurna-page">
      
      {/* Header */}
      <header className="anna-header">
        <div className="anna-header-bg-text">अन्नपूर्णा</div>
        <div className="anna-header-content">
          <h1 className="anna-title">The Langar</h1>
          <p className="anna-subtitle">
            Zero food waste on campus. Share surplus mess food, event catering, 
            or packaged items instantly with those who need it.
          </p>
        </div>
      </header>

      {/* Sticky Filter Bar */}
      <div className="anna-filters-wrapper">
        <div className="anna-filters-track">
          {FILTERS.map((f) => (
            <button 
              key={f}
              className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <main className="anna-content-area">
        {loading ? (
          <div className="anna-empty-state">
            <div className="anna-empty-text">Loading...</div>
          </div>
        ) : displayedListings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="anna-grid">
            {displayedListings.map((item) => (
              <div key={item._id} className="anna-card-wrapper">
                <FoodCard item={item} onClaim={handleClaim} />
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
