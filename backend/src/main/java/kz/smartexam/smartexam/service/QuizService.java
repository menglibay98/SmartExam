package kz.smartexam.smartexam.service;

import jakarta.transaction.Transactional;
import kz.smartexam.smartexam.dto.*;
import kz.smartexam.smartexam.model.*;
import kz.smartexam.smartexam.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final ResultRepository resultRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizAttemptAnswerRepository quizAttemptAnswerRepository;

    public QuizService(QuizRepository quizRepository,
                       QuestionRepository questionRepository,
                       ResultRepository resultRepository,
                       UserRepository userRepository,
                       QuizAttemptRepository quizAttemptRepository, QuizAttemptAnswerRepository quizAttemptAnswerRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizAttemptAnswerRepository = quizAttemptAnswerRepository;
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElse(null);
    }

    public Quiz createQuiz(CreateQuizRequest request) {
        Quiz quiz = new Quiz();

        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTimeLimit(request.getTimeLimit());

        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }


    @Transactional
    public QuizResultResponse submitQuiz(Long quizId, QuizSubmissionRequest submission) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"
                ));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Quiz not found"
                ));

        QuizAttempt attempt = quizAttemptRepository
                .findActiveAttemptForUpdate(quizId, student.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Quiz already completed or active attempt not found"
                ));

        LocalDateTime now = LocalDateTime.now();

        List<Question> questions = questionRepository.findByQuizId(quizId);

        List<QuizAttemptAnswer> savedAnswers =
                quizAttemptAnswerRepository.findByAttemptId(attempt.getId());

        int correct = 0;

        for (Question question : questions) {
            String correctAnswer = question.getCorrectAnswer();

            if (correctAnswer == null) {
                continue;
            }

            boolean isCorrect = savedAnswers.stream()
                    .anyMatch(answer ->
                            answer.getQuestion().getId().equals(question.getId())
                                    && correctAnswer.equalsIgnoreCase(
                                    answer.getSelectedAnswer()
                            )
                    );

            if (isCorrect) {
                correct++;
            }
        }

        int total = questions.size();

        double percentage = total == 0
                ? 0
                : (correct * 100.0) / total;

        String grade;

        if (percentage >= 90) {
            grade = "A";
        } else if (percentage >= 75) {
            grade = "B";
        } else if (percentage >= 60) {
            grade = "C";
        } else if (percentage >= 50) {
            grade = "D";
        } else {
            grade = "F";
        }

        Result result = new Result();

        result.setStudent(student);
        result.setStudentName(
                student.getName() + " " + student.getSurname()
        );
        result.setTotalQuestions(total);
        result.setCorrectAnswers(correct);
        result.setPercentage(percentage);
        result.setGrade(grade);
        result.setCompletedAt(now);
        result.setQuiz(quiz);

        resultRepository.save(result);

        attempt.setCompleted(true);
        attempt.setSubmittedAt(now);

        quizAttemptRepository.save(attempt);

        return new QuizResultResponse(
                total,
                correct,
                percentage,
                grade
        );
    }


    public void saveAnswer(Long quizId, SaveAnswerRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"
                ));

        QuizAttempt attempt = quizAttemptRepository
                .findFirstByQuizIdAndStudentIdAndCompletedFalseOrderByStartedAtDesc(
                        quizId, student.getId()
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Active quiz attempt not found"
                ));

        if (attempt.getExpiresAt() != null &&
                !LocalDateTime.now().isBefore(attempt.getExpiresAt())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Quiz time has expired"
            );
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Question not found"
                ));

        if (!question.getQuiz().getId().equals(quizId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Question does not belong to this quiz"
            );
        }

        QuizAttemptAnswer savedAnswer = quizAttemptAnswerRepository
                .findByAttemptIdAndQuestionId(attempt.getId(), question.getId())
                .orElseGet(QuizAttemptAnswer::new);

        savedAnswer.setAttempt(attempt);
        savedAnswer.setQuestion(question);
        savedAnswer.setSelectedAnswer(request.getAnswer());

        quizAttemptAnswerRepository.save(savedAnswer);
    }


    public List<SavedAnswerResponse> getSavedAnswers(Long quizId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"
                ));

        QuizAttempt attempt = quizAttemptRepository
                .findFirstByQuizIdAndStudentIdAndCompletedFalseOrderByStartedAtDesc(
                        quizId, student.getId()
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Active quiz attempt not found"
                ));

        List<QuizAttemptAnswer> savedAnswers =
                quizAttemptAnswerRepository.findByAttemptId(attempt.getId());

        return savedAnswers.stream()
                .map(savedAnswer -> new SavedAnswerResponse(
                        savedAnswer.getQuestion().getId(),
                        savedAnswer.getSelectedAnswer()
                ))
                .toList();
    }


}