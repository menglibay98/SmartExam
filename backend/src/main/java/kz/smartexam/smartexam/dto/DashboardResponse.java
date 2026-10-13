package kz.smartexam.smartexam.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class DashboardResponse {

    private long totalStudents;
    private long totalQuizzes;
    private long totalAttempts;
    private double averageScore;

    private List<RecentResultResponse>  recentResults;
}
