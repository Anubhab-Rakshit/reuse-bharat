import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Box, Search, BookOpen, GraduationCap, PenTool, Layers } from 'lucide-react';
import api from '../lib/api';
import './CollegeSamagri.css';

const FILTERS = ["All", "Books", "Equipment", "Stationery", "Other"];

/* ─── Components ───────────────────────────────────── */
const EmptyState = () => (
  <motion.div 
    className="samagri-empty-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <div className="book-anim-wrapper">
      <svg className="empty-book-svg" viewBox="0 0 100 100">
        <path d="M 50 25 L 50 85" strokeWidth="2" />
        <path d="M 50 25 C 40 20, 20 22, 15 30 L 15 80 C 20 72, 40 70, 50 85" strokeWidth="3" />
        <path d="M 50 25 C 60 20, 80 22, 85 30 L 85 80 C 80 72, 60 70, 50 85" strokeWidth="3" />
        <line x1="25" y1="40" x2="45" y2="38" strokeWidth="1" opacity="0.5" />
        <line x1="25" y1="50" x2="45" y2="48" strokeWidth="1" opacity="0.5" />
        <line x1="25" y1="60" x2="45" y2="58" strokeWidth="1" opacity="0.5" />
        <line x1="55" y1="38" x2="75" y2="40" strokeWidth="1" opacity="0.5" />
        <line x1="55" y1="48" x2="75" y2="50" strokeWidth="1" opacity="0.5" />
        <line x1="55" y1="60" x2="75" y2="60" strokeWidth="1" opacity="0.5" />
      </svg>
    </div>
    <div className="samagri-empty-text">
      The exchange shelf is empty.<br />Share your books & supplies with juniors.
    </div>
  </motion.div>
);

const ItemCard = ({ item, onClaim, index }) => {
  const isClaimed = item.status === 'Claimed';
  
  return (
    <motion.div 
      className={`samagri-card ${isClaimed ? 'is-claimed' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="samagri-card-image">
        <img src={item.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop'} alt={item.title} loading="lazy" />
        <div className="samagri-gradient-overlay" />
        
        {isClaimed && (
          <div className="samagri-stamp-claimed">Claimed</div>
        )}

        {!isClaimed && (
          <div className="samagri-bookmark-tag">
            <span className="bookmark-content">{item.category || 'Item'}</span>
            <div className="bookmark-tail"></div>
          </div>
        )}
      </div>

      <div className="samagri-card-body">
        <div className="samagri-card-header">
           <h3 className="samagri-card-title">{item.title}</h3>
           {item.isDonation ? (
             <span className="samagri-free-badge">FREE</span>
           ) : (
             <span className="samagri-swap-badge">SWAP</span>
           )}
        </div>
        
        <div className="samagri-card-meta">
          <div className="samagri-chip">
            <MapPin size={14} /> {item.location}
          </div>
          <div className="samagri-chip">
            <Box size={14} /> {item.quantity}
          </div>
        </div>

        <div className="samagri-card-footer">
          {isClaimed ? (
            <div className="samagri-btn-claimed-state">Already Claimed</div>
          ) : (
            <button className="samagri-btn-claim" onClick={() => onClaim?.(item._id)}>
              Claim Item
              <div className="btn-sweep"></div>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};


/* ─── Main Page ────────────────────────────────────── */
export default function CollegeSamagri() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await api.getListings({ module: 'Samagri' });
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

  return (
    <div className="samagri-page">
      <div className="paper-texture-overlay" />
      
      {/* Header */}
      <header className="samagri-header">
        <div className="samagri-header-bg-text">सामग्री</div>
        <div className="samagri-header-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="samagri-overline">Academic Resource Exchange</div>
            <h1 className="samagri-title">The Exchange</h1>
            <p className="samagri-subtitle">
              Pass on textbooks, lab coats, stationery, and equipment to juniors 
              who need them. Building a sustainable scholarly community.
            </p>
          </motion.div>
        </div>

        {/* Scholarly Decorations */}
        <div className="samagri-decor">
           <motion.div 
             className="decor-book"
             animate={{ y: [0, -15, 0], rotate: [5, 8, 5] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           >
             <BookOpen size={64} strokeWidth={1} />
           </motion.div>
           <motion.div 
             className="decor-cap"
             animate={{ y: [0, 10, 0], rotate: [-5, -2, -5] }}
             transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           >
             <GraduationCap size={48} strokeWidth={1} />
           </motion.div>
        </div>
      </header>

      {/* Sticky Filter Bar */}
      <div className="samagri-filters-wrapper">
        <div className="samagri-filters-track">
          {FILTERS.map((f) => (
            <button 
              key={f}
              className={`samagri-filter-pill ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="samagri-search-box">
           <Search size={18} />
           <input type="text" placeholder="Search exchange shelf..." />
        </div>
      </div>

      {/* Grid Content */}
      <main className="samagri-content-area">
        {loading ? (
          <div className="samagri-loading-state">
            <div className="shelf-loader"></div>
            <div className="samagri-empty-text">Browsing the shelves...</div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredListings.length === 0 ? (
              <EmptyState key="empty" />
            ) : (
              <motion.div 
                key="grid"
                className="samagri-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredListings.map((item, idx) => (
                  <div key={item._id} className="samagri-card-wrapper">
                    <ItemCard item={item} onClaim={handleClaim} index={idx} />
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
