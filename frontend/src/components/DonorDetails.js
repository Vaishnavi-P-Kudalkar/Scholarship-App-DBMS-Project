import React, { useState, useEffect } from 'react';
import './DonorDetails.css';

function DonationReport() {
  const [totals, setTotals] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState({
    donors: true,    // separate loading state for donors
    totals: false    // separate loading state for totals
  });

  // Fetch donor details automatically when component mounts
  useEffect(() => {
    fetchDonorDetails();
  }, []);

  const fetchDonorDetails = async () => {
    setLoading(prev => ({ ...prev, donors: true }));
    try {
      const response = await fetch('http://localhost:3000/donor');
      const data = await response.json();
      setDonors(data);
    } catch (error) {
      console.error('Error fetching donor details:', error);
    } finally {
      setLoading(prev => ({ ...prev, donors: false }));
    }
  };

  const handleCalculateClick = async () => {
    setLoading(prev => ({ ...prev, totals: true }));
    try {
      const response = await fetch('http://localhost:3000/api/calculateDonations', {
        method: 'POST'
      });
      const data = await response.json();
      setTotals(data);
    } catch (error) {
      console.error('Error calculating donations:', error);
    } finally {
      setLoading(prev => ({ ...prev, totals: false }));
    }
  };

  return (
    <div className="donation-report">
      <h2>Donation Details</h2>
      
      <div className="totals-section">
        <button onClick={handleCalculateClick} className="calculate-button">
          Calculate Totals
        </button>

        {loading.totals ? (
          <p>Calculating donation totals...</p>
        ) : totals.length > 0 ? (
          <table className="totals-table">
            <thead>
              <tr>
                <th>Scholarship</th>
                <th>Total Collection</th>
              </tr>
            </thead>
            <tbody>
              {/* Priority scholarships first */}
              {['MRD', 'CNR', 'DAC'].map(scholarshipName => {
                const scholarship = totals.find(item => 
                  item.scholarship_name === scholarshipName
                );
                return scholarship ? (
                  <tr key={scholarshipName}>
                    <td>{scholarshipName}</td>
                    <td>${scholarship.total_donations.toFixed(2)}</td>
                  </tr>
                ) : null;
              })}
              {/* Other scholarships */}
              {totals
                .filter(item => !['MRD', 'CNR', 'DAC'].includes(item.scholarship_name))
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.scholarship_name}</td>
                    <td>${item.total_donations.toFixed(2)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        ) : (
          <p>Click Calculate to view donation totals</p>
        )}
      </div>

      <div className="details-section">
        <h3>Donor Details</h3>
        {loading.donors ? (
          <p>Loading donor details...</p>
        ) : donors.length > 0 ? (
          <table className="donors-table">
            <thead>
              <tr>
                <th>Donor Name</th>
                <th>Donation Amount</th>
                <th>Donation Date</th>
                <th>Scholarship Name</th>
                <th>Student ID</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor, index) => (
                <tr key={index}>
                  <td>{donor.donor_name}</td>
                  <td>${donor.donation_amt.toFixed(2)}</td>
                  <td>{new Date(donor.donation_date).toLocaleString()}</td>
                  <td>{donor.scholarship_name}</td>
                  <td>{donor.std_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No donor details available</p>
        )}
      </div>
    </div>
  );
}

export default DonationReport;