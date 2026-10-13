package kz.smartexam.smartexam.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuizResultResponse {

    private int totalQuestions;
    private int correctAnswers;
    private double percentage;
    private String grade;
}
