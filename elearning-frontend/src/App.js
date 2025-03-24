// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import TeacherDashboard from './components/TeacherDashboard';
import SelectPin from './components/SelectPin';
import PupilResults from './components/PupilResults';
import PupilDashboard from './components/PupilDashboard';
import MyStatistics from './components/MyStatistics';
import CreateAssignQuiz from './components/CreateAssignQuiz';
import BeginQuiz from './components/BeginQuiz';
import Quiz from './components/Quiz';
import PinCode from './components/PinCode';
import ManagePupils from './components/ManagePupils';
import ChangeTeacher from './components/ChangeTeacher';
import MyResults from './components/MyResults';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="content">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/selectpin" element={<SelectPin />} />
            <Route path="/pupilresults" element={<PupilResults />} />
            <Route path="/pupil-dashboard" element={<PupilDashboard />} />
            <Route path="/mystatistics" element={<MyStatistics />} />
            <Route path="/createassignquiz" element={<CreateAssignQuiz />} />
            <Route path="/pincode" element={<PinCode />} />
            <Route path="/beginquiz" element={<BeginQuiz />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/managepupils" element={<ManagePupils />} />
            <Route path="/changeteacher" element={<ChangeTeacher />} />
            <Route path="/myresults" element={<MyResults />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


