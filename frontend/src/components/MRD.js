// src/components/MRD.js
import React from 'react';
import { Link } from 'react-router-dom';
import './MRD.css';

function MRD() {
  const scholarship = {
    name: 'MRD',
    eligibility: 'Minimum GPA of 3.5',
    amount: '$1000',
    deadline: '31 Dec 2024',
    description: 'The MRD scholarship is awarded to students with outstanding academic achievements.'
  };

  return (
    <div className="mrd-container">
      <header className="mrd-header">

        <h1>Scholarship Details Page</h1>
      </header>
      
      <div className="mrd-content">
        <Link to="/apply" className="back-link">back to scholarships</Link>
        <h2 className="mrd-title">{scholarship.name}</h2>
        <Link to="/apply/dac/applicationformmrd">
  <button className="apply-button">Apply Now</button>
</Link>

        
        <table className="mrd-table">
          <tbody>
            <tr>
              <td>Eligibility</td>
              <td>{scholarship.eligibility}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>{scholarship.amount}</td>
            </tr>
            <tr>
              <td>Deadline</td>
              <td>{scholarship.deadline}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{scholarship.description}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className="mrd-footer">
        <p>Helpline: </p>
        <p>Know us: <a href="http://college-website.com">college website</a></p>
        <p>Email: mail_idpesu@gmail.com</p>
      </footer>
    </div>
  );
}

export default MRD;
