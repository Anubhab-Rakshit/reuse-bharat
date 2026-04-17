import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform, animate, useMotionValue, useInView } from "framer-motion";
import "./ImpactMetrics.css";

const AnimatedCounter = ({ to, inView }) => {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const isFloat = !Number.isInteger(to);
    
    const controls = animate(count, to, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate: (v) => {
        if (isFloat) {
          setDisplay(v.toFixed(1));
        } else {
          setDisplay(Math.round(v).toLocaleString("en-IN"));
        }
      },
    });
    return controls.stop;
  }, [inView, count, to]);

  return <span>{display}</span>;
};

const MetricItem = ({ metric, inView }) => (
  <div className="impact-metric-item">
    <div className="impact-metric-data">
      <div className="metric-number-wrapper">
        <span className="metric-number">
          {metric.prefix}
          <AnimatedCounter to={metric.number} inView={inView} />
        </span>
        <span className="metric-suffix">{metric.suffix}</span>
      </div>
      <div className="metric-label">{metric.label}</div>
    </div>
  </div>
);

const Separator = () => (
  <div className="impact-separator">RB</div>
);

const ProgressBar = ({ label, targetPct, color, globalScroll, index }) => {
  // Map scroll progress to the width of the bar. Stagger them.
  const start = 0.2 + (index * 0.15);
  const end = Math.min(0.9, start + 0.3);
  
  // Use a spring to make it feel smooth instead of jarringly linked directly to scroll
  const scaleX = useSpring(useTransform(globalScroll, [start, end], [0, targetPct / 100]), { 
    stiffness: 100, damping: 30, restDelta: 0.001 
  });
  
  const pctDisplay = useTransform(scaleX, (v) => `${Math.round((v / (targetPct / 100)) * targetPct || 0)}%`);
  const [pctText, setPctText] = useState("0%");
  
  useEffect(() => {
    return pctDisplay.on("change", setPctText);
  }, [pctDisplay]);

  return (
    <div className="progress-group">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-pct">{pctText}</span>
      </div>
      <div className="progress-track">
        <motion.div 
          className="progress-fill" 
          style={{ scaleX, backgroundColor: color }} 
        />
      </div>
    </div>
  );
};

export default function ImpactMetrics() {
  const sectionRef = useRef(null);
  // Trigger counting slightly before it fully centers
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"]
  });

  const metrics = [
    { number: 2400, prefix: "", suffix: "+", label: "Meals Redirected" },
    { number: 1.2, prefix: "₹", suffix: "L", label: "Medicine Reused" },
    { number: 890, prefix: "", suffix: "", label: "Students Equipped" }
  ];

  // We duplicate the metrics enough to fill 200% width for a seamless marquee loop
  const tickerItems = [...metrics, ...metrics, ...metrics];

  const progressBars = [
    { label: "Food Waste Reduction target", targetPct: 75, color: "var(--haldi)" },
    { label: "Expired Meds safely salvaged", targetPct: 40, color: "var(--patta)" },
    { label: "Textbook Lifecycle extension", targetPct: 85, color: "var(--sindoor)" }
  ];

  return (
    <section className="impact-section" ref={sectionRef}>
      <div className="impact-mesh-bg">
        <div className="mesh-blob blob-haldi" />
        <div className="mesh-blob blob-patta" />
      </div>

      <div className="impact-ticker-wrapper">
        <div className="impact-ticker-track">
          {tickerItems.map((m, i) => (
            <React.Fragment key={i}>
              <MetricItem metric={m} inView={inView} />
              <Separator />
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="impact-progress-container">
        {progressBars.map((bar, i) => (
          <ProgressBar 
            key={i} 
            index={i}
            label={bar.label} 
            targetPct={bar.targetPct} 
            color={bar.color} 
            globalScroll={scrollYProgress} 
          />
        ))}
      </div>
    </section>
  );
}
