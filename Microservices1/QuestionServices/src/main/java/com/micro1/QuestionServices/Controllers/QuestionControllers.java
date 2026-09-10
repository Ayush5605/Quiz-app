package com.micro1.QuestionServices.Controllers;



import com.micro1.QuestionServices.Model.Question;
import com.micro1.QuestionServices.Model.QuestionWrapper;
import com.micro1.QuestionServices.Model.Response;
import com.micro1.QuestionServices.Services.QuestionServices;
import com.micro1.QuestionServices.dao.QuestionDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("questions")
public class QuestionControllers {

    @Autowired
    QuestionServices questionServices;
    @Autowired
    private QuestionDao questionDao;


    @GetMapping("allQuestions")
    public ResponseEntity<List<Question>> getAllQuestion(){

        return questionServices.getAllQuestions();

    }

    @GetMapping("category/{category}")
    public ResponseEntity<List<Question>> getQuestionByCategory(@PathVariable String category){
        return questionServices.getQuestionByCategory(category);

    }


    @PostMapping("add")
    public ResponseEntity<String> addQuestion(@RequestBody Question question){
        return questionServices.addQuestion(question);

    }

    @DeleteMapping("delete/{id}")
    public String deleteQuestion(@PathVariable int id){
        return questionServices.deleteQuestion(id);

    }

    @PutMapping("/update")
    public ResponseEntity<String> updateQuestion(@RequestBody Question question){
        return questionServices.addQuestion(question);
    }

    @GetMapping("generate")
    public ResponseEntity<List<Integer>> getQuestionForQuiz(@RequestParam String categoryName,@RequestParam Integer numQuestion){
        return questionServices.getQuestionForQuiz(categoryName,numQuestion);
    }

    @PostMapping("getQuestions")
    public ResponseEntity<List<QuestionWrapper>> getQuestionsFromId(@RequestBody List<Integer> questionId){
        return questionServices.getQuestionsFromId(questionId);
    }

    @PostMapping("getScore")
    public ResponseEntity<Integer> getScore(@RequestBody List<Response> responses){
        return questionServices.getScore(responses);
    }


    
}
