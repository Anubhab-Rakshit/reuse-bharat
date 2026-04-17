import React from 'react';
import Hero from '../components/hero/Hero';
import ProblemStatement from '../components/sections/ProblemStatement';
import UniverseDock from '../components/sections/UniverseDock';
import ImpactMetrics from '../components/sections/ImpactMetrics';
import Testimonials from '../components/sections/Testimonials';
import CTASection from '../components/sections/CTASection';

export default function Landing() {
  return (
    <div className="page-container">
      <div className="devanagari-bg-text" style={{ top: '5%', right: '5%', fontSize: '10rem', opacity: 0.03 }}>नमस्ते</div>
      
      <Hero />
      <ProblemStatement />
      <UniverseDock />
      <ImpactMetrics />
      <Testimonials />
      <CTASection />
    </div>
  );
}
