const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL user
    password: 'Root', // Replace with your MySQL password
    database: 'ScholarshipDB' // Make sure this database exists
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to database');
});

// Route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Scholarship Application API');
});

// Route to get all students
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM Student';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Route to create a new student
app.post('/students', (req, res) => {
    const { student_id, first_name, last_name, dob, gender, address, aadhar_no } = req.body;
    const sql = 'INSERT INTO Student (student_id, first_name, last_name, dob, gender, address, aadhar_no) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [student_id, first_name, last_name, dob, gender, address, aadhar_no], (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.send('Student added successfully');
    });
});

// Route to get all scholarships
app.get('/scholarships', (req, res) => {
    const sql = 'SELECT * FROM Scholarship';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching scholarships:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Server starts on port 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
