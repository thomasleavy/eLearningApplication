//ChangeTeacher.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChangeTeacher.css';

const ChangeTeacher = () => {
  const navigate = useNavigate();
  const [newTeacherUsername, setNewTeacherUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangeTeacher = () => {
    const pupilId = localStorage.getItem("userId");
    if (!pupilId) {
      setErrorMessage("The user was not found.");
      return;
    }
    axios.put(`/api/pupils/${pupilId}/teacher`, { teacherUsername: newTeacherUsername })
      .then(response => {
        if (response.data && response.data.teacherId) {
          localStorage.setItem("teacherId", response.data.teacherId);
        }
        setErrorMessage("");
        navigate('/pupil-dashboard');
      })
      .catch(error => {
        console.error("there was an error updating teacher:", error);
        setErrorMessage("Sorry, but failed to update teacher. Please check the teacher's username and try again!");
      });
  };

  const handleCancel = () => {
    setErrorMessage("");
    navigate('/pupil-dashboard');
  };

  return (
    <div className="change-teacher">
      <h1>Change Your Teacher</h1>
      <input 
        type="text"
        placeholder="Enter a new teacher's username"
        value={newTeacherUsername}
        onChange={(e) => {
          setNewTeacherUsername(e.target.value);
          setErrorMessage("");
        }}
      />
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      <button onClick={handleChangeTeacher}>Update Teacher</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default ChangeTeacher;
