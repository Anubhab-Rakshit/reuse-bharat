import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  animate,
  useMotionValue,
} from "framer-motion";
import "./ProblemStatement.css";

/* ─── Animated Counter ───────────────────────────────────── */
const AnimatedCounter = ({ to, inView }) => {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString("en-IN")),
    });
    return controls.stop;
  }, [inView, count, to]);

  return <span>{display}</span>;
};

/* ─── Wound Card ─────────────────────────────────────────── */
const WoundCard = ({ card, index, scrollYProgress }) => {
  const [inView, setInView] = useState(false);

  // trigger counter when this card is centered
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const lo = (index - 0.4) / 3;
      const hi = (index + 0.7) / 3;
      if (v >= lo && v <= hi) setInView(true);
    });
  }, [scrollYProgress, index]);

  // subtle parallax: layer drifts opposite to h-scroll
  const pxRange = [Math.max(0, (index - 1) / 3), Math.min(1, (index + 1) / 3)];
  const parallaxX = useTransform(scrollYProgress, pxRange, ["6%", "-6%"]);

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div className="wound-card-panel">
      {/* Parallax ambient layer */}
      <motion.div
        className={`parallax-bg-layer ${card.bgClass}`}
        style={{ x: parallaxX }}
      />

      <motion.div
        className="wound-card-content"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
      >
        {/* Section label */}
        <div className="wound-section-label">Problem {index + 1} of 3</div>

        {/* Counter row */}
        <div className="wound-number-wrapper">
          {card.prefix && (
            <span className="wound-number-prefix">{card.prefix}</span>
          )}
          <span className="wound-number">
            <AnimatedCounter to={card.number} inView={inView} />
          </span>
          {card.suffix && (
            <span className="wound-number-suffix">{card.suffix}</span>
          )}
        </div>

        {/* Main statement */}
        <motion.p
          className="wound-text"
          variants={fadeUp}
          custom={0.15}
        >
          {card.text}
        </motion.p>

        {card.subtext && (
          <motion.p className="wound-subtext" variants={fadeUp} custom={0.3}>
            {card.subtext}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

/* ─── Section ────────────────────────────────────────────── */
export default function ProblemStatement() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // translate track: 0 → −200vw across full scroll range
  const xTransform = useTransform(scrollYProgress, [0, 1], ["0vw", "-200vw"]);

  // active dot index
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setActiveIdx(v < 0.34 ? 0 : v < 0.67 ? 1 : 2);
    });
  }, [scrollYProgress]);

  const cards = [
    {
      number: 40,
      suffix: "%",
      text: "of cooked college mess food is thrown daily",
      bgClass: "bg-food",
    },
    {
      prefix: "₹",
      number: 18000,
      suffix: " Cr",
      text: "of sealed medicine expires unused in Indian homes",
      bgClass: "bg-med",
    },
    {
      number: 1,
      text: "Student buys. 1 year later, it's landfill.",
      subtext: "Textbooks, lab coats, calculators — forgotten in corners.",
      bgClass: "bg-book",
    },
  ];

  return (
    <section className="problem-scroll-container" ref={containerRef}>
      <div className="problem-sticky-wrapper">
        <motion.div
          className="problem-horizontal-track"
          style={{ x: xTransform }}
        >
          {cards.map((card, idx) => (
            <WoundCard
              key={idx}
              index={idx}
              card={card}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </motion.div>

        {/* Progress dots — sit on top of sticky wrapper */}
        <div className="wound-progress-dots">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`wound-dot ${activeIdx === i ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
