import React from "react";
import "./Testimonials.css";

const TestimonialCard = ({ data, index }) => {
  // Rotate alternate cards left and right
  const rotateClass = index % 2 === 0 ? "card-rotate-neg" : "card-rotate-pos";
  
  // Assign classes based on module type
  let tagClass = "tag-samagri";
  let tagLabel = "Samagri";
  
  if (data.module === "Annapurna") {
    tagClass = "tag-anna";
    tagLabel = "Annapurna";
  } else if (data.module === "Aushadh") {
    tagClass = "tag-aushadh";
    tagLabel = "Aushadh Mitra";
  }

  return (
    <div className={`testimonial-card ${rotateClass}`}>
      <div className="testimonial-grain" />
      <div className={`testimonial-tag ${tagClass}`}>{tagLabel}</div>
      
      <p className="testimonial-quote">"{data.quote}"</p>
      
      <div className="testimonial-footer">
        <span className="testimonial-name">{data.name}</span>
        <span className="testimonial-college">{data.college}</span>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const row1 = [
    { quote: "Managed to redirect 40kg of fresh mess food in our first drive.", name: "Rahul Sharma", college: "IIT Delhi", module: "Annapurna" },
    { quote: "Got Rs. 8k worth of asthma inhalers safely to a local clinic.", name: "Dr. Ananya Vyas", college: "AIIMS", module: "Aushadh" },
    { quote: "Saved almost ₹4,000 on engineering graphics tools thanks to a senior.", name: "Kiran P.", college: "VIT Vellore", module: "Samagri" },
    { quote: "This solves the exact problem we faced every semester end.", name: "Sameer N.", college: "BITS Pilani", module: "Samagri" },
    { quote: "Seamless. The sheer transparency of where the food goes is amazing.", name: "Divya R.", college: "DU North Campus", module: "Annapurna" }
  ];

  const row2 = [
    { quote: "We connected our campus pharmacy to 3 free clinics locally.", name: "Priya S.", college: "JIPMER", module: "Aushadh" },
    { quote: "Best way to pass down lab coats! Zero friction.", name: "Aman Gupta", college: "NIT Surathkal", module: "Samagri" },
    { quote: "Our volunteer group thrives on the ping alerts from this platform.", name: "Rajat Kapoor", college: "SRM IST", module: "Annapurna" },
    { quote: "Donated my dad's unused insulin pens directly to those in need.", name: "Sneha Nair", college: "Kochi Medical", module: "Aushadh" },
    { quote: "Found a perfect condition thermodynamics book for my 2nd year.", name: "Vikram K.", college: "RVCE Bangalore", module: "Samagri" }
  ];

  // We duplicate the tracks entirely so that as the marquee hits 50% translation, it acts as an infinite loop
  const topTrack = [...row1, ...row1, ...row1];
  const bottomTrack = [...row2, ...row2, ...row2];

  return (
    <section className="testimonials-section">
      <div className="testimonials-slant-wrapper">
        
        {/* Top Track: Moves Left */}
        <div className="testimonial-track track-left">
          {topTrack.map((item, idx) => (
            <TestimonialCard key={`top-${idx}`} data={item} index={idx} />
          ))}
        </div>

        {/* Bottom Track: Moves Right */}
        <div className="testimonial-track track-right">
          {bottomTrack.map((item, idx) => (
            <TestimonialCard key={`bot-${idx}`} data={item} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
