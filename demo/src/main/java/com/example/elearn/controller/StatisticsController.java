package com.example.elearn.controller;

import com.example.elearn.model.Statistics;
import com.example.elearn.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getStatistics(@PathVariable Long userId) {
        Optional<Statistics> stats = statisticsService.getStatisticsByUserId(userId);
        return stats.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Endpoint to update login statistics on login.
    @PostMapping("/login")
    public ResponseEntity<?> updateLoginStatistics(@RequestBody Statistics statsInput) {
        Statistics updatedStats = statisticsService.createOrUpdateStatistics(
                statsInput.getUserId(), statsInput.getUsername(), LocalDateTime.now());
        return ResponseEntity.ok(updatedStats);
    }
    
    // Endpoint to update logout statistics: accumulates session time.
    @PostMapping("/logout")
    public ResponseEntity<?> updateLogoutStatistics(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Statistics updatedStats = statisticsService.updateLogoutTime(userId);
        if (updatedStats != null) {
            return ResponseEntity.ok(updatedStats);
        }
        return ResponseEntity.notFound().build();
    }
}

