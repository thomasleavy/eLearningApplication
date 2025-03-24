package com.example.elearn.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "statistics")
public class Statistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    
    private String username;
    
    private Integer points; // initially 0 or null
    
    // loginTime marks when the current session started (if logged in)
    private LocalDateTime loginTime;
    
    // accumulatedTime (in seconds) is the total duration logged in over all sessions
    private Long accumulatedTime;
    
    private Integer quizzesCompleted;

    public Statistics() {}

    public Statistics(Long userId, String username, Integer points, LocalDateTime loginTime, Long accumulatedTime, Integer quizzesCompleted) {
        this.userId = userId;
        this.username = username;
        this.points = points;
        this.loginTime = loginTime;
        this.accumulatedTime = accumulatedTime;
        this.quizzesCompleted = quizzesCompleted;
    }

    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public LocalDateTime getLoginTime() { return loginTime; }
    public void setLoginTime(LocalDateTime loginTime) { this.loginTime = loginTime; }

    public Long getAccumulatedTime() { return accumulatedTime; }
    public void setAccumulatedTime(Long accumulatedTime) { this.accumulatedTime = accumulatedTime; }

    public Integer getQuizzesCompleted() { return quizzesCompleted; }
    public void setQuizzesCompleted(Integer quizzesCompleted) { this.quizzesCompleted = quizzesCompleted; }
}
