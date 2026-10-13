package kz.smartexam.smartexam.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerRequest {

    private Long questionId;
    private String answer;
}
