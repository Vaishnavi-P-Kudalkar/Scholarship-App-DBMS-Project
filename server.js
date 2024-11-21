// server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

//encryption
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL user
    password: 'Root', // Replace with your MySQL password
    database: 'scholarshipdb' // Ensure this database exists
});

// Secret key for JWT
const JWT_SECRET = 'Roots';

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to database');
});

// Corrected function with async keyword
app.post('/create-account', async (req, res) => {
  const { userId, department, password, roleId } = req.body;

  console.log('Received request to create account:', { userId, department, password, roleId });

  try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the raw password

      console.log('Hashed password:', hashedPassword);

      const query = 'INSERT INTO admins (user_id, department, password_hash, role_id) VALUES (?, ?, ?, ?)';
      db.query(query, [userId, department, hashedPassword, roleId], (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ message: 'Database error', error: err });
          }
          console.log('Account created with ID:', results.insertId);
          return res.status(201).json({ message: 'Account created successfully' });
      });
  } catch (error) {
      console.error('Error creating account:', error);
      return res.status(500).json({ message: 'Error creating account', error: error.message });
  }
});





// Route to fetch student details by ID
app.get('/students/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'SELECT * FROM students WHERE std_id = ?'; // Change 'id' to 'std_id' here
    db.query(sql, [studentId], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(results[0]);
    });
});

  
// Route to insert applicant with std_id and scholarship_name
app.post('/applicants', (req, res) => {
  const { std_id, scholarship_name } = req.body;

  // Check if the student has donated by looking up their std_id in the donor table
  const checkDonorSQL = 'SELECT * FROM donor WHERE std_id = ?';

  db.query(checkDonorSQL, [std_id], (err, results) => {
    if (err) {
      console.error('Error checking donor status:', err);
      return res.status(500).json({ message: 'Error checking donor status' });
    }

    if (results.length === 0) {
      // If no donor record is found, respond with a message
      return res.status(400).json({ message: 'Student has not donated yet. Donation required to apply.' });
    }

    // If donor exists, proceed to insert the application record
    const sql = 'INSERT INTO applicants (std_id, scholarship_name) VALUES (?, ?)';

    db.query(sql, [std_id, scholarship_name], (err, result) => {
      if (err) {
        console.error('Error inserting into applicants:', err);
        return res.status(500).json({ message: 'Error inserting into applicants' });
      }
      res.json({ appln_id: result.insertId }); // Respond with the generated appln_id
    });
  });
});


// Route to insert bank details with retrieved appln_id
app.post('/bank-details', (req, res) => {
  const { acc_no, UBI, NEFT_IFSC_code, bank_branch_code, student_id } = req.body;
  const sql = 'INSERT INTO bank_details (acc_no, UBI, NEFT_IFSC_code, bank_branch_code, student_id) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [acc_no, UBI, NEFT_IFSC_code, bank_branch_code, student_id], (err) => {
    if (err) {
      console.error('Error inserting into bank_details:', err);
      return res.status(500).json({ message: 'Error inserting into bank_details' });
    }
    res.sendStatus(201);
  });
});

// server.js
//awardhistory
app.post('/awardhistory', (req, res) => {
  const { scholarship_name, std_id } = req.body;

  const insertSQL = 'INSERT INTO awardhistory (scholarship_name, std_id) VALUES (?, ?)';
  db.query(insertSQL, [scholarship_name, std_id], (err, result) => {
    if (err) {
      console.error('Error inserting into awardhistory:', err);
      return res.status(500).json({ message: 'Error inserting into award history' });
    }
    res.sendStatus(201);
  });
});


