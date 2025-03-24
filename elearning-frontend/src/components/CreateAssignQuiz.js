// src/components/CreateAssignQuiz.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateAssignQuiz.css';
import Footer from './Footer'; 

const CreateAssignQuiz = () => {
  const navigate = useNavigate();
  const teacherId = localStorage.getItem("userId");

  // Form state for creating/editing a quiz:
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState(
    Array.from({ length: 5 }, () => ({
      question: '',
      answers: ['', '', '', ''],
      correctAnswer: 0,
    }))
  );

  // Dropdown state for existing quizzes:
  const [quizList, setQuizList] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("new");

  // Fetch teacher's existing quizzes on mount.
  useEffect(() => {
    if (teacherId) {
      axios.get(`/api/quiz/teacher/${teacherId}`)
        .then(response => {
          setQuizList(response.data);
        })
        .catch(error => {
          console.error("Error fetching quizzes:", error);
        });
    }
  }, [teacherId]);

  const handleQuizTitleChange = (e) => {
    setQuizTitle(e.target.value);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    const newAnswers = [...newQuestions[qIndex].answers];
    newAnswers[aIndex] = value;
    newQuestions[qIndex].answers = newAnswers;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = Number(value) - 1;
    setQuestions(newQuestions);
  };

  // When an existing quiz is selected, prefill the form.
  const handleQuizSelection = (e) => {
    const selectedId = e.target.value;
    setSelectedQuizId(selectedId);
    if (selectedId === "new") {
      // Reset the form for a new quiz.
      setQuizTitle('');
      setQuestions(
        Array.from({ length: 5 }, () => ({
          question: '',
          answers: ['', '', '', ''],
          correctAnswer: 0,
        }))
      );
    } else {
      // Find the selected quiz in the quizList.
      const selectedQuiz = quizList.find(q => String(q.id) === selectedId);
      if (selectedQuiz) {
        setQuizTitle(selectedQuiz.quizTitle);
        if (selectedQuiz.questions) {
          const mappedQuestions = selectedQuiz.questions.map(q => ({
            question: q.question,
            answers: [q.statement1, q.statement2, q.statement3, q.statement4],
            correctAnswer: q.correctAnswer,
          }));
          setQuestions(mappedQuestions);
        }
      }
    }
  };

  const generateQuizCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSave = () => {
    const quizCode = generateQuizCode();
    const quizData = {
      quizTitle: quizTitle,
      createdBy: localStorage.getItem("username") || "teacher@example.com",
      code: quizCode,
      teacherId: teacherId,
      questions: questions.map((q, index) => ({
        questionNumber: index + 1,
        question: q.question,
        statement1: q.answers[0],
        statement2: q.answers[1],
        statement3: q.answers[2],
        statement4: q.answers[3],
        correctAnswer: q.correctAnswer,
      })),
    };

    axios.post('/api/quiz/create', quizData)
      .then(response => navigate('/pincode', { state: { quizCode } }))
      .catch(error => {
        console.error('Error saving quiz:', error);
        alert('Error saving quiz. Check console for details.');
      });
  };

  const handleBack = () => {
    navigate('/teacher-dashboard');
  };

  return (
    <div className="create-assign-quiz">
      <h1>Create/Assign Quiz</h1>
      
      {/* Dropdown to select an existing quiz or choose new */}
      <div className="quiz-dropdown">
        <label>Select Existing Quiz:</label>
        <select value={selectedQuizId} onChange={handleQuizSelection}>
          <option value="new">-- New Quiz --</option>
          {quizList.map(quiz => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.quizTitle} ({quiz.code})
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Quiz Title:</label>
        <input 
          type="text" 
          value={quizTitle} 
          onChange={handleQuizTitleChange} 
          placeholder="Enter quiz title" 
        />
      </div>
      
      {questions.map((q, index) => (
        <div key={index} className="question-section">
          <h3>Question {index + 1}</h3>
          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
          />
          {q.answers.map((answer, aIndex) => (
            <div key={aIndex} className="answer-section">
              <input
                type="text"
                placeholder={`Answer ${aIndex + 1}`}
                value={answer}
                onChange={(e) => handleAnswerChange(index, aIndex, e.target.value)}
              />
            </div>
          ))}
          <div className="correct-answer">
            <label>Correct Answer (1-4):</label>
            <input
              type="number"
              min="1"
              max="4"
              value={q.correctAnswer + 1}
              onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
            />
          </div>
       
        </div>
      ))}
      
      <div className="quiz-buttons">
        <button onClick={handleSave}>Save Quiz</button>
        <button onClick={handleBack}>Back</button>
      </div>
    </div>
  );
};

export default CreateAssignQuiz;
