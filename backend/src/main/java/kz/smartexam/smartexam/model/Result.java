package kz.smartexam.smartexam.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;

    private Integer totalQuestions;

    private Integer correctAnswers;

    private Double percentage;

    private String grade;

    private LocalDateTime completedAt;

    @ManyToOne
    @JoinColumn(name="quiz_id")
    @JsonIgnore
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnore
    private User student;
}
