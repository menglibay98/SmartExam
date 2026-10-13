package kz.smartexam.smartexam.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class QuizAttemptResponse {

    private Long attemptId;

    private LocalDateTime startedAt;

    private LocalDateTime expiresAt;

    private boolean completed;
}
