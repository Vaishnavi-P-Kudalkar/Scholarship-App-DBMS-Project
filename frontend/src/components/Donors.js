import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Donors.css';

function DonationReport() {
  const [donationData, setDonationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    donor_name: '',
    std_id: '',
    donation_amt: '',
    scholarship_name: '',
  });

  useEffect(() => {
    fetchDonationReport();
  }, []);

  const fetchDonationReport = async () => {
    try {
      const response = await fetch('http://localhost:3000/donors');
      if (!response.ok) throw new Error('Failed to fetch donation data');
      const data = await response.json();
      setDonationData(data);
    } catch (error) {
      console.error('Error fetching donation report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'std_id' && value) {
      try {
        const response = await fetch(`http://localhost:3000/students/${value}`);
        if (!response.ok) throw new Error('Failed to fetch student name');
        const data = await response.json();
        setFormData((prevData) => ({ ...prevData, donor_name: data.donor_name }));
      } catch (error) {
        console.error('Error fetching student name:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: formData.donor_name,
          std_id: parseInt(formData.std_id),
          donation_amt: parseFloat(formData.donation_amt),
          scholarship_name: formData.scholarship_name,
        }),
      });
      if (!response.ok) throw new Error('Error adding donor');
      alert('Donor added successfully!');
      fetchDonationReport();
    } catch (error) {
      console.error('Error adding donor:', error);
    }
  };

  return (
    <div className="report-container">
      <header className="report-header">
        <h1>Donation Form</h1>
      </header>
      <form onSubmit={handleSubmit} className="donation-form">
        <input type="text" name="donor_name" placeholder="Donor Name" value={formData.donor_name} onChange={handleInputChange} required />
        <input type="text" name="std_id" placeholder="Student ID" value={formData.std_id} onChange={handleInputChange} required />
        <input type="number" name="donation_amt" placeholder="Donation Amount" value={formData.donation_amt} onChange={handleInputChange} required />
        <input type="text" name="scholarship_name" placeholder="Scholarship Name" value={formData.scholarship_name} onChange={handleInputChange} required />
        <button type="submit">Add Donor</button>
      </form>
      {loading ? (
        <p>Loading donation data...</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              
            <th class="center">Want to check if you have paid?</th>
            </tr>
          </thead>
          <tbody>
            {donationData.map((donation, index) => (
              <tr key={index}>
                <td>{donation.scholarship_name}</td>
                <td>${donation.total_donations.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/donors/DonorDetails" className="view-details-button">
        View Donor Details
      </Link>
    </div>
  );
}

export default DonationReport;
