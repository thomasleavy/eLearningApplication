// src/components/SelectPin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bronzeTrophy from '../assets/bronze_trophy.jpg';
import silverTrophy from '../assets/silver_trophy.jpg';
import goldTrophy from '../assets/gold_trophy.jpg';
import axios from 'axios';
import './SelectPin.css';
import Footer from './Footer'; 

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
        .catch(error => console.error("Error fetching statistics:", error));
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
      alert(`You need at least ${requiredPoints} points to unlock this pin.`);
    }
  };

  const handleUnlockPin = () => {
    alert('Unlock additional PINs functionality coming soon.');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="select-pin">
      <h1>Select/Change PIN</h1>
      <div className="current-pin-container">
        <h2>Your Current PIN</h2>
        <img src={currentPin} alt="Current PIN" className="current-pin" />
      </div>
      <div className="pin-options">
        <h3>Select a PIN:</h3>
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
        <button onClick={handleUnlockPin}>Unlock Additional PINs</button>
      </div>
      <button className="back-button" onClick={handleBack}>Back to Dashboard</button>
   
    </div>
  );
};

export default SelectPin;
