package kz.smartexam.smartexam.repository;

import kz.smartexam.smartexam.model.Quiz;
import kz.smartexam.smartexam.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByQuizId(Long quizId);

    List<Result> findByStudentId(Long studentId);
}
