// src/main/java/com/example/elearn/controller/UserController.java
package com.example.elearn.controller;

import com.example.elearn.model.User;
import com.example.elearn.repository.UserRepository;
import com.example.elearn.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    // Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
    
    // New endpoint: Update pupil's teacher association.
    // Updated mapping to avoid conflict with PupilController.
    @PutMapping("/users/pupils/{pupilId}/teacher")
    public ResponseEntity<?> updateTeacherForPupil(@PathVariable Long pupilId,
                                                   @RequestBody Map<String, String> payload) {
        String teacherUsername = payload.get("teacherUsername");
        if (teacherUsername == null || teacherUsername.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("teacherUsername is required");
        }
        Optional<User> pupilOpt = userRepository.findById(pupilId);
        if (pupilOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pupil not found");
        }
        User pupil = pupilOpt.get();
        Optional<User> teacherOpt = userRepository.findByUsername(teacherUsername);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher not found");
        }
        User teacher = teacherOpt.get();
        pupil.setTeacherId(teacher.getId());
        userRepository.save(pupil);
        return ResponseEntity.ok(Map.of("teacherId", teacher.getId()));
    }
}




