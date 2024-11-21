// src/components/CNR.js
import React from 'react';
import { Link } from 'react-router-dom';
import './CNR.css';

function CNR() {
  const scholarship = {
    name: 'CNR',
    eligibility: 'Minimum GPA of 3.5',
    amount: '$2500',
    deadline: '20 Oct 2024',
    description: 'The CNR scholarship is awarded to students excelling in computer science and engineering.'
  };

  return (
    <div className="cnr-container">
      <header className="cnr-header">

        <h1>Scholarship Details Page</h1>
      </header>
      
      <div className="cnr-content">
        <Link to="/apply" className="back-link">back to scholarships</Link>
        <h2 className="cnr-title">{scholarship.name}</h2>
        <Link to="/apply/dac/applicationformcnr">
  <button className="apply-button">Apply Now</button>
</Link>
        
        <table className="cnr-table">
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

      <footer className="cnr-footer">
        <p>Helpline: </p>
        <p>Know us: <a href="http://college-website.com">college website</a></p>
        <p>Email: mail_idpesu@gmail.com</p>
      </footer>
    </div>
  );
}

export default CNR;
