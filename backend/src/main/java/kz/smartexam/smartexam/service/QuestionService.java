package kz.smartexam.smartexam.service;

import kz.smartexam.smartexam.dto.QuestionResponse;
import kz.smartexam.smartexam.model.Question;
import kz.smartexam.smartexam.model.Quiz;
import kz.smartexam.smartexam.repository.QuestionRepository;
import kz.smartexam.smartexam.repository.QuizRepository;
import org.springframework.stereotype.Service;

import kz.smartexam.smartexam.dto.CreateQuestionRequest;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    public QuestionService(QuestionRepository questionRepository,
                           QuizRepository quizRepository){
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
    }

    public List<Question> getQuestionsByQuiz(Long quizId){
        return questionRepository.findByQuizId(quizId);
    }

    public Question addQuestion(
            Long quizId,
            CreateQuestionRequest request) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        Question question = new Question();

        question.setQuestionText(request.getQuestionText());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(
                request.getCorrectAnswer().toUpperCase()
        );
        question.setQuiz(quiz);

        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id){
        questionRepository.deleteById(id);
    }

    public List<QuestionResponse> getQuestionsForStudent(Long quizId){
        return questionRepository.findByQuizId(quizId)
                .stream()
                .map(question -> new QuestionResponse(
                        question.getId(),
                        question.getQuestionText(),
                        question.getOptionA(),
                        question.getOptionB(),
                        question.getOptionC(),
                        question.getOptionD()
                ))
                .toList();
    }
}
