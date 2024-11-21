// src/components/CreateAccount.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css'; // Importing the CSS file for styling
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

const CreateAccount = () => {
    const [userId, setUserId] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const navigate = useNavigate();

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            // Send the raw password to the backend (no hashing here)
            const response = await axios.post('http://localhost:3000/create-account', { 
                userId, 
                department, 
                password, // Send the raw password to the backend
                roleId 
            });
    
            if (response.status === 201) {
                alert('Account created successfully!');
                navigate('/login'); // Redirect to login after successful account creation
            }
        } catch (error) {
            console.error('Account creation failed:', error.response?.data?.message || error.message);
            alert('Account creation failed. Please try again.');
    
            if (error.response) {
                console.error('Backend error details:', error.response.data);
            }
        }
    };
    
    

    return (
        <div className="create-account-container">
            <form onSubmit={handleCreateAccount} className="create-account-form">
                <h2>Create Account</h2>
                <input 
                    type="text" 
                    placeholder="User ID" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Department" 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Role ID (e.g., admin, student)" 
                    value={roleId} 
                    onChange={(e) => setRoleId(e.target.value)} 
                    required 
                />
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
};

export default CreateAccount;
