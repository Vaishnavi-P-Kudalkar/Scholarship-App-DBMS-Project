import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import { AuthContext } from '../App';
import './Login.css';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateRole } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.role) {
          updateRole(data.role);
          navigate('/home', { replace: true });
        } else {
          setError('Role not found in response');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="UserId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
        
        {/* Create Account Link */}
        <div className="signup-link">
          <p>Don't have an account? <Link to="/create-account">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