// Scholarship awards view endpoint
app.get('/scholarship-awards-view', (req, res) => {
  const query = 'SELECT * FROM scholarship_awards_view';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching from scholarship_awards_view:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

/*const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
});*/


// Middleware to parse JSON bodies
//app.use(bodyParser.json());

// Get all awards (GET request)
app.get('/award-history', (req, res) => {
  db.query('SELECT * FROM awardhistory', (err, results) => {
    if (err) {
      console.error('Error fetching award history:', err);
      return res.status(500).json({ message: 'Error fetching award history' });
    }
    res.json(results);
  });
});

// Delete an award by award_id (DELETE request)
app.delete('/award-history/:award_Id', (req, res) => {
  const { award_Id } = req.params;

  db.query('DELETE FROM awardhistory WHERE award_id = ?', [award_Id], (err, result) => {
    if (err) {
      console.error('Error deleting award:', err);
      return res.status(500).json({ message: 'Error deleting award' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Award not found' });
    }

    res.json({ message: 'Award deleted successfully' });
  });
});

// Update award amount by award_id (PUT request)
app.put('/award-history/:award_Id', (req, res) => {
  const { award_Id } = req.params;
  const { award_amt } = req.body;

  if (!award_amt) {
    return res.status(400).json({ message: 'Award amount is required' });
  }

  db.query(
    'UPDATE awardhistory SET award_amt = ? WHERE award_id = ?',
    [award_amt, award_Id],
    (err, result) => {
      if (err) {
        console.error('Error updating award amount:', err);
        return res.status(500).json({ message: 'Error updating award amount' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Award not found' });
      }

      res.json({ message: 'Award updated successfully' });
    }
  );
});




  

// Route to get all students
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students'; // Assuming your table name is 'students'
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Database error fetching students' });
        }
        res.json(results); // Send back the results as a JSON array
    });
});

// server.js



// Other routes

// Route to fetch all award history records
app.get('/award-history', (req, res) => {
  const sql = 'SELECT * FROM awardhistory';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching award history:', err);
      return res.status(500).json({ error: 'Database error fetching award history' });
    }
    res.json(results);  // Send the results back as a JSON array
  });
});


// New route to add a donor
// Route to get student name by std_id
// Route to fetch student data by std_id
app.get('/students/:std_id', (req, res) => {
  const { std_id } = req.params;
  const sql = 'SELECT CONCAT(fname, " ", lname) AS donor_name FROM students WHERE std_id = ?';
  db.query(sql, [std_id], (err, result) => {
    if (err) {
      console.error('Error fetching student data:', err);
      return res.status(500).json({ error: 'Database error fetching student data' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result[0]);
  });
});

// inset into donors page
// Endpoint to insert a new donor into the database
app.post('/donors', (req, res) => {
  const { donor_name, std_id, donation_amt, scholarship_name } = req.body;

  // SQL query to insert a new donor record into the donor table
  const sql = `
    INSERT INTO donor (donor_name, std_id, donation_amt, scholarship_name)
    VALUES (?, ?, ?, ?)
  `;

  // Execute the SQL query
  db.query(sql, [donor_name, std_id, donation_amt, scholarship_name], (err, result) => {
    if (err) {
      console.error('Error inserting donor data:', err);
      return res.status(500).json({ error: 'Database error inserting donor data' });
    }
    res.status(201).json({ message: 'Donor added successfully' });
  });
});

// donor details

// Endpoint to calculate donations using GetDonationReport stored procedure
app.post('/api/calculateDonations', (req, res) => {
  const query = 'CALL GetDonationReport()';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing GetDonationReport:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // MySQL stored procedures return results as results[0]
    // Since your procedure returns a SELECT statement
    const totals = results[0];
    res.json(totals);
  });
});

// Endpoint to fetch donor details
app.get('/donor', (req, res) => {
  const query = 'SELECT donor_name, donation_amt, donation_date, scholarship_name, std_id FROM donor';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching donor details:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// server.js (continuing from your existing code)





// Define your JWT secret (should be stored securely, e.g., in an environment variable)

// Login route to handle both Admin and Student authentication
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Check if the user is an admin
    let user = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM admins WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });

    if (user) {
      // Admin found, compare password
      const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
      if (isPasswordMatch) {
        const token = jwt.sign({ userId: user.user_id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, role: 'admin' });
      } else {
        return res.status(401).json({ message: 'Incorrect password for admin.' });
      }
    }

    console.log('hi');

    // Check if the user is a student if not an admin
    user = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM students WHERE std_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });

    if (user) {
      // Student found, compare password (no hash for student in your case)
      const isPasswordMatch = (password === user.password);
      if (isPasswordMatch) {
        const token = jwt.sign({ userId: user.std_id, role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, role: 'student' });
      } else {
        return res.status(401).json({ message: 'Incorrect password for student.' });
      }
    }

    // If no user found
    return res.status(404).json({ message: 'User not found.' });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});








