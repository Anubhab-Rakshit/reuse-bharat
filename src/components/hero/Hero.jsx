import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Magnetic from '../ui/Magnetic';
import './Hero.css';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate cursor position relative to screen center
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-scanlines"></div>

      {/* LEFT 55% */}
      <div 
        className="hero-left"
        style={{
          transform: `translate(${mousePosition.x * -8}px, ${mousePosition.y * -8}px)`
        }}
      >
        <div className="hero-overline">भारत की ज़रूरत</div>
        
        <h1 className="hero-headline">
          <span className="wastes-wrapper">
            India wastes.
            <svg className="strikethrough-svg" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 0 100 8" />
            </svg>
          </span>
          <br />
          We <span className="typewriter-text">reconnect</span><span className="typewriter-cursor"></span>
        </h1>
        
        <p className="hero-subtext">
          Reclaim food, medicine, and study materials before they are lost. 
          The unified impact network for students and citizens.
        </p>

        <div className="hero-ctas">
          <Magnetic strength={0.4}>
            <button className="btn-primary hero-btn-glow">Start Giving</button>
          </Magnetic>
          <Magnetic strength={0.4}>
            <button className="btn-outline hero-btn-dashed">
              <span className="btn-text">Explore Platform</span>
            </button>
          </Magnetic>
        </div>
      </div>

      {/* RIGHT 45% */}
      <div 
        className="hero-right"
        style={{
          transform: `translate(${mousePosition.x * 24}px, ${mousePosition.y * 24}px)`
        }}
      >
        <div className="blob-container">
          <div className="morphing-blob"></div>
          
          <div className="stat-pill stat-1 glass-panel">
            <span>2,400 meals saved</span>
          </div>
          <div className="stat-pill stat-2 glass-panel">
            <span>₹1.2L medicine reused</span>
          </div>
          <div className="stat-pill stat-3 glass-panel">
            <span>890 students served</span>
          </div>
        </div>
      </div>
    </section>
  );
}
