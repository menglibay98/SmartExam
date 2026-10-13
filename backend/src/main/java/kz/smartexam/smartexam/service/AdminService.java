package kz.smartexam.smartexam.service;

import kz.smartexam.smartexam.dto.AdminDashboardResponse;
import kz.smartexam.smartexam.dto.CreateTeacherRequest;
import kz.smartexam.smartexam.dto.TeacherResponse;
import kz.smartexam.smartexam.model.Role;
import kz.smartexam.smartexam.model.User;
import kz.smartexam.smartexam.repository.QuizRepository;
import kz.smartexam.smartexam.repository.ResultRepository;
import kz.smartexam.smartexam.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final QuizRepository quizRepository;
    private final ResultRepository resultRepository;

    public AdminService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            QuizRepository quizRepository,
            ResultRepository resultRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.quizRepository = quizRepository;
        this.resultRepository = resultRepository;
    }

    public TeacherResponse createTeacher(
            CreateTeacherRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User teacher = new User();

        teacher.setName(request.getName());
        teacher.setSurname(request.getSurname());
        teacher.setEmail(request.getEmail());
        teacher.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        teacher.setRole(Role.TEACHER);

        User savedTeacher = userRepository.save(teacher);

        return new TeacherResponse(
                savedTeacher.getId(),
                savedTeacher.getName(),
                savedTeacher.getSurname(),
                savedTeacher.getEmail()
        );
    }

    public List<TeacherResponse> getAllTeachers() {
        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() == Role.TEACHER
                )
                .map(user ->
                        new TeacherResponse(
                                user.getId(),
                                user.getName(),
                                user.getSurname(),
                                user.getEmail()
                        )
                )
                .toList();
    }

    public AdminDashboardResponse getDashboard() {

        long totalStudents =
                userRepository.countByRole(Role.STUDENT);

        long totalTeachers =
                userRepository.countByRole(Role.TEACHER);

        long totalQuizzes =
                quizRepository.count();

        long totalAttempts =
                resultRepository.count();

        return new AdminDashboardResponse(
                totalStudents,
                totalTeachers,
                totalQuizzes,
                totalAttempts
        );
    }
}