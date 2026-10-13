package kz.smartexam.smartexam.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuizSubmissionRequest {
    private List<AnswerRequest> answers;
}
