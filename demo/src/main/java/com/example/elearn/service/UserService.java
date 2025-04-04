//UserService.java
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
    
    // PasswordEncoder instance w/ BCrypt.
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    //register new user and password is hashed prior to being saved
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

  //loginUser
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

    // Find a teacher by username
    public User findTeacherByUsername(String username) {
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
                .filter(u -> "teacher".equalsIgnoreCase(u.getRole()) && u.getUsername().equals(username))
                .findFirst()
                .orElse(null);
    }
}

