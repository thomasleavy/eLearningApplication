// src/main/java/com/example/elearn/controller/QuizController.java
package com.example.elearn.controller;

import com.example.elearn.model.Quiz;
import com.example.elearn.model.QuizLive;
import com.example.elearn.service.QuizService;
import com.example.elearn.service.QuizLiveService;
import com.example.elearn.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private QuizLiveService quizLiveService;
    
    @Autowired
    private StatisticsService statisticsService;

    // Endpoint for teacher to create a new quiz
    @PostMapping("/create")
    public ResponseEntity<?> createQuiz(@RequestBody Quiz quiz) {
        if (quiz.getQuestions() != null) {
            quiz.getQuestions().forEach(question -> question.setQuiz(quiz));
        }
        Quiz savedQuiz = quizService.saveQuiz(quiz);
        return ResponseEntity.ok(savedQuiz);
    }

    // Endpoint for pupil to fetch a quiz by code
    @GetMapping("/code/{code}")
    public ResponseEntity<?> getQuizByCode(@PathVariable String code) {
        Optional<Quiz> quiz = quizService.getQuizByCode(code);
        return quiz.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // NEW Endpoint: Fetch quizzes created by a specific teacher
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getQuizzesByTeacher(@PathVariable Long teacherId) {
        List<Quiz> quizzes = quizService.getQuizzesByTeacherId(teacherId);
        return ResponseEntity.ok(quizzes);
    }

    // Endpoint for fetching all quizzes (if needed)
    @GetMapping("/all")
    public ResponseEntity<?> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    // Endpoint for pupil to submit quiz answers (live quiz)
    @PostMapping("/live")
    public ResponseEntity<?> submitQuizLive(@RequestBody List<QuizLive> quizLives) {
        if (quizLives.isEmpty()) {
            return ResponseEntity.badRequest().body("No quiz answers provided.");
        }
        // Generate a unique submission ID for this submission.
        String submissionId = UUID.randomUUID().toString();
        quizLives.forEach(ql -> ql.setSubmissionId(submissionId));
        List<QuizLive> savedResults = quizLiveService.saveAllQuizLives(quizLives);
        
        // Get the userId from the first entry (assuming all belong to the same user).
        Long userId = quizLives.get(0).getUserId();
        
        // Update quizzes completed count and add points.
        statisticsService.incrementQuizzesCompleted(userId);
        int correctCount = (int) quizLives.stream()
                .filter(ql -> Boolean.TRUE.equals(ql.getCorrect()))
                .count();
        statisticsService.addPoints(userId, correctCount);
        
        return ResponseEntity.ok(savedResults);
    }
    
    // NEW Endpoint: Get quiz results in a real-life format.
    // For each pupil, return only the submission with the highest number of correct answers.
    @GetMapping("/results/{quizId}")
    public ResponseEntity<?> getQuizResults(@PathVariable Long quizId) {
        try {
            // Fetch all QuizLive entries for the given quizId.
            List<QuizLive> entries = quizLiveService.getQuizLiveResults(quizId);
            
            // Filter out any entries without a submissionId (i.e. incomplete submissions).
            List<QuizLive> validEntries = entries.stream()
                    .filter(ql -> ql.getSubmissionId() != null)
                    .collect(Collectors.toList());
            
            // Group the valid entries by userId.
            Map<Long, List<QuizLive>> entriesByUser = validEntries.stream()
                    .collect(Collectors.groupingBy(QuizLive::getUserId));
            
            List<Map<String, Object>> results = new ArrayList<>();
            int totalScoreSum = 0;
            int userCount = 0;
            
            // Process each pupil's submissions.
            for (Map.Entry<Long, List<QuizLive>> userEntry : entriesByUser.entrySet()) {
                List<QuizLive> userEntries = userEntry.getValue();
                
                // Group by submissionId.
                Map<String, List<QuizLive>> submissions = userEntries.stream()
                        .collect(Collectors.groupingBy(QuizLive::getSubmissionId));
                
                // Get all submission groups.
                List<List<QuizLive>> submissionGroups = new ArrayList<>(submissions.values());
                
                // Select the best submission: first by highest number of correct answers,
                // then by the latest submission time as a tie-breaker.
                Optional<List<QuizLive>> bestSubmissionOpt = submissionGroups.stream()
                        .max(Comparator.<List<QuizLive>, Integer>comparing(
                                group -> group.stream()
                                              .filter(ql -> Boolean.TRUE.equals(ql.getCorrect()))
                                              .mapToInt(q -> 1)
                                              .sum()
                        ).thenComparing(group ->
                                group.stream()
                                     .filter(ql -> ql.getDatetime() != null)
                                     .map(QuizLive::getDatetime)
                                     .max(LocalDateTime::compareTo)
                                     .orElse(LocalDateTime.MIN)
                        ));
                
                if (bestSubmissionOpt.isPresent()) {
                    List<QuizLive> bestSubmission = bestSubmissionOpt.get();
                    int score = (int) bestSubmission.stream()
                            .filter(ql -> Boolean.TRUE.equals(ql.getCorrect()))
                            .count();
                    
                    Map<String, Object> userResult = new HashMap<>();
                    String username = bestSubmission.get(0).getUsername();
                    userResult.put("username", username);
                    
                    // Build a list for question correctness (assuming 5 questions)
                    List<Boolean> questionResults = new ArrayList<>();
                    for (int i = 1; i <= 5; i++) {
                        final int questionNumber = i;
                        Optional<QuizLive> qlOpt = bestSubmission.stream()
                                .filter(ql -> Objects.equals(ql.getQuestionNumber(), questionNumber))
                                .findFirst();
                        questionResults.add(qlOpt.map(QuizLive::getCorrect).orElse(false));
                    }
                    userResult.put("questionResults", questionResults);
                    userResult.put("totalScore", score);
                    
                    totalScoreSum += score;
                    userCount++;
                    results.add(userResult);
                }
            }
            
            // Build the response even if no results were found.
            Map<String, Object> response = new HashMap<>();
            response.put("results", results);
            response.put("averageScore", userCount > 0 ? ((double) totalScoreSum / userCount) : 0.0);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Internal Server Error: " + e.getMessage());
        }
    }
}



