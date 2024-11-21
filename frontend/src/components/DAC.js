// src/components/DAC.js
import React from 'react';
import { Link } from 'react-router-dom';
import './DAC.css';

function DAC() {
  const scholarship = {
    name: 'DAC',
    eligibility: 'Minimum GPA of 3.2',
    amount: '$2000',
    deadline: '15 Oct 2024',
    description: 'The DAC scholarship is for students pursuing research in technology and science.'
  };

  return (
    <div className="dac-container">
      <header className="dac-header">

        <h1>Scholarship Details Page</h1>
      </header>
      
      <div className="dac-content">
        <Link to="/apply" className="back-link">back to scholarships</Link>
        <h2 className="dac-title">{scholarship.name}</h2>
        <Link to="/apply/dac/applicationformdac">
  <button className="apply-button">Apply Now</button>
</Link>
        
        <table className="dac-table">
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

      <footer className="dac-footer">
        <p>Helpline: </p>
        <p>Know us: <a href="http://college-website.com">college website</a></p>
        <p>Email: mail_idpesu@gmail.com</p>
      </footer>
    </div>
  );
}

export default DAC;
