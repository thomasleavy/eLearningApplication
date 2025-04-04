// Footer.js

import React from 'react';
import './Footer.css';
import githubLogo from '../assets/github_logo.svg';
import linkedinLogo from '../assets/LinkedIn_icon.svg.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <a 
          href="https://github.com/thomasleavy" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img src={githubLogo} alt="GitHub" className="footer-icon" />
        </a>
        <a 
          href="https://www.linkedin.com/in/thomasleavy/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img src={linkedinLogo} alt="LinkedIn" className="footer-icon" />
        </a>
      </div>
      <div className="footer-text">
        x23233826 - Project (HDSDEV_SPOL23_Y2) Thomas Leavy
      </div>
    </footer>
  );
};

export default Footer;
