import React, { useState } from 'react';
import './Annapurna.css';
import { MapPin, Box, Search } from 'lucide-react';

/* ─── Mock Data ────────────────────────────────────── */
const MOCK_LISTINGS = [
  {
    id: 1,
    title: "Rajma Chawal (40 Plates)",
    location: "North Mess, Block B",
    quantity: "40 kg",
    timeLimit: "Pickup by: 6:00 PM",
    isUrgent: true,
    isClaimed: false,
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Fresh Sandwiches & Juice",
    location: "Seminar Hall 3",
    quantity: "15 packs",
    timeLimit: "Pickup by: 4:30 PM",
    isUrgent: false,
    isClaimed: false,
    image: "https://images.unsplash.com/photo-1512152272829-4081b8e84182?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Leftover Event Buffet",
    location: "Auditorium Backstage",
    quantity: "Mixed (Big)",
    timeLimit: "Exp: 2:00 PM",
    isUrgent: false,
    isClaimed: true,
    image: "https://images.unsplash.com/photo-1504670414369-17ce284ce402?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Packaged Curd & Bread",
    location: "East Wing Kitchen",
    quantity: "20 items",
    timeLimit: "Pickup by: 8:00 PM",
    isUrgent: false,
    isClaimed: false,
    image: "https://images.unsplash.com/photo-1484723091702-caa90f9b09de?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Vegetable Salad Tubs",
    location: "Cafe Coffee Day Outpost",
    quantity: "8 tubs",
    timeLimit: "Pickup by: 3:00 PM",
    isUrgent: true,
    isClaimed: false,
    image: "https://images.unsplash.com/photo-1511690655006-25f052d43e59?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Pizza Slices (Boxed)",
    location: "CS Dept Lounge",
    quantity: "12 slices",
    timeLimit: "Pickup by: 7:00 PM",
    isUrgent: false,
    isClaimed: false,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop"
  }
];

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

const FoodCard = ({ item }) => {
  return (
    <div className={`anna-card ${item.isClaimed ? 'is-claimed' : ''}`}>
      <div className="anna-card-image">
        <img src={item.image} alt={item.title} loading="lazy" />
        <div className="anna-gradient-overlay" />
        
        {item.isClaimed && (
          <div className="anna-stamp-claimed">Claimed</div>
        )}

        {!item.isClaimed && (
          <div className={`anna-pickup-badge ${item.isUrgent ? 'pulse-urgent' : ''}`}>
            {item.timeLimit}
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

        {item.isClaimed ? (
          <div className="anna-btn-claimed-state">Already Claimed</div>
        ) : (
          <button className="anna-btn-claim">Claim Food</button>
        )}
      </div>
    </div>
  );
};


/* ─── Main Page ────────────────────────────────────── */
export default function Annapurna() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Mocking empty state if a specific filter (e.g. Beverages) is clicked
  const displayedListings = activeFilter === "Beverages" ? [] : MOCK_LISTINGS;

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
        {displayedListings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="anna-grid">
            {displayedListings.map((item) => (
              <div key={item.id} className="anna-card-wrapper">
                <FoodCard item={item} />
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
