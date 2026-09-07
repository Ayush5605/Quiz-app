package com.microservices.QuizApp.Controllers;

import com.microservices.QuizApp.Model.Question;
import com.microservices.QuizApp.Model.QuestionWrapper;
import com.microservices.QuizApp.Model.Quiz;
import com.microservices.QuizApp.Services.QuizServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("quiz")
public class QuizController {

    @Autowired
    QuizServices quizservices;

    @PostMapping("create")
    public ResponseEntity<String> createQuiz(@RequestParam String category, @RequestParam int numQ, @RequestParam String title){

        return quizservices.createQuiz(category,numQ,title);

    }

    @GetMapping("{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuiz(@PathVariable Integer id){
        return quizservices.getQuizQuestions(id);


    }
}
