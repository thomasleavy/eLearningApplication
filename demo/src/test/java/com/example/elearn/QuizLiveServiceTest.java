//quizliveservicetest.java

package com.example.elearn;

//import statements 
import com.example.elearn.model.QuizLive;
import com.example.elearn.repository.QuizLiveRepository;
import com.example.elearn.service.QuizLiveService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

public class QuizLiveServiceTest {

    @Mock
    private QuizLiveRepository quizLiveRepository;

    @InjectMocks
    private QuizLiveService quizLiveService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    
    }


    @Test
    public void testSaveAllQuizLives_SetsDatetimeIfNull() {
        // arrange: create a list with two Quizlive objects
        List<QuizLive> quizLives = new ArrayList<>();
        QuizLive q1 = new QuizLive();
        q1.setDatetime(null);
          QuizLive q2 = new QuizLive();
          q2.setDatetime(LocalDateTime.now());
          quizLives.add(q1);
              quizLives.add(q2);
              
        
        // when saveAll is called  , return same list .
              when(quizLiveRepository.saveAll(anyList())).thenReturn(quizLives);

        // call service method
        List<QuizLive> savedResults = quizLiveService.saveAllQuizLives(quizLives);

        //verify  any null datetime  set and non-null stays unchanged.
        assertNotNull(savedResults.get(0).getDatetime(), "Datetime set for quizLive with a null datetime");
        assertNotNull(savedResults.get(1).getDatetime(), "Datetime remains set if already given");
       
        verify(quizLiveRepository, times(1)).saveAll(anyList());
    }

    @Test
    public void testGetQuizLiveResults() {

        Long quizId = 1L;
        List<QuizLive> dummyResults = new ArrayList<>();
        QuizLive q = new QuizLive();

        dummyResults.add(q);

        when(quizLiveRepository.findByQuizId(quizId)).thenReturn(dummyResults);

       
        List<QuizLive> results = quizLiveService.getQuizLiveResults(quizId);
        assertEquals(dummyResults.size(), results.size(), "Number of results should match dummy data");
        verify(quizLiveRepository, times(1)).findByQuizId(quizId);
  
    }
}
