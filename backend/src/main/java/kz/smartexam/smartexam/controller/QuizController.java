package kz.smartexam.smartexam.controller;

import jakarta.validation.Valid;
import kz.smartexam.smartexam.dto.*;
import kz.smartexam.smartexam.model.Quiz;
import kz.smartexam.smartexam.service.QuizAttemptService;
import kz.smartexam.smartexam.service.QuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;
    private final QuizAttemptService quizAttemptService;

    public QuizController(QuizService quizService,
                          QuizAttemptService quizAttemptService) {
        this.quizService = quizService;
        this.quizAttemptService = quizAttemptService;
    }

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    @PostMapping
    public Quiz createQuiz(@Valid @RequestBody CreateQuizRequest request) {
        return quizService.createQuiz(request);
    }

    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
    }

    @PostMapping("/{id}/submit")
    public QuizResultResponse submitQuiz(
            @PathVariable Long id,
            @RequestBody QuizSubmissionRequest submission) {
        return quizService.submitQuiz(id, submission);
    }

    @PostMapping("/{id}/start")
    public QuizAttemptResponse startQuiz(@PathVariable Long id) {
        return quizAttemptService.startQuiz(id);
    }

    @PutMapping("/{id}/answers")
    public void saveAnswer(
            @PathVariable Long id,
            @Valid @RequestBody SaveAnswerRequest request) {
        quizService.saveAnswer(id, request);
    }

    @GetMapping("/{id}/answers")
    public List<SavedAnswerResponse> getSavedAnswers(@PathVariable Long id){
        return quizService.getSavedAnswers(id);
    }
}