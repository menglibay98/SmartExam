package kz.smartexam.smartexam.repository;

import kz.smartexam.smartexam.model.Question;
import kz.smartexam.smartexam.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuizId(Long quizId);

}
