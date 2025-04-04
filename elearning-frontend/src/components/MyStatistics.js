// MyStatistics.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PupilHeader from './PupilHeader';
import axios from 'axios';
import './MyStatistics.css';
import Footer from './Footer'; 

const MyStatistics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios.get(`/api/statistics/${userId}`)
        .then(response => {
          setStats(response.data);
        })
        .catch(error => {
          console.error("there wasn an error fetching the statistics:", error);
        });
    }
  }, [userId]);

  
  const formatAccumulatedTime = (accumulatedSeconds, loginTime) => {
    let totalSeconds = accumulatedSeconds || 0;
    if (loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();
      totalSeconds += Math.floor((now - loginDate) / 1000);
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours} hours ${minutes} minutes`;
  };

  const handleBack = () => {
    navigate('/pupil-dashboard');
  };

  return (
    <div className="my-statistics">
      <PupilHeader />
      <h1>My Statistics</h1>
      {stats ? (
        <div className="stats">
          <p><strong>User ID:</strong> {stats.userId}</p>
          <p><strong>Username:</strong> {stats.username || "N/A"}</p>
          <p><strong>Points:</strong> {stats.points !== null ? stats.points : 'N/A'}</p>
          <p>
            <strong>Total Time Logged In:</strong> {formatAccumulatedTime(stats.accumulatedTime, stats.loginTime)}
          </p>
          <p><strong>Quizzes Completed:</strong> {stats.quizzesCompleted}</p>
        </div>
      ) : (
        <p>Loading statistics...</p>
      )}
      <button className="back-button" onClick={handleBack}>Back to Dashboard</button>
   
    </div>
  );
};

export default MyStatistics;
