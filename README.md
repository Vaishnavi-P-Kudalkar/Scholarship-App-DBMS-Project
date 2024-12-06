# Scholarship-App-DBMS-Project
This is a scholarship database 

1) How to Run the Project
Start the Backend:

Open a terminal and navigate to the project's main directory.
Run the command: npm start.
This will start the backend server on a designated port.
Start the Frontend:

Open another terminal.
Navigate to the frontend folder by running: cd frontend.
Start the frontend application with the command: npm start.
This will launch the frontend interface on a different port.

2) Database
   a. Tables
        -- Table: admins
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    department VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (user_id) REFERENCES students(std_id)
);

-- Table: awardbackup
CREATE TABLE awardbackup (
    award_id INT AUTO_INCREMENT PRIMARY KEY,
    award_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    award_amt FLOAT,
    scholarship_name VARCHAR(255),
    std_id INT,
    FOREIGN KEY (scholarship_name) REFERENCES scholarship(scholarship_name),
    FOREIGN KEY (std_id) REFERENCES students(std_id)
);

-- Table: awardhistory
CREATE TABLE awardhistory (
    award_id INT AUTO_INCREMENT PRIMARY KEY,
    award_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    award_amt FLOAT,
    scholarship_name VARCHAR(255),
    std_id INT,
    FOREIGN KEY (scholarship_name) REFERENCES scholarship(scholarship_name),
    FOREIGN KEY (std_id) REFERENCES students(std_id)
);

-- Table: bank_details
CREATE TABLE bank_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    acc_no VARCHAR(20),
    UBI VARCHAR(20),
    NEFT_IFSC_code VARCHAR(20),
    bank_branch_code VARCHAR(20),
    student_id INT,
    FOREIGN KEY (student_id) REFERENCES students(std_id)
);

-- Table: deleted_awards
CREATE TABLE deleted_awards (
    deleted_id INT AUTO_INCREMENT PRIMARY KEY,
    award_id INT NOT NULL,
    award_date DATETIME DEFAULT NULL,
    award_amt FLOAT DEFAULT NULL,
    scholarship_name VARCHAR(255) DEFAULT NULL,
    std_id INT DEFAULT NULL,
    deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: deleted_records
CREATE TABLE deleted_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    award_id INT,
    std_id VARCHAR(255),
    scholarship_name VARCHAR(255),
    award_date DATE,
    award_amt DECIMAL(10,2),
    deletion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: donor
CREATE TABLE donor (
    donor_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_name VARCHAR(100),
    donation_amt FLOAT,
    donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    scholarship_name VARCHAR(255),
    std_id INT,
    FOREIGN KEY (scholarship_name) REFERENCES scholarship(scholarship_name),
    FOREIGN KEY (std_id) REFERENCES students(std_id)
);

-- Table: roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Table: scholarship
CREATE TABLE scholarship (
    scholarship_name VARCHAR(255) PRIMARY KEY,
    amount FLOAT,
    eligibility_criteria VARCHAR(255)
);

-- View: scholarship_awards_view
CREATE OR REPLACE VIEW scholarship_awards_view AS
SELECT
    award_id,
    DATE_FORMAT(award_date, '%Y-%m-%d') AS award_date,
    award_amt,
    scholarship_name,
    std_id
FROM awardhistory;

-- Table: students
CREATE TABLE students (
    std_id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100),
    dob DATE,
    gender ENUM('Male', 'Female', 'Other'),
    address VARCHAR(255),
    aadhar_no VARCHAR(20) UNIQUE,
    gpa FLOAT,
    role_id INT,
    password VARCHAR(255),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

b). Triggers
   -- Trigger: before_awardhistory_insert
CREATE TRIGGER before_awardhistory_insert
BEFORE INSERT ON awardhistory
FOR EACH ROW
BEGIN
    DECLARE scholarshipAmount FLOAT;

    SELECT amount INTO scholarshipAmount
    FROM scholarship
    WHERE scholarship_name = NEW.scholarship_name;

    IF scholarshipAmount IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Scholarship not found';
    ELSE
        SET NEW.award_amt = scholarshipAmount;
    END IF;
END;

-- Trigger: backup_deleted_awards
CREATE TRIGGER backup_deleted_awards
BEFORE DELETE ON awardhistory
FOR EACH ROW
BEGIN
    INSERT INTO deleted_records (award_id, std_id, scholarship_name, award_date, award_amt)
    VALUES (OLD.award_id, OLD.std_id, OLD.scholarship_name, OLD.award_date, OLD.award_amt);
END;

c). Procedures
   -- Procedure: GetDonationReport
CREATE PROCEDURE GetDonationReport()
BEGIN
    SELECT scholarship_name, SUM(donation_amt) AS total_donations
    FROM donor
    GROUP BY scholarship_name;
END;

-- Procedure: move_to_deleted_awards
CREATE PROCEDURE move_to_deleted_awards(IN p_award_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred moving the award to deleted_awards';
    END;

    START TRANSACTION;

    INSERT INTO deleted_awards (award_id, award_date, award_amt, scholarship_name, std_id)
    SELECT award_id, award_date, award_amt, scholarship_name, std_id
    FROM awardhistory
    WHERE award_id = p_award_id;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Failed to insert award into deleted_awards';
    END IF;

    DELETE FROM awardhistory WHERE award_id = p_award_id;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Failed to delete award from awardhistory';
    END IF;

    COMMIT;
END;

3) Code Flow Explanation

Eligibility to Apply for Scholarships:
  ->A student must donate a minimum amount to the corresponding scholarship to be eligible to apply.
  ->Donations are recorded in the donor table through the donor form.

Scholarship Application Process:
  ->When a student applies for a scholarship, the system checks the donor table to verify that the student's ID is present and meets the donation criteria.
  ->If the criteria are met, the application proceeds; otherwise, it is rejected.

Application Evaluation:
  ->Applications are evaluated based on the student's GPA.
  ->If the GPA meets the eligibility criteria for the scholarship, the application is accepted and recorded in the awardhistory table.
    Otherwise, the application is rejected.

Data Flow Overview:
  ->Donor Form Submission: Updates the donor table with donation details.
  ->Scholarship Application: Checks donor table for eligibility, evaluates GPA, and records the outcome in awardhistory.
