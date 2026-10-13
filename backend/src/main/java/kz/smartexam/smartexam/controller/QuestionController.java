package kz.smartexam.smartexam.controller;

import jakarta.validation.Valid;
import kz.smartexam.smartexam.dto.CreateQuestionRequest;
import kz.smartexam.smartexam.dto.QuestionResponse;
import kz.smartexam.smartexam.model.Question;
import kz.smartexam.smartexam.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping("/quizzes/{quizId}/questions")
    public Question addQuestion(
            @PathVariable Long quizId,
            @Valid @RequestBody CreateQuestionRequest request) {

        return questionService.addQuestion(quizId, request);
    }

    @GetMapping("/quizzes/{quizId}/questions")
    public List<QuestionResponse> getQuestionsByQuiz(
            @PathVariable Long quizId) {

        return questionService.getQuestionsForStudent(quizId);
    }

    @DeleteMapping("/questions/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }
}
