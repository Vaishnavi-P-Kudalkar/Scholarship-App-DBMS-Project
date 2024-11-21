// src/components/Home.js
import React from 'react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Update the path based on your file structure
import './Home.css';
import './footer.css';

function Home() {
  const navigate = useNavigate();
  const { role, updateRole } = useContext(AuthContext);

  // Updated logout function using AuthContext
  const logout = () => {
    updateRole(null); // This will handle both state update and sessionStorage removal
    navigate('/login', { replace: true });
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <nav>
          {/* You can add more navigation items here if needed */}
        </nav>
      </header>

      <section className="welcome-section">
        <h1>Welcome to the Scholarship Portal</h1>
        <p>Explore scholarships and manage your applications with ease.</p>
        
        {/* Show different content based on role */}
        <div className="action-buttons">
          <Link to="/apply">
            <button className="apply-button">Apply Now</button>
          </Link>

          <Link to="/viewawardhistory">
            <button className="view-awardhistory-button">View Award History</button>
          </Link>

          {/* Admin-specific content */}
          {role === 'admin' && (
            <Link to="/award-history">
              <button className="admin-button">Award History</button>
            </Link>
          )}

          {/* Logout Button */}
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </section>

      <footer className="footer">
        <p className="footer-content">
          <a 
            href="https://pes.edu/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Know more about PES University
          </a>
          <span className="footer-email">
            <strong>Email:</strong>{' '}
            <a 
              href="mailto:example@college.com"
              className="footer-link"
            >
              example@college.com
            </a>
          </span>
        </p>
      </footer>
    </div>
  );
}

export default Home;