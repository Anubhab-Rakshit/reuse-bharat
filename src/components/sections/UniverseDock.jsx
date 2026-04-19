import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./UniverseDock.css";

// Minimal Fluid Geometry SVG Icons
const BowlIcon = ({ color }) => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M16 3v3M8 3v3" />
    {/* Abstract Bowl shape */}
    <path d="M2 10c0 5.523 4.477 10 10 10s10-4.477 10-10c0-1.105-8.954-2-10-2S2 8.895 2 10z" />
    <path d="M22 10H2" />
  </svg>
);

const PillIcon = ({ color }) => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="10" rx="5" />
    <path d="M12 7v10" />
    <circle cx="7" cy="12" r="1" fill={color} />
  </svg>
);

const BookIcon = ({ color }) => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const modules = [
  {
    name: "Annapurna",
    devanagari: "अन्नपूर्णा",
    desc: "Re-route surplus food from campus messes immediately to local NGOs and shelters.",
    path: "/annapurna",
    tintClass: "anna-tint",
    posClass: "pos-top",
    color: "var(--haldi)",
    icon: <BowlIcon color="var(--haldi)" />
  },
  {
    name: "Aushadh Mitra",
    devanagari: "औषध",
    desc: "A verified network to donate unused, non-expired medication directly to clinics.",
    path: "/aushadh",
    tintClass: "aushadh-tint",
    posClass: "pos-left",
    color: "var(--patta)",
    icon: <PillIcon color="var(--patta)" />
  },
  {
    name: "College Samagri",
    devanagari: "सामग्री",
    desc: "Pass down textbooks, lab coats, and engineering tools to junior batches securely.",
    path: "/samagri",
    tintClass: "samagri-tint",
    posClass: "pos-right",
    color: "var(--sindoor)",
    icon: <BookIcon color="var(--sindoor)" />
  }
];

export default function UniverseDock() {
  return (
    <section className="universe-dock-section">
      <motion.h2 
        className="universe-dock-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        Select your mission.
      </motion.h2>

      <div className="universe-orbit-container">
        {modules.map((mod, idx) => (
          <motion.div
            key={idx}
            className={`module-card shimmer-card ${mod.tintClass} ${mod.posClass}`}
            initial={{ opacity: 0, rotateY: 15, y: 50 }}
            whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to={mod.path} className="module-card-link">
              <div className="module-grain-overlay"></div>
              
              <div className="module-devanagari" style={{ color: mod.color }}>
                {mod.devanagari}
              </div>

              <div className="module-content">
                <div className="module-icon-wrapper">
                  {mod.icon}
                </div>
                
                <div>
                  <h3 className="module-name">{mod.name}</h3>
                  <p className="module-desc">{mod.desc}</p>
                  
                  <div className="module-arrow" style={{ color: mod.color }}>
                    Explore <span className="arrow-icon">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
