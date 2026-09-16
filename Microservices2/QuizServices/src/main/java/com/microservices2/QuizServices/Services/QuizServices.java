package com.microservices2.QuizServices.Services;


import com.microservices2.QuizServices.Model.QuestionWrapper;
import com.microservices2.QuizServices.Model.Quiz;
import com.microservices2.QuizServices.Model.Response;
import com.microservices2.QuizServices.dao.QuizDao;
import com.microservices2.QuizServices.feign.QuizInterface;
import org.aspectj.weaver.patterns.TypePatternQuestions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizServices {

    @Autowired
    QuizDao quizdao;

    @Autowired
    QuizInterface quizInterface;



    public ResponseEntity<String> createQuiz(String category,int numQ,String title){
        List<Integer>questions=quizInterface.getQuestionForQuiz(category,numQ).getBody();
        Quiz quiz=new Quiz();
        quiz.setTitle(title);
        quiz.setQuestionIds(questions);
        quizdao.save(quiz);




        return new ResponseEntity<>("success",HttpStatus.OK);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id){
        Quiz quiz=quizdao.findById(id).get();
        List<Integer> questionsFromDB=quiz.getQuestionIds();

        ResponseEntity<List<QuestionWrapper>> questions=quizInterface.getQuestionsFromId(questionsFromDB);

        return questions;
    }

//    public ResponseEntity<Integer> calculateResult(Integer id, List<Response> response){
//        Quiz quiz=quizdao.findById(id).get();
//        List<Question> questions=quiz.getQuestions();
//        int score=0;
//
//
//        for(int i=0;i<response.size();i++){
//            if(response.get(i).getResponse().equals(questions.get(i).getRightAnswer())){
//                score++;
//            }
//        }
//        return new ResponseEntity<>(score,HttpStatus.OK);
//
//    }



}