/*
// Login endpoint
// Login route
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  // First, check if user is an admin
  db.query('SELECT * FROM admins WHERE user_id = ?', [userId], async (err, adminResults) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (adminResults.length > 0) {
          // Admin found
          const admin = adminResults[0];
          const isPasswordMatch = await bcrypt.compare(password, admin.password_hash);
          if (isPasswordMatch) {
              const token = jwt.sign({ userId: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
              return res.json({ token, role: 'admin' });
          } else {
              return res.status(401).json({ message: 'Incorrect password' });
          }
      } else {
          // Check if user is a student
          db.query('SELECT * FROM students WHERE std_id = ?', [userId], async (err, studentResults) => {
              if (err) return res.status(500).json({ message: 'Database error' });

              if (studentResults.length > 0) {
                  // Student found
                  const student = studentResults[0];
                  const isPasswordMatch = await bcrypt.compare(password, student.password_hash);
                  if (isPasswordMatch) {
                      const token = jwt.sign({ userId: student.std_id, role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
                      return res.json({ token, role: 'student' });
                  } else {
                      return res.status(401).json({ message: 'Incorrect password' });
                  }
              } else {
                  return res.status(404).json({ message: 'User not found' });
              }
          });
      }
  });
});*/


// Middleware to verify JWT and role
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
  });
}

// Example of using middleware to protect /award-history endpoint
app.get('/award-history', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
  }
  // Your code to fetch and return award history data
});


// Create the deleted_records table if it doesn't exist
const createDeletedRecordsTable = `
CREATE TABLE IF NOT EXISTS deleted_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    award_id INT,
    std_id VARCHAR(255),
    scholarship_name VARCHAR(255),
    award_date DATE,
    award_amt DECIMAL(10,2),
    deletion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createDeletedRecordsTable, (err) => {
  if (err) {
    console.error('Error creating deleted_records table:', err);
  } else {
    console.log('deleted_records table created or already exists');
  }
});

// Create trigger for backing up deleted records
const createTrigger = `
CREATE TRIGGER IF NOT EXISTS backup_deleted_awards
BEFORE DELETE ON awardhistory
FOR EACH ROW
BEGIN
    INSERT INTO deleted_records (award_id, std_id, scholarship_name, award_date, award_amt)
    VALUES (OLD.award_id, OLD.std_id, OLD.scholarship_name, OLD.award_date, OLD.award_amt);
END;
`;

db.query(createTrigger, (err) => {
  if (err) {
    console.error('Error creating trigger:', err);
  } else {
    console.log('Trigger created or already exists');
  }
});

app.get('/view-backup', (req, res) => {
  const query = 'SELECT * FROM deleted_awards';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching deleted awards:', err);
      return res.status(500).json({ message: 'Error fetching deleted awards' });
    }
    res.json(results);
  });
});

// Route to get deleted records
app.get('/deleted-records', (req, res) => {
  const query = 'SELECT * FROM deleted_records ORDER BY deletion_date DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching deleted records:', err);
      return res.status(500).json({ message: 'Error fetching deleted records' });
    }
    res.json(results);
  });
});

// Route to fetch all records from the awardbackup table
app.get('/award-backup', (req, res) => {
  const sql = 'SELECT * FROM awardbackup';  // Fetch all data from awardbackup table
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching awardbackup records:', err);
      return res.status(500).json({ message: 'Error fetching awardbackup records' });
    }
    res.json(results);  // Send the records back as a JSON response
  });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
// stored procedure working