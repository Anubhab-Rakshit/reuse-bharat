import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, Plus, Utensils, Pill, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useWallet } from '../context/WalletContext';
import PlatformWallet from '../components/wallet/PlatformWallet';
import './Dashboard.css';

// ... (keep the rest unchanged until the render method)
/* ─── Animated Counter ──────────────────────── */
const Counter = ({ to, duration = 1.5 }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.round(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [to, duration]);
  return <>{val.toLocaleString('en-IN')}</>;
};

/* ─── Ring SVG Chart ────────────────────────── */
const RingChart = ({ rings }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 200); }, []);
  const SIZE = 200;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  return (
    <div className="impact-rings-container">
      <svg width={SIZE} height={SIZE} className="ring-svg" style={{ position: 'relative' }}>
        {rings.map((ring, i) => {
          const radius = 80 - i * 22;
          const circ = 2 * Math.PI * radius;
          const offset = circ - (circ * ring.percent) / 100;
          return (
            <g key={i}>
              <circle cx={CX} cy={CY} r={radius} className="ring-track" strokeWidth={14} />
              <circle
                cx={CX} cy={CY} r={radius}
                className="ring-fill"
                strokeWidth={14}
                stroke={ring.color}
                strokeDasharray={circ}
                strokeDashoffset={mounted ? offset : circ}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: `${CX}px ${CY}px`,
                  transition: `stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.2}s`,
                  filter: `drop-shadow(0 0 8px ${ring.color}80)`,
                }}
              />
            </g>
          );
        })}
      </svg>
      <div className="ring-label-center">
        <span className="ring-big-num"><Counter to={3290} /></span>
        <span className="ring-big-label">Total Impact</span>
      </div>
    </div>
  );
};

