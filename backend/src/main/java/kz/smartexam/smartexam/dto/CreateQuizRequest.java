package kz.smartexam.smartexam.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateQuizRequest {

    @NotBlank(message = "Quiz title is required")
    private String title;

    private String description;

    @NotNull(message = "Time limit is required")
    @Min(
            value = 1,
            message = "Time limit must be at least 1 minute"
    )
    private Integer timeLimit;
}
