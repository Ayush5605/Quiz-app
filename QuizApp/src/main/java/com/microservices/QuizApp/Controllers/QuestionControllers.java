package com.microservices.QuizApp.Controllers;


import com.microservices.QuizApp.Model.Question;
import com.microservices.QuizApp.Services.QuestionServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("questions")
public class QuestionControllers {

    @Autowired
    QuestionServices questionServices;


    @GetMapping("allQuestions")
    public List<Question> getAllQuestion(){

        return questionServices.getAllQuestions();

    }
}
