//SelectAvatar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bronzeTrophy from '../assets/bronze_trophy.jpg';
import silverTrophy from '../assets/silver_trophy.jpg';
import goldTrophy from '../assets/gold_trophy.jpg';
import axios from 'axios';
import './SelectAvatar.css';

const availablePins = [
  { id: 1, name: 'Bronze', src: bronzeTrophy, requiredPoints: 0 },
  { id: 2, name: 'Silver', src: silverTrophy, requiredPoints: 5 },
  { id: 3, name: 'Gold', src: goldTrophy, requiredPoints: 10 }
];

const SelectPin = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const storedPin = userId ? localStorage.getItem(`chosenPin_${userId}`) : null;
  const [currentPin, setCurrentPin] = useState(storedPin || availablePins[0].src);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (userId) {
      axios.get(`/api/statistics/${userId}`)
        .then(response => {
          if (response.data && response.data.points !== null) {
            setPoints(response.data.points);
          }
        })
        .catch(error => console.error("there was an rrror fetching thr statistics:", error));
    }
  }, [userId]);

  const handleSelectPin = (pinSrc, requiredPoints) => {
    if (points >= requiredPoints) {
      setCurrentPin(pinSrc);
      if (userId) {
        localStorage.setItem(`chosenPin_${userId}`, pinSrc);
      } else {
        localStorage.setItem('chosenPin', pinSrc);
      }
    } else {
      alert(`You need at least ${requiredPoints} points to unlock this avatar.`);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="select-pin">
      <h1>Select/Change Avatar</h1>
      <div className="current-pin-container">
        <h2>Your Current Avatar</h2>
        <img src={currentPin} alt="Current Avatar" className="current-pin" />
      </div>
      <div className="pin-options">
        <h3>Select an Avatar:</h3>
        <div className="pin-images">
          {availablePins.map((pin) => {
            const unlocked = points >= pin.requiredPoints;
            return (
              <img 
                key={pin.id} 
                src={pin.src} 
                alt={pin.name} 
                className={`pin-image ${currentPin === pin.src ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
                onClick={() => handleSelectPin(pin.src, pin.requiredPoints)}
              />
            );
          })}
        </div>
      </div>
      <div className="unlock-section">
        <p>Points: {points}</p>
      </div>
      <button className="back-button" onClick={handleBack}>Back to Dashboard</button>
    </div>
  );
};

export default SelectPin;
