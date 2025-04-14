//SelectAvatar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blueMonster from '../assets/blue_monster.jpg';
import pinkMonster from '../assets/pink_monster.jpg';
import greenMonster from '../assets/green_monster.jpg';
import yellowMonster from '../assets/yellow_monster.jpg';
import vomitMonster from '../assets/vomit_monster.jpg';
import redMonster from '../assets/red_monster.jpg';
import purpleMonster from '../assets/purple_monster.jpg';
import orangeMonster from '../assets/orange_monster.jpg';
import cyanMonster from '../assets/cyan_monster.jpg';
import axios from 'axios';
import './SelectAvatar.css';

const availablePins = [
  { id: 1, name: 'Blue', src: blueMonster, unlockType: 'points', requiredValue: 0 },
  { id: 2, name: 'Pink', src: pinkMonster, unlockType: 'points', requiredValue: 5 },
  { id: 3, name: 'Green', src: greenMonster, unlockType: 'points', requiredValue: 10 },
  { id: 4, name: 'Yellow', src: yellowMonster, unlockType: 'points', requiredValue: 15 },
  { id: 6, name: 'Red', src: redMonster, unlockType: 'points', requiredValue: 20 },
  { id: 8, name: 'Orange', src: orangeMonster, unlockType: 'points', requiredValue: 25 },
  { id: 7, name: 'Purple', src: purpleMonster, unlockType: 'loginTime', requiredValue: 30 },
  { id: 5, name: 'Vomit', src: vomitMonster, unlockType: 'quizzes', requiredValue: 3 },
  { id: 9, name: 'Cyan', src: cyanMonster, unlockType: 'quizzes', requiredValue: 5 }
];

const SelectPin = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const storedPin = userId ? localStorage.getItem(`chosenPin_${userId}`) : null;

  const [currentPin, setCurrentPin] = useState(storedPin || availablePins[0].src);
  const [points, setPoints] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [loginTime, setLoginTime] = useState(0); // in minutes
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userId) {
      axios.get(`/api/statistics/${userId}`)
        .then(response => {
          const data = response.data;
          if (data) {
            if (data.points !== undefined) {
              setPoints(Number(data.points));
            }
            if (data.quizzesCompleted !== undefined) {
              setCompletedQuizzes(Number(data.quizzesCompleted));
            }
            if (data.accumulatedTime !== undefined) {
            
              setLoginTime(Math.floor(Number(data.accumulatedTime) / 60));
            }
          }
        })
        .catch(error => console.error("Error fetching statistics:", error));
    }
  }, [userId]);

  const isUnlocked = (pin) => {
    if (pin.unlockType === 'points') {
      return points >= pin.requiredValue;
    } else if (pin.unlockType === 'quizzes') {
      return completedQuizzes >= pin.requiredValue;
    } else if (pin.unlockType === 'loginTime') {
      return loginTime >= pin.requiredValue;
    }
    return true;
  };

  const getErrorMessage = (pin) => {
    if (pin.unlockType === 'points') {
      return `You need at least ${pin.requiredValue} points to unlock this avatar.`;
    } else if (pin.unlockType === 'quizzes') {
      return `You need to complete at least ${pin.requiredValue} quizzes to unlock this avatar.`;
    } else if (pin.unlockType === 'loginTime') {
      return `You need to be logged in for at least ${pin.requiredValue} minutes to unlock this avatar.`;
    }
    return "";
  };

  const handleSelectPin = (pin) => {
    if (isUnlocked(pin)) {
      setCurrentPin(pin.src);
      setErrorMessage("");
      if (userId) {
        localStorage.setItem(`chosenPin_${userId}`, pin.src);
      } else {
        localStorage.setItem('chosenPin', pin.src);
      }
    } else {
      setErrorMessage(getErrorMessage(pin));
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="select-pin">
  
      <div className="points-container">
        <h2>Points: {points}</h2>
      </div>

      <h1>Select/Change Avatar</h1>
      
      <div className="current-pin-container">
        <h2>Your Current Avatar</h2>
        <img src={currentPin} alt="Current Avatar" className="current-pin" />
      </div>

      <div className="pin-options">
        <h3>Select an Avatar:</h3>
        <div className="pin-images-grid">
          {availablePins.map((pin) => (
            <img 
              key={pin.id} 
              src={pin.src} 
              alt={pin.name} 
              className={`pin-image ${currentPin === pin.src ? 'selected' : ''} ${!isUnlocked(pin) ? 'locked' : ''}`}
              onClick={() => handleSelectPin(pin)}
            />
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      <button className="back-button" onClick={handleBack}>Back to Dashboard</button>
    </div>
  );
};

export default SelectPin;

