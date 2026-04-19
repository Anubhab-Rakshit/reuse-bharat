import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Box, Search, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../lib/api';
import './AushadhMitra.css';

const FILTERS = ["All", "Medicine", "Equipment", "First Aid"];

/* ─── Components ───────────────────────────────────── */
const EmptyState = () => (
  <motion.div 
    className="aushadh-empty-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <div className="pill-anim-wrapper">
      <svg className="empty-pill-svg" viewBox="0 0 100 100">
        <rect x="25" y="30" width="50" height="40" rx="20" ry="20" strokeWidth="3" />
        <line x1="50" y1="30" x2="50" y2="70" strokeWidth="2" />
        <line x1="45" y1="85" x2="55" y2="85" strokeWidth="2" />
        <line x1="50" y1="80" x2="50" y2="90" strokeWidth="2" />
      </svg>
    </div>
    <div className="aushadh-empty-text">
      The dispensary is empty right now.<br />Be the first to share medicine.
    </div>
  </motion.div>
);

const MedicineCard = ({ item, onClaim, index }) => {
  const isClaimed = item.status === 'Claimed';
  
  return (
    <motion.div 
      className={`aushadh-card ${isClaimed ? 'is-claimed' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="aushadh-card-image">
        <img src={item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop'} alt={item.title} loading="lazy" />
        <div className="aushadh-gradient-overlay" />
        
        {isClaimed && (
          <div className="aushadh-stamp-claimed">Claimed</div>
        )}

        <div className="aushadh-card-badges">
          {!isClaimed && (
            <div className={`aushadh-validity-badge ${item.isUrgent ? 'pulse-urgent' : ''}`}>
              {item.timeLimit || 'Available'}
            </div>
          )}
          {item.isVerified && (
            <div className="aushadh-verify-badge" title="Pharmacist Verified">
              <ShieldCheck size={14} /> Verified
            </div>
          )}
        </div>
      </div>

      <div className="aushadh-card-body">
        <div className="aushadh-card-header">
          <h3 className="aushadh-card-title">{item.title}</h3>
          <span className={`aushadh-status-dot ${item.isSealed ? 'is-sealed' : 'is-opened'}`} title={item.isSealed ? 'Sealed' : 'Opened'}></span>
        </div>
        
        <div className="aushadh-card-meta">
          <div className="aushadh-chip">
            <MapPin size={14} /> {item.location}
          </div>
          <div className="aushadh-chip">
            <Box size={14} /> {item.quantity}
          </div>
        </div>

        <div className="aushadh-card-footer">
          {isClaimed ? (
            <div className="aushadh-btn-claimed-state">Already Claimed</div>
          ) : (
            <button className="aushadh-btn-claim" onClick={() => onClaim?.(item._id)}>
              <span className="btn-text">Claim Medicine</span>
              <div className="btn-glow"></div>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};


/* ─── Main Page ────────────────────────────────────── */
export default function AushadhMitra() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await api.getListings({ module: 'Aushadh' });
      setListings(data);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (listingId) => {
    try {
      // For now using a hardcoded user ID - will be dynamic once session is fully wired
      await api.claimListing(listingId, '680e5c5b1234567890000001');
      loadListings();
    } catch (err) {
      console.error('Failed to claim:', err);
    }
  };

  const filteredListings = activeFilter === "All" 
    ? listings 
    : listings.filter(item => item.category === activeFilter);

  return (
    <div className="aushadh-page">
      <div className="grain-overlay" />
      
      {/* Header */}
      <header className="aushadh-header">
        <div className="aushadh-header-bg-text">औषध मित्र</div>
        <div className="aushadh-header-content">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="aushadh-overline">Emergency Resource Network</div>
            <h1 className="aushadh-title">The Dispensary</h1>
            <p className="aushadh-subtitle">
              Share unused, sealed medicines and first-aid supplies with fellow 
              students who need them. Every pill counts in saving a life.
            </p>
          </motion.div>
        </div>
        
        {/* Floating Pills Decoration */}
        <div className="aushadh-decor-pills">
           <div className="floating-pill-1"></div>
           <div className="floating-pill-2"></div>
        </div>
      </header>

      {/* Sticky Filter Bar */}
      <div className="aushadh-filters-wrapper">
        <div className="aushadh-filters-track">
          {FILTERS.map((f) => (
            <button 
              key={f}
              className={`aushadh-filter-pill ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="aushadh-search-box">
           <Search size={18} />
           <input type="text" placeholder="Search dispensary..." />
        </div>
      </div>

      {/* Grid Content */}
      <main className="aushadh-content-area">
        {loading ? (
          <div className="aushadh-loading-state">
            <div className="loading-spinner"></div>
            <div className="aushadh-empty-text">Restocking Dispensary...</div>
          </div>
        ) : (
          <AnimatePresence mode='wait'>
            {filteredListings.length === 0 ? (
              <EmptyState key="empty" />
            ) : (
              <motion.div 
                key="grid"
                className="aushadh-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredListings.map((item, idx) => (
                  <div key={item._id} className="aushadh-card-wrapper">
                    <MedicineCard item={item} onClaim={handleClaim} index={idx} />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

    </div>
  );
}
