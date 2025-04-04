//QuizController.java
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

    //This endpoint is for teachers to make a new quiz
    @PostMapping("/create")
    public ResponseEntity<?> createQuiz(@RequestBody Quiz quiz) {
        if (quiz.getQuestions() != null) {
            quiz.getQuestions().forEach(question -> question.setQuiz(quiz));
        }
        Quiz savedQuiz = quizService.saveQuiz(quiz);
        return ResponseEntity.ok(savedQuiz);
    }

    //this endpoint is for pupils to get a quiz by an automaticlaly created code
    @GetMapping("/code/{code}")
    public ResponseEntity<?> getQuizByCode(@PathVariable String code) {
        Optional<Quiz> quiz = quizService.getQuizByCode(code);
        return quiz.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //this endpoint is used to fetch quizzes made by a particular teacher
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getQuizzesByTeacher(@PathVariable Long teacherId) {
        List<Quiz> quizzes = quizService.getQuizzesByTeacherId(teacherId);
        return ResponseEntity.ok(quizzes);
    }

    //this endpoint fetches all quizzes
    @GetMapping("/all")
    public ResponseEntity<?> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    //This endpoint is for pupils to submit their answers
    @PostMapping("/live")
    public ResponseEntity<?> submitQuizLive(@RequestBody List<QuizLive> quizLives) {
        if (quizLives.isEmpty()) {
            return ResponseEntity.badRequest().body("No quiz answers given.");
        }
        String submissionId = UUID.randomUUID().toString();
        quizLives.forEach(ql -> ql.setSubmissionId(submissionId));
        List<QuizLive> savedResults = quizLiveService.saveAllQuizLives(quizLives);
        Long userId = quizLives.get(0).getUserId();
        statisticsService.incrementQuizzesCompleted(userId);
        int correctCount = (int) quizLives.stream()
                .filter(ql -> Boolean.TRUE.equals(ql.getCorrect()))
                .count();
        statisticsService.addPoints(userId, correctCount);
        return ResponseEntity.ok(savedResults);
    }
    
    // This endpoint is used to get quiz results & it returns each of the pupils' best result
    @GetMapping("/results/{quizId}")
    public ResponseEntity<?> getQuizResults(@PathVariable Long quizId) {
        try {
            List<QuizLive> entries = quizLiveService.getQuizLiveResults(quizId);
            List<QuizLive> validEntries = entries.stream()
                    .filter(ql -> ql.getSubmissionId() != null)
                    .collect(Collectors.toList());
            Map<Long, List<QuizLive>> entriesByUser = validEntries.stream()
                    .collect(Collectors.groupingBy(QuizLive::getUserId));
            List<Map<String, Object>> results = new ArrayList<>();
            int totalScoreSum = 0;
            int userCount = 0;
            
            for (Map.Entry<Long, List<QuizLive>> userEntry : entriesByUser.entrySet()) {
                List<QuizLive> userEntries = userEntry.getValue();
                Map<String, List<QuizLive>> submissions = userEntries.stream()
                        .collect(Collectors.groupingBy(QuizLive::getSubmissionId));
                List<List<QuizLive>> submissionGroups = new ArrayList<>(submissions.values());
                
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
            
            Map<String, Object> response = new HashMap<>();
            response.put("results", results);
            response.put("averageScore", userCount > 0 ? ((double) totalScoreSum / userCount) : 0.0);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("There was an internal server error: " + e.getMessage());
        }
    }
}




