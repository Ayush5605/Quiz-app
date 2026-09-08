package com.microservices.QuizApp.Services;


import com.microservices.QuizApp.Model.Question;
import com.microservices.QuizApp.Model.QuestionWrapper;
import com.microservices.QuizApp.Model.Quiz;
import com.microservices.QuizApp.Model.Response;
import com.microservices.QuizApp.dao.QuestionDao;
import com.microservices.QuizApp.dao.QuizDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizServices {

    @Autowired
    QuizDao quizdao;

    @Autowired
    QuestionDao questionDao;

    public ResponseEntity<String> createQuiz(String category,int numQ,String title){

        List<Question> questions=questionDao.findRandomQuestionsByCategory(category,numQ);
        Quiz quiz=new Quiz();

        quiz.setTitle(title);
        quiz.setQuestions(questions);
        quizdao.save(quiz);



        return new ResponseEntity<>("success",HttpStatus.OK);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id){
        Optional<Quiz> quiz=quizdao.findById(id);
        List<Question> questionsFromDB=quiz.get().getQuestions();
        List<QuestionWrapper>questionsForUser=new ArrayList<>();
        for(Question q : questionsFromDB){
            QuestionWrapper qw=new QuestionWrapper(q.getId(),q.getQuestionTitle(),q.getOption1(),q.getOption2(),q.getOption3(),q.getOption4());

            questionsForUser.add(qw);



        }
        return new ResponseEntity<>(questionsForUser,HttpStatus.OK);
    }

    public ResponseEntity<Integer> calculateResult(Integer id, List<Response> response){
        Quiz quiz=quizdao.findById(id).get();
        List<Question> questions=quiz.getQuestions();
        int score=0;


        for(int i=0;i<response.size();i++){
            if(response.get(i).getResponse().equals(questions.get(i).getRightAnswer())){
                score++;
            }
        }
        return new ResponseEntity<>(score,HttpStatus.OK);

    }



}
