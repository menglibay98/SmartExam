package kz.smartexam.smartexam.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class StudentResultResponse {

    private Long id;
    private String quizTitle;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double percentage;
    private String grade;
    private LocalDateTime completedAt;
}
