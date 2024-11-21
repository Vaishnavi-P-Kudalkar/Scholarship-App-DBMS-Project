// src/components/Scholarship.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Scholarship.css';
import './footer.css';

function Scholarship() {
  // Mock data for scholarships with more details
  const scholarships = [
    { id: 1, name: 'MRD', eligibility: 'Minimum GPA of 9.2', amount: 'Rs 10,000', description: 'Awarded to high-achieving students in all disciplines.' },
    { id: 2, name: 'CMR', eligibility: 'Minimum GPA of 8.5', amount: 'Rs 7,000', description: 'Focused on students demonstrating financial need and academic merit.' },
    { id: 3, name: 'DAC', eligibility: 'Minimum GPA of 7.3', amount: 'Rs 4,000', description: 'For students in data science and computer science fields.' }
  ];

  return (
    <div className="scholarship-container">


      <h2>Available Scholarships</h2>
      <ul className="scholarship-list">
        {scholarships.map((scholarship) => (
          <li key={scholarship.id} className="scholarship-item">
            <h3>{scholarship.name}</h3>
            <p><strong>Eligibility:</strong> {scholarship.eligibility}</p>
            <p><strong>Amount:</strong> {scholarship.amount}</p>
            <p>{scholarship.description}</p>

          </li>
        ))}
      </ul>


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

export default Scholarship;
