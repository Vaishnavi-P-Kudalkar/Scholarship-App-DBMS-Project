// src/components/About.js
import React from 'react';
import './About.css';
import './footer.css';

function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About the Scholarship Portal</h1>
      </header>
      
      <div className="about-content">
        <p>
          Our Scholarship Portal is dedicated to helping students find and apply for scholarships
          that suit their needs. We work to make education accessible and affordable for everyone.
        </p>
        <p>
          Our mission is to connect students with funding opportunities and provide a streamlined
          process for managing their applications. We hope this platform empowers students to reach
          their educational goals.
        </p>
      </div>
      
      <footer className="about-footer">
        <p>Contact Us: support@scholarshipportal.com</p>
        <p>Visit our official website: <a href="http://college-website.com">college website</a></p>
        <p>Follow us on social media for updates!</p>
      </footer>
    </div>
  );
}

export default About;