/* ─── Stagger Cell Wrapper ──────────────────── */
const BentoCell = ({ children, className, style, index, glowColor }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className={`bento-cell ${className || ''}`}
      style={{
        ...style,
        borderColor: hovered && glowColor
          ? `${glowColor}40`
          : 'rgba(255,255,255,0.05)',
        boxShadow: hovered && glowColor
          ? `0 0 30px ${glowColor}20, inset 0 0 0 1px ${glowColor}25`
          : 'none',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </motion.div>
  );
};

/* ─── Static Fallback Data ──────────────────── */
const staticListings = [
  { title: 'Rajma Chawal Boxes (20)', module: 'Annapurna', color: 'var(--haldi)', time: '2h ago', status: 'Active' },
  { title: 'Metformin 500mg Strip', module: 'Aushadh', color: 'var(--patta)', time: '5h ago', status: 'Claimed' },
  { title: 'Engineering Graphics (Bhatt)', module: 'Samagri', color: 'var(--sindoor)', time: '1d ago', status: 'Active' },
  { title: 'Lab Coat (M size)', module: 'Samagri', color: 'var(--sindoor)', time: '1d ago', status: 'Active' },
  { title: 'Cough Syrup (sealed)', module: 'Aushadh', color: 'var(--patta)', time: '2d ago', status: 'Active' },
];

const staticTimeline = [
  { text: 'Kiran claimed your Engineering Graphics book', module: 'Samagri', color: 'var(--sindoor)', time: '12 min ago' },
  { text: 'Your Rajma donation was picked up by Anuj NGO', module: 'Annapurna', color: 'var(--haldi)', time: '2 hrs ago' },
  { text: 'New match found for Metformin strip', module: 'Aushadh', color: 'var(--patta)', time: '5 hrs ago' },
  { text: 'You posted Lab Coat listing', module: 'Samagri', color: 'var(--sindoor)', time: 'Yesterday' },
];

/* ─── Dashboard ─────────────────────────────── */
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isConnected, isAuthenticated, shortAddress, balance, symbol } = useWallet();

  useEffect(() => {
    Promise.all([
      api.getUsers().catch(() => []),
      api.getListings({ status: 'Active' }).catch(() => []),
      api.getActivities({ limit: 10 }).catch(() => []),
    ]).then(([users, listingsData, activitiesData]) => {
      if (users.length > 0) {
        setUser(users[0]);
      }
      if (listingsData.length > 0) {
        setListings(listingsData.slice(0, 5));
      }
      if (activitiesData.length > 0) {
        setActivities(activitiesData.slice(0, 4));
      }
      setLoading(false);
    });
  }, []);

  const displayUser = user;
  const displayEcoScore = user?.ecoScore || 84;
  const totalImpact = user?.totalImpact || { meals: 2400, medicine: 590, books: 300 };

  const ringData = displayUser && displayUser.totalImpact ? [
    { label: 'Meals', percent: 72, color: 'var(--haldi)', count: displayUser.totalImpact.meals || 0 },
    { label: 'Medicine', percent: 48, color: 'var(--patta)', count: displayUser.totalImpact.medicine || 0 },
    { label: 'Books', percent: 61, color: 'var(--sindoor)', count: displayUser.totalImpact.books || 0 },
  ] : [
    { label: 'Meals', percent: 72, color: 'var(--haldi)', count: 2400 },
    { label: 'Medicine', percent: 48, color: 'var(--patta)', count: 590 },
    { label: 'Books', percent: 61, color: 'var(--sindoor)', count: 300 },
  ];

  const displayListings = listings.length > 0 ? listings : staticListings;
  const displayActivities = activities.length > 0 ? activities : [];

  const moduleColor = (module) =>
    module === 'Annapurna' ? 'var(--haldi)'
    : module === 'Aushadh' ? 'var(--patta)'
    : 'var(--sindoor)';

  return (
    <div className="dashboard-page">

      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div className="topbar-left">
          <div className="topbar-avatar">{displayUser?.name?.[0] || 'R'}</div>
          <div className="topbar-greeting">
            <span className="greeting-namaste">नमस्ते,</span>
            <span className="greeting-name">{displayUser?.name || 'Riya'}</span>
          </div>
        </div>

        <div className="topbar-brand">Reuse<span>·</span>Bharat</div>

        <div className="topbar-right">
          <Link to="/auth" className="wallet-chip" title={isConnected ? shortAddress : 'Connect Wallet'}>
            {isConnected ? `${shortAddress} • ${balance} ${symbol}` : 'Connect Wallet'}
          </Link>
          <div className="notif-wrapper">
            <Bell size={22} />
            <div className="notif-badge" />
          </div>
        </div>
      </div>

      {/* Platform Wallet */}
      {(isConnected || isAuthenticated) && (
        <div style={{ marginBottom: '2rem' }}>
          <PlatformWallet />
        </div>
      )}

      {/* Bento Grid */}
      <div className="dashboard-bento">

        {/* Cell 1: Your Impact — Ring Chart (2 cols, 2 rows) */}
        <BentoCell index={0} className="bento-cell-1" glowColor="var(--haldi)">
          <div className="bento-label">Your Impact</div>
          <RingChart rings={ringData} />
          <div className="impact-legend">
            {ringData.map((r, i) => (
              <div key={i} className="legend-item">
                <div className="legend-dot" style={{ background: r.color }} />
                {r.label}: <strong style={{ color: 'var(--text)', marginLeft: '0.25rem' }}>{r.count.toLocaleString('en-IN')}</strong>
              </div>
            ))}
          </div>
        </BentoCell>

        {/* Cell 2: Active Listings (1 col, 3 rows) */}
        <BentoCell index={1} className="bento-cell-2" glowColor="var(--muted)">
          <div className="bento-label">Active Listings</div>
          <div className="listings-scroll">
            {displayListings.map((item, i) => (
              <div
                key={i}
                className="listing-item"
                style={{ borderLeftColor: moduleColor(item.module) }}
              >
                <div className="listing-info">
                  <div className="listing-title">{item.title}</div>
                  <div className="listing-meta">
                    {item.module} · {
                      item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('en-IN', { hour: 'numeric', minute: '2-digit' })
                        : item.time
                    }
                  </div>
                </div>
                <div className="listing-status">{item.status}</div>
              </div>
            ))}
          </div>
        </BentoCell>

        {/* Cell 3: Quick Post Action */}
        <BentoCell index={2} className="bento-cell-3 quick-action-cell" glowColor="var(--bijli)">
          <Link to="/post" className="quick-action-inner" style={{ textDecoration: 'none' }}>
            <svg className="quick-action-border-svg" style={{ borderRadius: '20px' }}>
              <rect
                className="qa-border-rect"
                x="1" y="1"
                width="calc(100% - 2px)" height="calc(100% - 2px)"
                rx="19" ry="19"
              />
            </svg>
            <div className="quick-action-plus">
              <Plus size={22} />
            </div>
            <span className="quick-action-label">Post Something New</span>
          </Link>
        </BentoCell>

        {/* Cell 4: Sustainability Score */}
        <BentoCell index={3} className="bento-cell-4" glowColor="var(--bijli)">
          <div className="bento-label">Eco Score</div>
          <div className="score-display">
            <span className="score-number" style={{ color: 'var(--bijli)' }}>
              <Counter to={displayEcoScore} duration={2} />
            </span>
            <span className="score-suffix">/100</span>
          </div>
          <div className="score-arc-track">
            <motion.div
              className="score-arc-fill"
              style={{ background: 'linear-gradient(90deg, var(--patta), var(--bijli))' }}
              initial={{ width: '0%' }}
              animate={{ width: `${displayEcoScore}%` }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            />
          </div>
          <div className="score-label">Top 12% of campus donors</div>
        </BentoCell>

        {/* Cell 5: Activity Timeline (2 cols, 1 row) */}
        <BentoCell index={4} className="bento-cell-5" glowColor="var(--muted)">
          <div className="bento-label">Recent Activity</div>
          <div className="timeline">
            {/* FIX 5: Use staticTimeline as fallback; fixed broken template literal in boxShadow */}
            {(displayActivities.length > 0 ? displayActivities : staticTimeline).map((ev, i) => {
              const color = ev.color || moduleColor(ev.module);
              return (
                <div key={i} className="timeline-item">
                  <div className="timeline-spine">
                    <div
                      className="timeline-dot"
                      style={{
                        borderColor: color,
                        boxShadow: `0 0 8px ${color}60`,  // FIX 5: was `var(--sindoor'` (missing closing paren)
                      }}
                    />
                    <div className="timeline-line" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-chip">
                      <span style={{ color, fontSize: '0.7rem' }}>●</span>
                      {ev.text || ev.description}
                    </div>
                    <div className="timeline-time">
                      {ev.time || (ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : '')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </BentoCell>

        {/* Cell 6: Saved Items */}
        <BentoCell index={5} className="bento-cell-6" glowColor="var(--sindoor)">
          <div className="bento-label">Saved Items</div>
          <div className="saved-big">
            <span className="saved-number"><Counter to={12} duration={1} /></span>
            <Heart size={32} fill="var(--sindoor)" className="heart-icon" />
          </div>
          <div className="saved-sub">Bookmarked listings waiting for you</div>
        </BentoCell>

      </div>
    </div>
  );
}
