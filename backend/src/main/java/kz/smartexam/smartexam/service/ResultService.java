package kz.smartexam.smartexam.service;

import kz.smartexam.smartexam.dto.StudentResultResponse;
import kz.smartexam.smartexam.model.Result;
import kz.smartexam.smartexam.model.User;
import kz.smartexam.smartexam.repository.ResultRepository;
import kz.smartexam.smartexam.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final UserRepository userRepository;

    public ResultService(ResultRepository resultRepository, UserRepository userRepository){
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
    }

    public List<Result> getAllResults(){
        return resultRepository.findAll();
    }

    public List<Result> getResultsByQuiz(Long quizId) {
        return resultRepository.findByQuizId(quizId);
    }

    public List<StudentResultResponse> getMyResults(){
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User student = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return resultRepository
                .findByStudentId(student.getId())
                .stream()
                .map(result ->
                        new StudentResultResponse(
                                result.getId(),
                                result.getQuiz().getTitle(),
                                result.getTotalQuestions(),
                                result.getCorrectAnswers(),
                                result.getPercentage(),
                                result.getGrade(),
                                result.getCompletedAt()
                        )
                )
                .toList();
    }
}
