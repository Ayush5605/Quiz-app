package com.microservices.QuizApp.Controllers;


import com.microservices.QuizApp.Model.Question;
import com.microservices.QuizApp.Services.QuestionServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("category/{category}")
    public List<Question> getQuestionByCategory(@PathVariable String category){
        return questionServices.getQuestionByCategory(category);

    }


    @PostMapping("add")
    public String addQuestion(@RequestBody Question question){
        return questionServices.addQuestion(question);

    }

    @DeleteMapping("delete/{id}")
    public String deleteQuestion(@PathVariable int id){
        return questionServices.deleteQuestion(id);

    }
}
