//BeginQuiz.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PupilHeader from './PupilHeader';
import './BeginQuiz.css';

const BeginQuiz = () => {
  const navigate = useNavigate();
  const [quizCode, setQuizCode] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    if (teacherId) {
      axios.get(`/api/quiz/teacher/${teacherId}`)
        .then(response => {
          console.log("Fetched quiz list for teacher:", response.data);
          setQuizList(response.data);
        })
        .catch(error => {
          console.error('there was an error when fetching quiz list for teacher:', error);
          setQuizList([]);
        });
    } else {
      console.warn("No teacherId found in localStorage.");
      setQuizList([]);
    }
  }, [teacherId]);

  const handleQuizCodeChange = (e) => {
    setQuizCode(e.target.value);
    setErrorMessage("");
  };

  const handleDropdownChange = (e) => {
    setQuizCode(e.target.value);
    setErrorMessage("");
  };

  const handleFetchQuiz = () => {
    if (!quizCode) {
      setErrorMessage('Please choose/enter a quiz code.');
      return;
    }
    axios.get(`/api/quiz/code/${quizCode}`)
      .then(response => {
        setErrorMessage("");
        navigate('/quiz', { state: { quizData: response.data } });
      })
      .catch(error => {
        console.error('there was an error fetching quiz:', error);
        setErrorMessage('The quiz was not found. Please check your code and try again!');
      });
  };

  return (
    <div className="begin-quiz">
      <PupilHeader />
      <h1>Enter Quiz Code</h1>
      <input 
        type="text" 
        placeholder="Enter quiz code" 
        value={quizCode} 
        onChange={handleQuizCodeChange} 
      />
      <h3>Or select a quiz from the list:</h3>
      <select value={quizCode} onChange={handleDropdownChange}>
        <option value="">-- Select Quiz Code --</option>
        {quizList && quizList.length > 0 ? (
          quizList.map((quiz) => (
            <option key={quiz.id} value={quiz.code}>
              {quiz.quizTitle} ({quiz.code})
            </option>
          ))
        ) : (
          <option value="" disabled>No quizzes available</option>
        )}
      </select>
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      <div className="quiz-buttons">
        <button onClick={handleFetchQuiz}>Begin Quiz</button>
        <button onClick={() => navigate('/pupil-dashboard')}>Back to Dashboard</button>
      </div>
     
    </div>

  );
};

export default BeginQuiz;
