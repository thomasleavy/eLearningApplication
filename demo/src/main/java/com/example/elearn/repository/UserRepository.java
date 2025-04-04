// UserRepository.java
package com.example.elearn.repository;

import com.example.elearn.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    // Find user (i.e. pupil for exmaple) by username
    Optional<User> findByUsername(String username);
    
    // Find pupils associated w/ a particular teacher
    List<User> findByTeacherId(Long teacherId);
}



