package com.microservices.QuizApp.Controllers;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("questions")
public class QuestionControllers {


    @GetMapping("allQuestions")
    public String getAllQuestion(){

        return "OnePiece";

    }
}
