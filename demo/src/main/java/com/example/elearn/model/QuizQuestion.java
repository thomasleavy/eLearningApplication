package com.example.elearn.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "quiz_question")
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Unique id for each question

    private Integer questionNumber;  // e.g., 1, 2, 3, 4, 5

    @Column(columnDefinition = "TEXT")
    private String question;

    @Column(columnDefinition = "TEXT")
    private String statement1;
    @Column(columnDefinition = "TEXT")
    private String statement2;
    @Column(columnDefinition = "TEXT")
    private String statement3;
    @Column(columnDefinition = "TEXT")
    private String statement4;

    private Integer correctAnswer;  // Index (0-3)

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    // Default constructor
    public QuizQuestion() {}

    // Constructor with parameters
    public QuizQuestion(Integer questionNumber, String question, String statement1, String statement2,
                        String statement3, String statement4, Integer correctAnswer) {
        this.questionNumber = questionNumber;
        this.question = question;
        this.statement1 = statement1;
        this.statement2 = statement2;
        this.statement3 = statement3;
        this.statement4 = statement4;
        this.correctAnswer = correctAnswer;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Integer getQuestionNumber() {
        return questionNumber;
    }
    public void setQuestionNumber(Integer questionNumber) {
        this.questionNumber = questionNumber;
    }
    public String getQuestion() {
        return question;
    }
    public void setQuestion(String question) {
        this.question = question;
    }
    public String getStatement1() {
        return statement1;
    }
    public void setStatement1(String statement1) {
        this.statement1 = statement1;
    }
    public String getStatement2() {
        return statement2;
    }
    public void setStatement2(String statement2) {
        this.statement2 = statement2;
    }
    public String getStatement3() {
        return statement3;
    }
    public void setStatement3(String statement3) {
        this.statement3 = statement3;
    }
    public String getStatement4() {
        return statement4;
    }
    public void setStatement4(String statement4) {
        this.statement4 = statement4;
    }
    public Integer getCorrectAnswer() {
        return correctAnswer;
    }
    public void setCorrectAnswer(Integer correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
    public Quiz getQuiz() {
        return quiz;
    }
    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
}


