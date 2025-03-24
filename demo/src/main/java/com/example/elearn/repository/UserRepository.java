// src/main/java/com/example/elearn/repository/UserRepository.java
package com.example.elearn.repository;

import com.example.elearn.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    // New: Find user by username (for teacher lookup)
    Optional<User> findByUsername(String username);
    
    // Find all pupils associated with a given teacherId.
    List<User> findByTeacherId(Long teacherId);
}



