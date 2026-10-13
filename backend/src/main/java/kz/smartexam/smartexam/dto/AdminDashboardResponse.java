package kz.smartexam.smartexam.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalStudents;
    private long totalTeachers;
    private long totalQuizzes;
    private long totalAttempts;
}
