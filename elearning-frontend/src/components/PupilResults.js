// PupilResults.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PupilResults.css';


const PupilResults = () => {
  const navigate = useNavigate();
  const [quizList, setQuizList] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [resultsData, setResultsData] = useState(null);

  // Use teacher's userId as teacherId
  const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    if (teacherId) {
      fetch(`/api/quiz/teacher/${teacherId}`)
        .then(response => response.json())
        .then(data => setQuizList(data))
        .catch(error => console.error("there was an error fetching the quiz list:", error));
    } else {
      setQuizList([]);
    }
  }, [teacherId]);

  const handleQuizSelection = (e) => {
    setSelectedQuizId(e.target.value);
    setResultsData(null);
  };

  const handleViewResults = () => {
    if (!selectedQuizId) {
      alert("Please choose a quiz.");
      return;
    }
    fetch(`/api/quiz/results/${selectedQuizId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("No results found!!!");
        }
        return response.json();
      })
      .then(data => setResultsData(data))
      .catch(error => {
        console.error("there was an error fetching the quiz results:", error);
        alert("there was an error fetching quiz results");
      });
      
  };

  const renderTable = () => {
    if (!resultsData) return null;
    return (
      <div className="results-table-container">
        <table>
          <thead>
            <tr>
              <th>Pupil Username</th>
              <th>Question 1</th>
              <th>Question 2</th>
              <th>Question 3</th>
              <th>Question 4</th>
              <th>Question 5</th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {resultsData.results.map((result, index) => (
              <tr key={index}>
                <td>{result.username}</td>
                {result.questionResults.map((correct, idx) => (
                  <td key={idx}>
                    {correct ? <span className="correct">✔</span> : <span className="incorrect">✖</span>}
                  </td>
                ))}
                <td>{result.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="average-score">
          <p>Average Score: {resultsData.averageScore} / 5</p>
        </div>
      </div>
    );
  };

  const handleBack = () => {
    navigate('/teacher-dashboard');
  };

  return (
    <div className="pupil-results">
      <h1>Pupil Results</h1>
      <div className="quiz-selection">
        <label>Select Quiz:</label>
        <select value={selectedQuizId} onChange={handleQuizSelection}>
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
        <button onClick={handleViewResults}>View Results</button>
      </div>
      {renderTable()}
      <button className="back-button" onClick={handleBack}>Back to Teacher Dashboard</button>
   
    </div>
  );
};

export default PupilResults;
