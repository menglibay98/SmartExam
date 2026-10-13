package kz.smartexam.smartexam.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveAnswerRequest {

    @NotNull
    private Long questionId;


    @NotBlank
    @Pattern(regexp = "[ABCD]")
    private String answer;
}
