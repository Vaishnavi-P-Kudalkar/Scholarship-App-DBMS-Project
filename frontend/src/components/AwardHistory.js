import React, { useEffect, useState } from 'react';
import './AwardHistory.css';

function AwardHistory({ refreshKey }) {
  const [awards, setAwards] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [newAwardAmount, setNewAwardAmount] = useState('');
  const [showBackup, setShowBackup] = useState(false);
  const [deletedRecords, setDeletedRecords] = useState([]);
  const [isDeletedRecordsVisible, setIsDeletedRecordsVisible] = useState(false);

  // Fetch award history when the component mounts or when refreshKey changes
  useEffect(() => {
    const fetchAwardHistory = async () => {
      try {
        const response = await fetch('http://localhost:3000/award-history');
        const data = await response.json();
        setAwards(data);
      } catch (error) {
        console.error('Error fetching award history:', error);
      }
    };

    fetchAwardHistory();
  }, [refreshKey]);

  // Function to fetch deleted records
  const fetchDeletedRecords = async () => {
    try {
      const response = await fetch('http://localhost:3000/deleted-records');
      const data = await response.json();
      setDeletedRecords(data);
      setIsDeletedRecordsVisible(true);
    } catch (error) {
      console.error('Error fetching deleted records:', error);
    }
  };

  // Function to handle deleting an award
  const handleDelete = async (awardId) => {
    try {
      const response = await fetch(`http://localhost:3000/award-history/${awardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAwards(awards.filter(award => award.award_id !== awardId));
        setShowBackup(true);
        alert('Award deleted successfully');
      } else {
        alert('Failed to delete the award');
      }
    } catch (error) {
      console.error('Error deleting award:', error);
      alert('Error deleting the award');
    }
  };

  // Function to handle updating an award amount
  const handleUpdate = async (awardId) => {
    try {
      const response = await fetch(`http://localhost:3000/award-history/${awardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          award_amt: newAwardAmount,
        }),
      });

      if (response.ok) {
        setAwards(awards.map(award =>
          award.award_id === awardId
            ? { ...award, award_amt: newAwardAmount }
            : award
        ));
        setIsEditing(null);
        setNewAwardAmount('');
        alert('Award updated successfully');
      } else {
        alert('Failed to update the award amount');
      }
    } catch (error) {
      console.error('Error updating award amount:', error);
      alert('Error updating award amount');
    }
  };

  // Function to handle showing backup (deleted records)
  const handleShowBackup = () => {
    if (!isDeletedRecordsVisible) {
      fetchDeletedRecords();  // Fetch and show deleted records if not already visible
    } else {
      setIsDeletedRecordsVisible(false);  // Toggle visibility
    }
  };

  return (
    <div className="award-history-container">
      <h2>Award History</h2>
      <table className="award-history-table">
        <thead>
          <tr>
            <th>Award ID</th>
            <th>Student ID</th>
            <th>Scholarship Name</th>
            <th>Award Date</th>
            <th>Award Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {awards.map((award) => (
            <tr key={award.award_id}>
              <td>{award.award_id}</td>
              <td>{award.std_id}</td>
              <td>{award.scholarship_name}</td>
              <td>{new Date(award.award_date).toLocaleDateString()}</td>
              <td>
                {isEditing === award.award_id ? (
                  <>
                    <input
                      type="number"
                      step="0.01"
                      value={newAwardAmount}
                      onChange={(e) => setNewAwardAmount(e.target.value)}
                    />
                    <button onClick={() => handleUpdate(award.award_id)}>Update</button>
                  </>
                ) : (
                  <>
                    {award.award_amt}
                    <button onClick={() => setIsEditing(award.award_id)}>Edit</button>
                  </>
                )}
              </td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(award.award_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showBackup && (
        <button 
          className="view-backup-button" 
          onClick={handleShowBackup}  // Call handleShowBackup on button click
        >
          {isDeletedRecordsVisible ? 'Hide Backup' : 'View Backup'}
        </button>
      )}

      {isDeletedRecordsVisible && (
        <div className="deleted-records-container">
          <h3>Deleted Records</h3>
          <table className="award-history-table">
            <thead>
              <tr>
                <th>Award ID</th>
                <th>Student ID</th>
                <th>Scholarship Name</th>
                <th>Award Date</th>
                <th>Award Amount</th>
                <th>Deletion Date</th>
              </tr>
            </thead>
            <tbody>
              {deletedRecords.map((record) => (
                <tr key={record.award_id}>
                  <td>{record.award_id}</td>
                  <td>{record.std_id}</td>
                  <td>{record.scholarship_name}</td>
                  <td>{new Date(record.award_date).toLocaleDateString()}</td>
                  <td>{record.award_amt}</td>
                  <td>{new Date(record.deletion_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AwardHistory;
