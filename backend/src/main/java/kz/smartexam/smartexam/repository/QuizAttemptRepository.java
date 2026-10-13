package kz.smartexam.smartexam.repository;

import jakarta.persistence.LockModeType;
import kz.smartexam.smartexam.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    Optional<QuizAttempt>
    findFirstByQuizIdAndStudentIdAndCompletedFalseOrderByStartedAtDesc(
            Long quizId,
            Long studentId
    );

    boolean existsByQuizIdAndStudentIdAndCompletedTrue(
            Long quizId,
            Long studentId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT a FROM QuizAttempt a
    WHERE a.quiz.id = :quizId
    AND a.student.id = :studentId
    AND a.completed = false
    ORDER BY a.startedAt DESC
    """)
    Optional<QuizAttempt> findActiveAttemptForUpdate(
            @Param("quizId") Long quizId,
            @Param("studentId") Long studentId
    );
}
