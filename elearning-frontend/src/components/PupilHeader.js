
//PupilHeader.js
import React from 'react';
import './PupilHeader.css';

const PupilHeader = () => {
  const userId = localStorage.getItem("userId");
  const chosenPin = userId ? localStorage.getItem(`chosenPin_${userId}`) : null;

  return (
    <div className="pupil-header">
      {chosenPin ? (
        <img src={chosenPin} alt="Your chosen PIN" className="pupil-pin" />
      ) : (
        <p>No avatar selected</p>
      )}
      
    </div>
  );
};

export default PupilHeader;
