//StatisticsService.java
package com.example.elearn.service;

import com.example.elearn.model.Statistics;
import com.example.elearn.repository.StatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class StatisticsService {

    @Autowired
    private StatisticsRepository statisticsRepository;

    // Create / update  statistics record when pupil logs in
    public Statistics createOrUpdateStatistics(Long userId, String username, LocalDateTime loginTime) {
        Optional<Statistics> opt = statisticsRepository.findByUserId(userId);
        Statistics stats;
        if (opt.isPresent()) {
            stats = opt.get();
            stats.setLoginTime(loginTime);
            stats.setUsername(username);
        } else {
            stats = new Statistics(userId, username, 0, loginTime, 0L, 0);
        }
        return statisticsRepository.save(stats);
    }

    // Fetch statistics for user.
    public Optional<Statistics> getStatisticsByUserId(Long userId) {
        return statisticsRepository.findByUserId(userId);
    }

    // increase quizzesCompleted count.
    public Statistics incrementQuizzesCompleted(Long userId) {
        Optional<Statistics> opt = statisticsRepository.findByUserId(userId);
        Statistics stats;
        if (opt.isPresent()) {
            stats = opt.get();
            stats.setQuizzesCompleted(stats.getQuizzesCompleted() + 1);
        } else {
            stats = new Statistics(userId, "", 0, LocalDateTime.now(), 0L, 1);
        }
        return statisticsRepository.save(stats);
    }
    
    // update logout time
    public Statistics updateLogoutTime(Long userId) {
        Optional<Statistics> opt = statisticsRepository.findByUserId(userId);
        if (opt.isPresent()) {
            Statistics stats = opt.get();
            if (stats.getLoginTime() != null) {
                long sessionDuration = Duration.between(stats.getLoginTime(), LocalDateTime.now()).getSeconds();
                long accumulated = (stats.getAccumulatedTime() != null) ? stats.getAccumulatedTime() : 0;
                stats.setAccumulatedTime(accumulated + sessionDuration);
                stats.setLoginTime(null);
            }
            return statisticsRepository.save(stats);
        }
        return null;
    }
    
    // add points (i.e. 1 point for each answewr that os correct)
    public Statistics addPoints(Long userId, int pointsToAdd) {
        Optional<Statistics> opt = statisticsRepository.findByUserId(userId);
        Statistics stats;
        //conditional statememt
        if (opt.isPresent()) {
            stats = opt.get();
            int currentPoints = (stats.getPoints() != null) ? stats.getPoints() : 0;
            stats.setPoints(currentPoints + pointsToAdd);
        } else {
            // If no record is there, make one with the points
            stats = new Statistics(userId, "", pointsToAdd, LocalDateTime.now(), 0L, 0);
        }
        return statisticsRepository.save(stats);
    }
}



