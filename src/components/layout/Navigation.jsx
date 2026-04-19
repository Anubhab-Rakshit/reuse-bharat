import React, { useState, createContext, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, Utensils, Pill, BookOpen, PlusCircle } from "lucide-react";
import Magnetic from "../ui/Magnetic";
import { useWallet } from "../../context/WalletContext";
import './Navigation.css';

// Sidebar Context for state management
const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const navItems = [
  { label: "Home", path: "/", icon: <Home size={22} />, color: "var(--muted)" },
  { label: "Mission Control", path: "/dashboard", icon: <LayoutDashboard size={22} />, color: "var(--muted)" },
  { label: "Annapurna", path: "/annapurna", icon: <Utensils size={22} />, color: "var(--haldi)" },
  { label: "Aushadh Mitra", path: "/aushadh", icon: <Pill size={22} />, color: "var(--patta)" },
  { label: "College Samagri", path: "/samagri", icon: <BookOpen size={22} />, color: "var(--sindoor)" },
  { label: "Post New", path: "/post", icon: <PlusCircle size={22} />, color: "var(--bijli)" },
  { label: "Security", path: "/profile-setup", icon: <Shield size={22} />, color: "var(--bijli)" },
];


export default function Navigation() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const { isConnected, shortAddress, balance, symbol } = useWallet();

  return (
    <nav 
      className="floating-nav-pill glass-panel"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="nav-logo-block">
        <div className="nav-monogram">RB</div>
      </div>

      <div className="nav-items-container">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={idx}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon-wrapper" style={{ color: isActive ? item.color : "inherit" }}>
                <Magnetic strength={0.4}>
                  <div className="nav-icon">
                    {item.icon}
                  </div>
                </Magnetic>
                <div className="nav-dot" style={{ backgroundColor: item.color, borderColor: 'var(--surface)' }} />
              </div>
              <span className="nav-label">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>

      <NavLink to="/auth" className={`nav-wallet-panel ${location.pathname === '/auth' ? 'active' : ''}`}>
        <div className="wallet-title">Wallet</div>
        {isConnected ? (
          <>
            <div className="wallet-address">{shortAddress}</div>
            <div className="wallet-balance">{balance} {symbol}</div>
          </>
        ) : (
          <div className="wallet-address">Connect MetaMask</div>
        )}
      </NavLink>
    </nav>
  );
}
