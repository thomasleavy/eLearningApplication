// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role"); // Retrieve the user role

    if (userId) {
      if (role === "pupil") {
        navigate('/pupil-dashboard');
      } else if (role === "teacher") {
        navigate('/teacher-dashboard');
      } else {
        // If role is not defined, redirect to a landing or home page.
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <header className="site-header" onClick={handleClick}>
      <h1>Primary Pals e-Learning Platform</h1>
    </header>
  );
};

export default Header;
