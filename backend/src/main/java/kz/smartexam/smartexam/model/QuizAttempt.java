package kz.smartexam.smartexam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table( name = "quiz_attempts",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_quiz_attempt_student_quiz",
                        columnNames = {"quiz_id", "student_id"}
                )
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startedAt;

    private LocalDateTime expiresAt;

    private LocalDateTime submittedAt;

    private boolean completed;

    @ManyToOne
    @JoinColumn(name = "quiz_id",nullable = false)
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "student_id",nullable = false)
    private User student;

}
