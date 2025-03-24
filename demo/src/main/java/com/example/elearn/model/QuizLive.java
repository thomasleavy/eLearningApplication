package com.example.elearn.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_live")
public class QuizLive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String username;
    private Long quizId;
    
    // Renamed from questionId to questionNumber for clarity
    private Integer questionNumber;
    
    private String answer;
    private Boolean correct;
    private LocalDateTime datetime;
    
    // New field for submission identifier
    private String submissionId;

    public QuizLive() {}

    public QuizLive(Long userId, String username, Long quizId, Integer questionNumber,
                    String answer, Boolean correct, LocalDateTime datetime, String submissionId) {
        this.userId = userId;
        this.username = username;
        this.quizId = quizId;
        this.questionNumber = questionNumber;
        this.answer = answer;
        this.correct = correct;
        this.datetime = datetime;
        this.submissionId = submissionId;
    }

    // Getters and setters for all fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }
    
    public Integer getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(Integer questionNumber) { this.questionNumber = questionNumber; }
    
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    
    public Boolean getCorrect() { return correct; }
    public void setCorrect(Boolean correct) { this.correct = correct; }
    
    public LocalDateTime getDatetime() { return datetime; }
    public void setDatetime(LocalDateTime datetime) { this.datetime = datetime; }
    
    public String getSubmissionId() { return submissionId; }
    public void setSubmissionId(String submissionId) { this.submissionId = submissionId; }
}
