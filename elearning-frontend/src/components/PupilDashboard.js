//PupilDashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PupilHeader from './PupilHeader';
import './PupilDashboard.css';
import axios from 'axios';


const PupilDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Pupil";
  const userId = localStorage.getItem("userId");

  const handleEnterQuiz = () => {
    navigate('/beginquiz');
  };

  const handleMyStatistics = () => {
    navigate('/mystatistics');
  };

  const handleMyResults = () => {
    navigate('/myresults');
  };

  const handleSelectAvatar = () => {
    navigate('/selectavatar');
  };

  const handleChangeTeacher = () => {
    navigate('/changeteacher');
  };

  const handleLogout = () => {
    axios.post('/api/statistics/logout', { userId: Number(userId) })
      .catch(error => {
        console.error('Logout endpoint error:', error);
      })
      .finally(() => {
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        localStorage.removeItem("teacherId");
        navigate('/');
      });
  };

  return (
    <div className="pupil-dashboard">
      <PupilHeader />
      <h1>Welcome, {username}!</h1>
      <div className="dashboard-buttons">
        <button onClick={handleEnterQuiz}>Enter PIN to Take Quiz</button>
        <button onClick={handleMyStatistics}>My Statistics</button>
        <button onClick={handleMyResults}>My Results</button>
        <button onClick={handleSelectAvatar}>Select Avatar</button>
        <button onClick={handleChangeTeacher}>Associate with a Teacher</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default PupilDashboard;

