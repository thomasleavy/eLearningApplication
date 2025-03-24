//this is for displaying the pupil's pin across 
//the application interface
// src/components/PupilHeader.js
// src/components/PupilHeader.js
import React from 'react';
import './PupilHeader.css';
import Footer from './Footer'; 

const PupilHeader = () => {
  const userId = localStorage.getItem("userId");
  const chosenPin = userId ? localStorage.getItem(`chosenPin_${userId}`) : null;

  return (
    <div className="pupil-header">
      {chosenPin ? (
        <img src={chosenPin} alt="Your selected PIN" className="pupil-pin" />
      ) : (
        <p>No PIN selected</p>
      )}
      
    </div>
  );
};

export default PupilHeader;
