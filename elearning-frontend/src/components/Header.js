//Header.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const userId = localStorage.getItem("userId");
    const teacherId = localStorage.getItem("teacherId");

//conditional statements for redirecting to appropriate page after clicking on the header
    if (userId) {
      
      if (teacherId) {
        navigate('/pupil-dashboard');
      } else {
 
        navigate('/teacher-dashboard');
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
