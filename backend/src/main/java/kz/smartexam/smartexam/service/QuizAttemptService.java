package kz.smartexam.smartexam.service;

import kz.smartexam.smartexam.dto.QuizAttemptResponse;
import kz.smartexam.smartexam.model.Quiz;
import kz.smartexam.smartexam.model.QuizAttempt;
import kz.smartexam.smartexam.model.User;
import kz.smartexam.smartexam.repository.QuizAttemptRepository;
import kz.smartexam.smartexam.repository.QuizRepository;
import kz.smartexam.smartexam.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class QuizAttemptService {

    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;


    public QuizAttemptService(QuizAttemptRepository quizAttemptRepository, QuizRepository quizRepository, UserRepository userRepository) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
    }

    public QuizAttemptResponse startQuiz(Long quizId) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        boolean alreadyCompleted = quizAttemptRepository
                .existsByQuizIdAndStudentIdAndCompletedTrue(
                        quizId,
                        student.getId()
                );

        if (alreadyCompleted) {
            throw new RuntimeException("You have already completed this quiz");
        }

        QuizAttempt attempt = quizAttemptRepository
                .findFirstByQuizIdAndStudentIdAndCompletedFalseOrderByStartedAtDesc(
                        quizId,
                        student.getId()
                )
                .orElse(null);

        if (attempt != null) {
            return new QuizAttemptResponse(
                    attempt.getId(),
                    attempt.getStartedAt(),
                    attempt.getExpiresAt(),
                    attempt.isCompleted()
            );
        }

        LocalDateTime startedAt = LocalDateTime.now();
        LocalDateTime expiresAt = null;

        if (quiz.getTimeLimit() != null &&
                quiz.getTimeLimit() > 0) {
            expiresAt = startedAt.plusMinutes(
                    quiz.getTimeLimit()
            );
        }

        QuizAttempt newAttempt = new QuizAttempt();

        newAttempt.setQuiz(quiz);
        newAttempt.setStudent(student);
        newAttempt.setStartedAt(startedAt);
        newAttempt.setExpiresAt(expiresAt);
        newAttempt.setCompleted(false);
        newAttempt.setSubmittedAt(null);

        QuizAttempt savedAttempt =
                quizAttemptRepository.save(newAttempt);

        return new QuizAttemptResponse(
                savedAttempt.getId(),
                savedAttempt.getStartedAt(),
                savedAttempt.getExpiresAt(),
                savedAttempt.isCompleted()
        );
    }
}
