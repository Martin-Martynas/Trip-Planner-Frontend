import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../LandingPage.css'; 


const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const destinationUrl = isAuthenticated ? '/my-trips' : '/register';

  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>Plan Your Next Adventure</h1>
        <p>Start now with our trip planner!</p>
        <Link to={destinationUrl}>
          <button className="cta-button">Get Started</button>
        </Link>
      </div>

      <footer className="footer">
        <nav className="navigation">
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="footer-links">
            <ul>
                <li><a href="#privacy-policy">Privacy Policy</a></li>
                <li><a href="#terms-of-service">Terms of Service</a></li>
            </ul>
        </div>
  
      </footer>
    </div>
  );
}

export default LandingPage;
