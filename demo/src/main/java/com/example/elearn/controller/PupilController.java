//PupilController.java
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

    //This is the endpoint to fetch the pupil users registered to a specific teacher
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getPupilsByTeacher(@PathVariable Long teacherId) {
        List<User> pupils = userRepository.findByTeacherId(teacherId);
        return ResponseEntity.ok(pupils);
    }

    //this endpoint disconnects a pupil from their asspcoated teacher
    @PutMapping("/{pupilId}/disconnect")
    public ResponseEntity<?> disconnectPupil(@PathVariable Long pupilId) {
        Optional<User> pupilOpt = userRepository.findById(pupilId);
        if (pupilOpt.isPresent()) {
            User pupil = pupilOpt.get();
            pupil.setTeacherId(null);
            userRepository.save(pupil);
            return ResponseEntity.ok("Pupil was disconnected");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // this endpoint updates the teacher for a pupil using the username of the teacher
    @PutMapping("/{pupilId}/teacher")
    public ResponseEntity<?> updateTeacherForPupil(@PathVariable Long pupilId, @RequestBody UpdateTeacherRequest request) {
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

    // This is a DTO class for updating a teacher
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
