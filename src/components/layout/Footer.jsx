import React from "react";
import "./Footer.css";
import { Twitter, Linkedin, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <div className="footer-wrapper">
      <footer className="footer-card">
        
        {/* Left background monogram */}
        <div className="footer-monogram">RB</div>

        <div className="footer-content">
          <div className="footer-col-left">
            {/* Visual spacer on desktop to balance right column */}
          </div>

          <div className="footer-col-center">
            <h3 className="footer-tagline">The unified impact network for students.</h3>
            
            <div className="footer-social-dock">
              <a href="#" className="social-circle" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-circle" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-circle" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-circle" aria-label="Github">
                <Github size={20} />
              </a>
            </div>
            
            <div className="footer-copyright">
              © {new Date().getFullYear()} Reuse Bharat. Open Source Initiative.
            </div>
          </div>

          <div className="footer-col-right">
            <div className="footer-ethos">
              Built with purpose.<br/>
              Not profit.
            </div>
          </div>
        </div>

      </footer>
    </div>
  );
}
