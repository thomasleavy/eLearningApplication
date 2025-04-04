// quizrepository.java
package com.example.elearn.repository;

import com.example.elearn.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByCode(String code);
    List<Quiz> findByTeacherId(Long teacherId);
}


