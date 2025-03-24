// src/main/java/com/example/elearn/service/UserService.java
package com.example.elearn.service;

import com.example.elearn.model.User;
import com.example.elearn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    // Create a PasswordEncoder instance using BCrypt.
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register a new user. The password is hashed before saving.
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Login a user by checking if the raw password matches the hashed password.
    public User loginUser(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .orElse(null);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Find a teacher by username (only consider users with role "teacher")
    public User findTeacherByUsername(String username) {
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
                .filter(u -> "teacher".equalsIgnoreCase(u.getRole()) && u.getUsername().equals(username))
                .findFirst()
                .orElse(null);
    }
}

