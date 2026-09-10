package com.micro1.QuestionServices.Services;

import com.micro1.QuestionServices.Model.Question;
import com.micro1.QuestionServices.dao.QuestionDao;
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

    public ResponseEntity<List<Question>> getQuestionByCategory(String category){
        try{
            return new ResponseEntity<>(questionDao.findByCategory(category),HttpStatus.OK);

        }catch(Exception e){
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.BAD_REQUEST);

    }

    public ResponseEntity<String> addQuestion(Question question){
        questionDao.save(question);
        try{
            return new ResponseEntity<>("success",HttpStatus.CREATED);

        }catch(Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed",HttpStatus.BAD_REQUEST);



    }

    public String deleteQuestion(int id){
        questionDao.deleteById(id);
        return "success";
    }

    public ResponseEntity<List<Integer>> getQuestionForQuiz(String categoryName,Integer numQuestions){
        List<Integer> questions=questionDao.findRandomQuestionsByCategory(categoryName,numQuestions);
        return new ResponseEntity<>(questions,HttpStatus.OK);
    }
}
