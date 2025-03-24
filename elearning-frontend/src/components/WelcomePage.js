// src/components/WelcomePage.js
import React, { useState } from 'react';
import axios from 'axios';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer'; 

function WelcomePage() {
  const navigate = useNavigate();

  // Registration state
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('pupil'); // default value
  const [teacherUsername, setTeacherUsername] = useState(''); // For pupil registration

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: regEmail,
        username: regUsername,
        password: regPassword,
        role: regRole,
      };
      // If registering as a pupil, include the teacher's username (optional)
      if (regRole === 'pupil' && teacherUsername.trim() !== '') {
        payload.teacherUsername = teacherUsername;
      }
      const response = await axios.post('/api/register', payload);
      // Store username, userId and teacherId (if provided) in localStorage
      if (response.data && response.data.username) {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.id);
        if (response.data.role === 'pupil' && response.data.teacherId) {
          localStorage.setItem("teacherId", response.data.teacherId);
        }
      }
      // Redirect based on role
      if (response.data.role === 'pupil') {
        navigate('/pupil-dashboard');
      } else if (response.data.role === 'teacher') {
        navigate('/teacher-dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', {
        email: loginEmail,
        password: loginPassword,
      });
      // Store username, userId and teacherId (if provided) in localStorage
      if (response.data && response.data.username) {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.id);
        if (response.data.role === 'pupil' && response.data.teacherId) {
          localStorage.setItem("teacherId", response.data.teacherId);
        } else {
          localStorage.removeItem("teacherId"); // Clear if not applicable.
        }
      }
      // If pupil, wait for the login statistics endpoint to update login_time before navigating.
      if (response.data.role === 'pupil') {
        await axios.post('/api/statistics/login', {
          userId: response.data.id,
          username: response.data.username
        });
        navigate('/pupil-dashboard');
      } else if (response.data.role === 'teacher') {
        navigate('/teacher-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="welcome-page">
      <div className="container register-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            required
          />
          <select value={regRole} onChange={(e) => setRegRole(e.target.value)}>
            <option value="teacher">Teacher</option>
            <option value="pupil">Pupil</option>
          </select>
          {/* Only show teacher's username field if role is pupil */}
          {regRole === 'pupil' && (
            <input
              type="text"
              placeholder="Enter Teacher's Username (optional)"
              value={teacherUsername}
              onChange={(e) => setTeacherUsername(e.target.value)}
            />
          )}
          <button type="submit">Register</button>
        </form>
      </div>

      <div className="container login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
     
    </div>
  );
}

export default WelcomePage;
