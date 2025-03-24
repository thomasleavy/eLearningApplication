// src/components/ChangeTeacher.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChangeTeacher.css';

const ChangeTeacher = () => {
  const navigate = useNavigate();
  const [newTeacherUsername, setNewTeacherUsername] = useState('');

  const handleChangeTeacher = () => {
    const pupilId = localStorage.getItem("userId");
    if (!pupilId) {
      alert("User not found. Please log in again.");
      return;
    }
    axios.put(`/api/pupils/${pupilId}/teacher`, { teacherUsername: newTeacherUsername })
      .then(response => {
        if (response.data && response.data.teacherId) {
          localStorage.setItem("teacherId", response.data.teacherId);
        }
        alert('Teacher updated successfully.');
        navigate('/pupil-dashboard');
      })
      .catch(error => {
        console.error("Error updating teacher:", error);
        alert("Failed to update teacher. Please check the teacher's username and try again.");
      });
  };

  const handleCancel = () => {
    navigate('/pupil-dashboard');
  };

  return (
    <div className="change-teacher">
      <h1>Change Your Teacher</h1>
      <input 
        type="text"
        placeholder="Enter new teacher's username"
        value={newTeacherUsername}
        onChange={(e) => setNewTeacherUsername(e.target.value)}
      />
      <button onClick={handleChangeTeacher}>Update Teacher</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default ChangeTeacher;
