// src/components/ManagePupils.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManagePupils.css';

const ManagePupils = () => {
  const navigate = useNavigate();
  const [pupils, setPupils] = useState([]);
  const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPupils = () => {
      axios.get(`/api/pupils/teacher/${teacherId}`)
        .then(response => {
          setPupils(response.data);
        })
        .catch(error => {
          console.error("Error fetching pupils:", error);
          alert("Error fetching pupils.");
        });
    };
    fetchPupils();
  }, [teacherId]);

  const handleDelete = (pupilId) => {
    if (window.confirm("Are you sure you want to delete this pupil?")) {
      axios.delete(`/api/pupils/${pupilId}`)
        .then(response => {
          alert("Pupil deleted successfully.");
          // Re-fetch pupils after deletion.
          axios.get(`/api/pupils/teacher/${teacherId}`)
            .then(response => {
              setPupils(response.data);
            })
            .catch(error => {
              console.error("Error fetching pupils:", error);
              alert("Error fetching pupils.");
            });
        })
        .catch(error => {
          console.error("Error deleting pupil:", error);
          alert("Error deleting pupil.");
        });
    }
  };

  const handleBack = () => {
    navigate('/teacher-dashboard');
  };

  return (
    <div className="manage-pupils">
      <h1>Manage Pupils</h1>
      {pupils.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pupils.map((pupil) => (
              <tr key={pupil.id}>
                <td>{pupil.id}</td>
                <td>{pupil.username}</td>
                <td>{pupil.email}</td>
                <td>
                  <button onClick={() => handleDelete(pupil.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pupils found.</p>
      )}
      <button className="back-button" onClick={handleBack}>Back to Dashboard</button>

    </div>
  );
};

export default ManagePupils;
