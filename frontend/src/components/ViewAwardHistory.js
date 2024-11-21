// ViewAwardHistory.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ViewAwardHistory.css';

function ViewScholarships() {
  const [scholarshipAwards, setScholarshipAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchScholarshipAwards();
  }, []); // Consider adding id to dependency array if needed

  const fetchScholarshipAwards = async () => {
    try {
      const response = await fetch('http://localhost:3000/scholarship-awards-view');
      if (!response.ok) {
        throw new Error(`Failed to fetch scholarship awards: ${response.status}`);
      }
      const data = await response.json();
      setScholarshipAwards(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading scholarship awards...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="scholarship-history">
      <h2>Scholarship Awards History</h2>
      <div className="awards-container">
        {scholarshipAwards.length > 0 ? (
          <table className="awards-table">
            <thead>
              <tr>
                <th>Award ID</th>
                <th>Award Date</th>
                <th>Award Amount</th>
                <th>Scholarship Name</th>
                <th>Student ID</th>
              </tr>
            </thead>
            <tbody>
              {scholarshipAwards.map((award) => (
                <tr key={award.award_id}>
                  <td>{award.award_id}</td>
                  <td>{award.award_date}</td>
                  <td>${parseFloat(award.award_amt).toFixed(2)}</td>
                  <td>{award.scholarship_name}</td>
                  <td>{award.std_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-awards">No scholarship awards found</div>
        )}
      </div>
    </div>
  );
}

export default ViewScholarships;