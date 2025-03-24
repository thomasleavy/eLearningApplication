// src/main/java/com/example/elearn/repository/QuizLiveRepository.java
package com.example.elearn.repository;

import com.example.elearn.model.QuizLive;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizLiveRepository extends JpaRepository<QuizLive, Long> {
    List<QuizLive> findByQuizId(Long quizId);
}

