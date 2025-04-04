//statisticsrepository.java

package com.example.elearn.repository;

import com.example.elearn.model.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StatisticsRepository extends JpaRepository<Statistics, Long> {
    Optional<Statistics> findByUserId(Long userId);
}
