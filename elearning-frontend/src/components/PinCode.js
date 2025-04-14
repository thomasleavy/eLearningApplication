//PinCode.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PinCode.css';

const PinCode = () => {
  const navigate = useNavigate();
  const { quizCode } = useLocation().state || {};

  if (!quizCode) {
    return <div>No quiz code found. Please create a quiz again!</div>;
  }

  return (
    <div className="pin-code-container">
      <h1>Your Quiz Code!</h1>
      <div className="pin-code">{quizCode}</div>
      <button onClick={() => navigate('/teacher-dashboard')}>Back to Dashboard</button>
  
    </div>
  );
};

export default PinCode;
