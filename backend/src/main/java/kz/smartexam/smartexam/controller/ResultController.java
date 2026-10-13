package kz.smartexam.smartexam.controller;

import kz.smartexam.smartexam.dto.StudentResultResponse;
import kz.smartexam.smartexam.model.Result;
import kz.smartexam.smartexam.service.ResultService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService){
        this.resultService = resultService;
    }

    @GetMapping
    public List<Result> getAllResults(){
        return resultService.getAllResults();
    }

    @GetMapping("/quiz/{quizId}")
    public List<Result> getResultsByQuiz(@PathVariable Long quizId){
        return resultService.getResultsByQuiz(quizId);
    }

    @GetMapping("/my")
    public List<StudentResultResponse> getMyResults(){
        return resultService.getMyResults();
    }
}
