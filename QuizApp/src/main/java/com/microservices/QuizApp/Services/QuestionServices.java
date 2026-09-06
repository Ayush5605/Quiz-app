package com.microservices.QuizApp.Services;


import com.microservices.QuizApp.Model.Question;
import com.microservices.QuizApp.dao.QuestionDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@Service
public class QuestionServices {

    @Autowired
    QuestionDao questionDao;

    public ResponseEntity<List<Question>> getAllQuestions(){
        try{
            return  new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.BAD_REQUEST);


    }

    public List<Question> getQuestionByCategory(String category){
        return  questionDao.findByCategory(category);
    }

    public String addQuestion(Question question){
        questionDao.save(question);
        return "success";

    }

    public String deleteQuestion(int id){
        questionDao.deleteById(id);
        return "success";
    }
}
