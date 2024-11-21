// src/components/Apply.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Apply.css';
import './footer.css';

function Apply() {
  return (
    <div className="scholarship-container">
      <h1>Scholarships</h1>
      <table className="scholarship-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Scholarship Name</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>MRD</td>
            <td>
              <Link to="/apply/mrd" className="scholarship-link">
                Apply for MRD
              </Link>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>CNR</td>
            <td>
              <Link to="/apply/cnr" className="scholarship-link">
                Apply for CNR
              </Link>
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>DAC</td>
            <td>
              <Link to="/apply/dac" className="scholarship-link">
                Apply for DAC
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      <footer className="footer">
  <p className="footer-content">
    <a href="https://pes.edu/" target="_blank" rel="noopener noreferrer">
      Know more about PES University
    </a>
    <span className="footer-email">
      <strong>Email:</strong> <a href="mailto:example@college.com">example@college.com</a>
    </span>
  </p>
</footer>
    </div>
    
  );
}

export default Apply;
