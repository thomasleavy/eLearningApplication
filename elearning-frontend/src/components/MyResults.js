// src/components/MyResults.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PupilHeader from './PupilHeader';
import './MyResults.css';

const MyResults = () => {
  const navigate = useNavigate();
  const [quizList, setQuizList] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [resultData, setResultData] = useState(null);

  const teacherId = localStorage.getItem("teacherId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (teacherId) {
      fetch(`/api/quiz/teacher/${teacherId}`)
        .then(response => response.json())
        .then(data => setQuizList(data))
        .catch(error => console.error("Error fetching quiz list:", error));
    } else {
      setQuizList([]);
    }
  }, [teacherId]);

  const handleQuizSelection = (e) => {
    setSelectedQuizId(e.target.value);
    setResultData(null);
  };

  const handleViewResults = () => {
    if (!selectedQuizId) {
      alert("Please select a quiz.");
      return;
    }
    fetch(`/api/quiz/results/${selectedQuizId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("No results found");
        }
        return response.json();
      })
      .then(data => {
        // Filter to only show the current pupil's result
        const myResult = data.results.find(result => result.username === username);
        if (myResult) {
          setResultData(myResult);
        } else {
          alert("No results found for your account for this quiz.");
        }
      })
      .catch(error => {
        console.error("Error fetching your quiz results:", error);
        alert("Error fetching your quiz results.");
      });
  };

  const handleBack = () => {
    navigate('/pupil-dashboard');
  };

  const renderResult = () => {
    if (!resultData) return null;
    return (
      <div className="results-display">
        <h2>Your Quiz Result</h2>
        <div className="result-details">
          <p><strong>Username:</strong> {resultData.username}</p>
          <div className="questions-results">
            {resultData.questionResults.map((correct, idx) => (
              <div key={idx} className="question-result">
                <span>Q{idx + 1}:</span>
                {correct ? (
                  <span className="icon-correct">✔</span>
                ) : (
                  <span className="icon-incorrect">✖</span>
                )}
              </div>
            ))}
          </div>
          <p><strong>Total Score:</strong> {resultData.totalScore}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="my-results">
      <PupilHeader />
      <h1>My Results</h1>
      <div className="quiz-selection">
        <label htmlFor="quizSelect">Select Quiz:</label>
        <select id="quizSelect" value={selectedQuizId} onChange={handleQuizSelection}>
          <option value="">-- Select Quiz --</option>
          {quizList && quizList.length > 0 ? (
            quizList.map(quiz => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.quizTitle} ({quiz.code})
              </option>
            ))
          ) : (
            <option value="" disabled>No quizzes available</option>
          )}
        </select>
        <button className="view-results-button" onClick={handleViewResults}>View My Results</button>
      </div>
      {renderResult()}
      <button className="back-button" onClick={handleBack}>Back to Dashboard</button>
    </div>
  );
};

export default MyResults;
