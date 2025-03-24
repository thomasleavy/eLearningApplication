// src/main/java/com/example/elearn/service/QuizLiveService.java
package com.example.elearn.service;

import com.example.elearn.model.QuizLive;
import com.example.elearn.repository.QuizLiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizLiveService {

    @Autowired
    private QuizLiveRepository quizLiveRepository;

    public List<QuizLive> saveAllQuizLives(List<QuizLive> quizLives) {
        quizLives.forEach(ql -> {
            if (ql.getDatetime() == null) {
                ql.setDatetime(LocalDateTime.now());
            }
        });
        return quizLiveRepository.saveAll(quizLives);
    }

    public List<QuizLive> getQuizLiveResults(Long quizId) {
        return quizLiveRepository.findByQuizId(quizId);
    }
}
