import React from "react";
import { motion } from "framer-motion";
import "./CTASection.css";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-particles-container">
        <div className="particle-layer layer-1" />
        <div className="particle-layer layer-2" />
        <div className="particle-layer layer-3" />
      </div>

      <div className="cta-radar-container">
        <div className="radar-ring ring-1" />
        <div className="radar-ring ring-2" />
        <div className="radar-ring ring-3" />
      </div>

      <motion.div 
        className="cta-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="cta-headline">
          Ready to make <br />
          your <span className="cta-highlight">waste</span> matter?
        </h2>
        
        <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
          Initialize Sequence <ArrowRight size={20} />
        </button>
      </motion.div>
    </section>
  );
}
