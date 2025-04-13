//QuizService.java
package com.example.elearn.service;

import com.example.elearn.model.Quiz;
import com.example.elearn.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    public Quiz saveQuiz(Quiz quiz) {
        if (quiz.getCreationDate() == null) {
            quiz.setCreationDate(LocalDateTime.now());
        }
        if (quiz.getQuestions() != null) {
            quiz.getQuestions().forEach(question -> question.setQuiz(quiz));
        }
        return quizRepository.save(quiz);
    }

    public Optional<Quiz> getQuizByCode(String code) {
        return quizRepository.findByCode(code);
    }
    
    public List<Quiz> getQuizzesByTeacherId(Long teacherId) {
        return quizRepository.findByTeacherId(teacherId);
    }
    
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
    
    // method with caching enabled.
    @Cacheable(value = "quizCache", key = "#quizId")
    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId).orElse(null);
    }
}