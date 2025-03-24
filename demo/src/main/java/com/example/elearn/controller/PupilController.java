// src/main/java/com/example/elearn/controller/PupilController.java
package com.example.elearn.controller;

import com.example.elearn.model.User;
import com.example.elearn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pupils")
public class PupilController {

    @Autowired
    private UserRepository userRepository;

    // Endpoint to fetch all pupil users registered to a given teacher
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getPupilsByTeacher(@PathVariable Long teacherId) {
        List<User> pupils = userRepository.findByTeacherId(teacherId);
        return ResponseEntity.ok(pupils);
    }

    // New endpoint: Disconnect a pupil from their teacher (clear teacherId)
    @PutMapping("/{pupilId}/disconnect")
    public ResponseEntity<?> disconnectPupil(@PathVariable Long pupilId) {
        Optional<User> pupilOpt = userRepository.findById(pupilId);
        if (pupilOpt.isPresent()) {
            User pupil = pupilOpt.get();
            pupil.setTeacherId(null);
            userRepository.save(pupil);
            return ResponseEntity.ok("Pupil disconnected successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // New endpoint: Update the teacher for a pupil using teacher's username
    @PutMapping("/{pupilId}/teacher")
    public ResponseEntity<?> updateTeacherForPupil(@PathVariable Long pupilId, @RequestBody UpdateTeacherRequest request) {
        // Find teacher by username and role "teacher"
        Optional<User> teacherOpt = userRepository.findAll().stream()
                .filter(u -> "teacher".equalsIgnoreCase(u.getRole()) && u.getUsername().equals(request.getTeacherUsername()))
                .findFirst();
        if (!teacherOpt.isPresent()) {
            return ResponseEntity.status(404).body("Teacher not found");
        }
        User teacher = teacherOpt.get();
        
        Optional<User> pupilOpt = userRepository.findById(pupilId);
        if (!pupilOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        User pupil = pupilOpt.get();
        pupil.setTeacherId(teacher.getId());
        userRepository.save(pupil);
        return ResponseEntity.ok(pupil);
    }

    // DTO class for updating teacher (you can also create a separate file if desired)
    public static class UpdateTeacherRequest {
        private String teacherUsername;

        public String getTeacherUsername() {
            return teacherUsername;
        }

        public void setTeacherUsername(String teacherUsername) {
            this.teacherUsername = teacherUsername;
        }
    }
}
