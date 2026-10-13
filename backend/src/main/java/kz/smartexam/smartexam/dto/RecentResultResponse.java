package kz.smartexam.smartexam.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RecentResultResponse {

    private String studentName;
    private String quizTitle;
    private Double percentage;
    private String grade;
    private LocalDateTime completedAt;
}
