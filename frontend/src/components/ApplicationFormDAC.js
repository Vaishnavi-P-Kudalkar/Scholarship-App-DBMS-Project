import React, { useState } from 'react';
import './ApplicationFormDAC.css';
import { Link } from 'react-router-dom';

function ApplicationForm() {
  const [formData, setFormData] = useState({
    std_id: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    address: '',
    aadhar_no: '',
    gpa: '',
    scholarship_name: 'DAC',
    acc_no: '',
    UBI: '',
    NEFT_TFSC_code: '',
    bank_branch_code: ''
  });

  const MIN_GPA = 7.3; // Example minimum GPA for eligibility
  const MAX_GPA = 8.4; // Example maximum GPA for eligibility

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStudentIdChange = (event) => {
    const studentId = event.target.value;
    setFormData({ ...formData, std_id: studentId });
    
    // Only fetch student details if the student ID is exactly 5 characters long
    if (studentId.length === 5) {
      fetchStudentDetails(studentId);
    } else if (studentId.length < 5) {
      // Reset the form if student ID is less than 5 characters
      setFormData(prevState => ({
        ...prevState,
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        address: '',
        aadhar_no: '',
        gpa: ''
      }));
    }
  };
  

  const fetchStudentDetails = async (studentId) => {
    if (!studentId || isNaN(studentId)) {
      alert('Please enter a valid numeric Student ID.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/students/${studentId}`);
      if (!response.ok) {
        if (response.status === 404) {
          alert('No student found with the given ID.');
        } else {
          throw new Error('Failed to fetch student details');
        }
        return;
      }
  
      const student = await response.json();
      const formattedDob = new Date(student.dob).toISOString().split('T')[0]; 
      setFormData(prevState => ({
        ...prevState,
        firstName: student.fname,
        lastName: student.lname,
        dob: formattedDob,
        gender: student.gender,
        address: student.address,
        aadhar_no: student.aadhar_no,
        gpa: student.gpa,
      }));
    } catch (error) {
      console.error('Error fetching student details:', error);
      alert('Could not fetch student details. Please check the student ID.');
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const gpa = parseFloat(formData.gpa);
    if (gpa < MIN_GPA || gpa > MAX_GPA) {
      alert(`Criteria not met: GPA must be between ${MIN_GPA} and ${MAX_GPA}.`);
      return;
    }
  
    try {
      // Step 1: Insert into Applicants to get appln_id
      const applicantResponse = await fetch('http://localhost:3000/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          std_id: formData.std_id,
          scholarship_name: formData.scholarship_name,
        }),
      });
  
      if (!applicantResponse.ok) {
        throw new Error('Error submitting applicant data');
      }
  
      const { appln_id } = await applicantResponse.json();
      console.log('Received appln_id:', appln_id); // Log to confirm appln_id
  
      // Step 2: Insert bank details with the retrieved appln_id
      const bankResponse = await fetch('http://localhost:3000/bank-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acc_no: formData.acc_no,
          UBI: formData.UBI, // Assuming UBI field represents the bank name
          NEFT_IFSC_code: formData.NEFT_TFSC_code,
          bank_branch_code: formData.bank_branch_code,
          student_id: formData.std_id, // Use std_id as foreign key in bank_details
        }),
      });
  
      if (!bankResponse.ok) {
        throw new Error('Error submitting bank details');
      }
  
        // Step 3: Insert into Award History
    const awardResponse = await fetch('http://localhost:3000/awardhistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scholarship_name: formData.scholarship_name,
        std_id: formData.std_id, 
      }),
    });

    if (!awardResponse.ok) {
      throw new Error('Error submitting award history');
    }

      alert('Form submitted successfully!');
      handleClear();
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form');
    }
  };
  
  const handleClear = () => {
    setFormData({
      std_id: '',
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      address: '',
      aadhar_no: '',
      gpa: '',
      scholarship_name: '',
      acc_no: '',
      UBI: '',
      NEFT_IFSC_code: '',
      bank_branch_code: ''
    });
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <h1>Application Form: DAC</h1>

      </header>
      
      <form id="applicationForm" onSubmit={handleSubmit} className="application-form">
        <table className="form-table">
          <tbody>
            <tr>
              <td>Student ID</td>
              <td><input type="text" name="std_id" value={formData.std_id} onChange={handleStudentIdChange} required /></td>
            </tr>
            <tr>
              <td>First Name</td>
              <td><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Date of Birth</td>
              <td><input type="date" name="dob" value={formData.dob} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Address</td>
              <td><input type="text" name="address" value={formData.address} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Aadhar Number</td>
              <td><input type="text" name="aadhar_no" value={formData.aadhar_no} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>GPA</td>
              <td><input type="number" step="0.01" name="gpa" value={formData.gpa} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Name Of Scholarship</td>
              <td><input type="text" name="scholarship_name" value={formData.scholarship_name} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Account Number</td>
              <td><input type="text" name="acc_no" value={formData.acc_no} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>UBI</td>
              <td><input type="text" name="UBI" value={formData.UBI} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>NEFT/IFSC Code</td>
              <td><input type="text" name="NEFT_IFSC_code" value={formData.NEFT_IFSC_code} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Bank Branch Code</td>
              <td><input type="text" name="bank_branch_code" value={formData.bank_branch_code} onChange={handleChange} required /></td>
            </tr>
          </tbody>
        </table>
        <div className="form-buttons">
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" onClick={handleClear} className="clear-button">Clear</button>
        </div>
      </form>

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

export default ApplicationForm;
