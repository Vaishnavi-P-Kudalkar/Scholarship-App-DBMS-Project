import React, { useEffect, useState } from 'react';
import './StudentList.css';
import './footer.css';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []); // Empty dependency array means this runs once on component mount.

  // Filter students based on the search query
  const filteredStudents = students.filter(student => {
    return (
      student.std_id.toString().includes(searchQuery) || // Search by student ID
      student.fname.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by first name
      student.lname.toLowerCase().includes(searchQuery.toLowerCase()) // Search by last name
    );
  });

  return (
    <div className="student-page-container">
      <header className="student-page-header">
        <h1>Student Page</h1>
      </header>
      
      <nav className="student-page-nav">
        <a href="/">HOME</a>
        <a href="/scholarships">SCHOLARSHIPS</a>
        <a href="/about">ABOUT</a>
        <a href="/students">Student</a>
        <a href="/award-history">Award History</a>
      </nav>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="search student_id or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
        />
      </div>
      
      <table className="student-list-table">
        <thead>
          <tr>
            <th>std id</th>
            <th>sl</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>dob</th>
            <th>gender</th>
            <th>Address</th>
            <th>aadhar no</th>
            <th>gpa</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student.std_id}> {/* Assuming std_id is a unique identifier */}
              <td>{student.std_id}</td>
              <td>{index + 1}</td>
              <td>{student.fname}</td> {/* Assuming you use first_name in the database */}
              <td>{student.lname}</td> {/* Assuming you use last_name in the database */}
              <td>{student.dob}</td>
              <td>{student.gender}</td>
              <td>{student.address}</td>
              <td>{student.aadhar_no}</td>
              <td>{student.gpa}</td>
            </tr>
          ))}
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

export default StudentList;
