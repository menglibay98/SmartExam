package kz.smartexam.smartexam.service;

import kz.smartexam.smartexam.dto.DashboardResponse;
import kz.smartexam.smartexam.dto.RecentResultResponse;
import kz.smartexam.smartexam.model.Result;
import kz.smartexam.smartexam.model.Role;
import kz.smartexam.smartexam.repository.QuizRepository;
import kz.smartexam.smartexam.repository.ResultRepository;
import kz.smartexam.smartexam.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final ResultRepository resultRepository;


    public DashboardService(UserRepository userRepository, QuizRepository quizRepository, ResultRepository resultRepository) {
        this.userRepository = userRepository;
        this.quizRepository = quizRepository;
        this.resultRepository = resultRepository;
    }

    public DashboardResponse getTeacherDashboard() {
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalQuizzes = quizRepository.count();
        long totalAttempts = resultRepository.count();

        List<Result> results = resultRepository.findAll();


        double averageScore = results.stream()
                .filter(result -> result.getPercentage() != null)
                .mapToDouble(Result::getPercentage)
                .average()
                .orElse(0.0);

        List<RecentResultResponse> recentResults = results.stream()
                .filter(result -> result.getCompletedAt() != null)
                .sorted((r1, r2) ->
                        r2.getCompletedAt().compareTo(r1.getCompletedAt()))
                .limit(5)
                .map(result -> new RecentResultResponse(
                        result.getStudentName(),
                        result.getQuiz().getTitle(),
                        result.getPercentage(),
                        result.getGrade(),
                        result.getCompletedAt()
                ))
                .toList();

        return new DashboardResponse(
                totalStudents,
                totalQuizzes,
                totalAttempts,
                averageScore,
                recentResults
        );
    }
}
