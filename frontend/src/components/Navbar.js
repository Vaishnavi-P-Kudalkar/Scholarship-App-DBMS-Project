import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function Navbar() {
  const { role, updateRole } = useContext(AuthContext); // Access role and updateRole from context
  const navigate = useNavigate();

  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2c3e50',
      padding: '1rem',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    link: {
      color: '#ecf0f1',
      textDecoration: 'none',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      margin: '0 1rem',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    linkHover: {
      backgroundColor: '#3498db',
      color: '#ffffff',
    },
    logoutButton: {
      color: '#ecf0f1',
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      margin: '0 1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    logoutButtonHover: {
      backgroundColor: '#e74c3c',
      color: '#ffffff',
    },
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = styles.linkHover.backgroundColor;
    e.target.style.color = styles.linkHover.color;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = styles.link.color;
  };

  const handleLogoutMouseEnter = (e) => {
    e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor;
    e.target.style.color = styles.logoutButtonHover.color;
  };

  const handleLogoutMouseLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = styles.logoutButton.color;
  };

  const handleLogout = () => {
    updateRole(null); // Clear the role in context
    sessionStorage.removeItem('role'); // Clear the role in session storage
    navigate('/login', { replace: true }); // Redirect to login page
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Home</Link>
      <Link to="/about" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>About</Link>
      <Link to="/donors" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Donors</Link>
      <Link to="/studentslist" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Students</Link>
      <Link to="/scholarship" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Scholarships</Link>
      {role === 'admin' && (
        <Link to="/award-history" style={styles.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Award History</Link>
      )}
      <button
        style={styles.logoutButton}
        onMouseEnter={handleLogoutMouseEnter}
        onMouseLeave={handleLogoutMouseLeave}
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
