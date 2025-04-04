// TeacherDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Teacher";

  const handleCreateQuiz = () => {
    navigate('/createassignquiz');
  };

  const handlePupilResults = () => {
    navigate('/pupilresults');
  };

  const handleManagePupils = () => {
    navigate('/managepupils');
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate('/');
  };

  return (
    <div className="teacher-dashboard">
      <h1>Welcome, {username}!</h1>
      <div className="dashboard-buttons">
        <button onClick={handleCreateQuiz}>Create/Assign Quiz</button>
        <button onClick={handlePupilResults}>Pupil Results</button>
        <button onClick={handleManagePupils}>Manage Pupils</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
 
    </div>
    
  );
};

export default TeacherDashboard;
