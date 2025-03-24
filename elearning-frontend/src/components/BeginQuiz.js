// src/components/BeginQuiz.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PupilHeader from './PupilHeader';
import './BeginQuiz.css';
import Footer from './Footer'; 

const BeginQuiz = () => {
  const navigate = useNavigate();
  const [quizCode, setQuizCode] = useState('');
  const [quizList, setQuizList] = useState([]);

  // Retrieve teacherId from localStorage (set during pupil login or change teacher)
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    if (teacherId) {
      axios.get(`/api/quiz/teacher/${teacherId}`)
        .then(response => {
          console.log("Fetched quiz list for teacher:", response.data);
          setQuizList(response.data);
        })
        .catch(error => {
          console.error('Error fetching quiz list for teacher:', error);
          setQuizList([]);
        });
    } else {
      console.warn("No teacherId found in localStorage; not fetching teacher-specific quizzes.");
      setQuizList([]);
    }
  }, [teacherId]);

  const handleQuizCodeChange = (e) => {
    setQuizCode(e.target.value);
  };

  const handleDropdownChange = (e) => {
    setQuizCode(e.target.value);
  };

  const handleFetchQuiz = () => {
    if (!quizCode) {
      alert('Please select or enter a quiz code.');
      return;
    }
    axios.get(`/api/quiz/code/${quizCode}`)
      .then(response => navigate('/quiz', { state: { quizData: response.data } }))
      .catch(error => {
        console.error('Error fetching quiz:', error);
        alert('Quiz not found. Please check your code.');
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
      <div className="quiz-buttons">
        <button onClick={handleFetchQuiz}>Begin Quiz</button>
        <button onClick={() => navigate('/pupil-dashboard')}>Back to Dashboard</button>
      </div>
    
    </div>
  );
};

export default BeginQuiz;

