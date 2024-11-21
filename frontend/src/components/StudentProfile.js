// src/components/StudentProfile.js
import React from 'react';

function StudentProfile() {
  // Sample student data (this would normally come from props or a database)
  const studentData = {
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    program: 'Computer Science',
    year: 'Sophomore',
    scholarshipStatus: 'Awarded'
  };

  return (
    <div>
      <h1>Student Profile</h1>
      <p><strong>Student ID:</strong> {studentData.id}</p>
      <p><strong>Name:</strong> {studentData.firstName} {studentData.lastName}</p>
      <p><strong>Program:</strong> {studentData.program}</p>
      <p><strong>Year:</strong> {studentData.year}</p>
      <p><strong>Scholarship Status:</strong> {studentData.scholarshipStatus}</p>
    </div>
  );
}

export default StudentProfile;
