// src/components/Quiz.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PupilHeader from './PupilHeader';
import './Quiz.css';
import Footer from './Footer'; 

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = location.state?.quizData; // may be undefined

  // Always initialize answers unconditionally.
  const [answers, setAnswers] = useState([]);

  // Initialize answers when quizData is available.
  useEffect(() => {
    if (quizData && quizData.questions) {
      setAnswers(Array(quizData.questions.length).fill(null));
    }
  }, [quizData]);

  if (!quizData) {
    return <div>No quiz data found. Please try again.</div>;
  }

  const handleOptionChange = (qIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    // Retrieve the actual pupil's username and userId from localStorage.
    const actualUsername = localStorage.getItem("username") || "unknown";
    const actualUserId = Number(localStorage.getItem("userId")) || 0;

    // Build payload using the actual user ID and username.
    const answerPayloads = quizData.questions.map((q, index) => ({
      userId: actualUserId,
      username: actualUsername,
      quizId: quizData.id,
      questionNumber: q.questionNumber,
      answer: answers[index] !== null ? (answers[index] + 1).toString() : '',
      correct: answers[index] === q.correctAnswer,
      datetime: null,  // Let the backend set the timestamp if null.
    }));

    axios.post('/api/quiz/live', answerPayloads)
      .then(response => {
        alert('Quiz submitted successfully!');
        navigate('/pupil-dashboard');
      })
      .catch(error => {
        console.error('Error submitting quiz:', error);
        alert('Error submitting quiz.');
      });
  };

  return (
    <div className="quiz">
      <PupilHeader />
      <h1>{quizData.quizTitle}</h1>
      {quizData.questions.map((q, qIndex) => (
        <div key={qIndex} className="question-block">
          <h3>{q.question}</h3>
          <ul>
            <li>
              <label>
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value="0"
                  checked={answers[qIndex] === 0}
                  onChange={() => handleOptionChange(qIndex, 0)}
                />
                {q.statement1}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value="1"
                  checked={answers[qIndex] === 1}
                  onChange={() => handleOptionChange(qIndex, 1)}
                />
                {q.statement2}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value="2"
                  checked={answers[qIndex] === 2}
                  onChange={() => handleOptionChange(qIndex, 2)}
                />
                {q.statement3}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value="3"
                  checked={answers[qIndex] === 3}
                  onChange={() => handleOptionChange(qIndex, 3)}
                />
                {q.statement4}
              </label>
            </li>
          </ul>
        </div>
      ))}
      <button className="submit-button" onClick={handleSubmitQuiz}>Submit Quiz</button>

    </div>
  );
};

export default Quiz;



