package com.micro1.QuestionServices.Services;

import com.micro1.QuestionServices.Model.Question;
import com.micro1.QuestionServices.Model.QuestionWrapper;
import com.micro1.QuestionServices.Model.Response;
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

    public ResponseEntity<List<QuestionWrapper>> getQuestionsFromId(List<Integer> questionId) {
        List<QuestionWrapper> wrappers=new ArrayList<>();
        List<Question>questions=new ArrayList<>();

        for (Integer id:questionId){
            questions.add(questionDao.findById(id).get());

        }

        for(Question question:questions){
            QuestionWrapper wrapper=new QuestionWrapper();
            wrapper.setId(question.getId());
            wrapper.setQuestionTitle(question.getQuestionTitle());
            wrapper.setOption1(question.getOption1());
            wrapper.setOption2(question.getOption2());
            wrapper.setOption3(question.getOption3());
            wrapper.setOption4(question.getOption4());

            wrappers.add(wrapper);

        }

        return new ResponseEntity<>(wrappers, HttpStatus.MULTI_STATUS.OK);
    }

    public ResponseEntity<Integer> getScore(List<Response> responses) {


        int score=0;


        for(Response response:responses){
            Question question=questionDao.findById(response.getId()).get();
            if(response.getResponse().equals(question.getRightAnswer())){
                score++;
            }
        }
        return new ResponseEntity<>(score,HttpStatus.OK);
    }
}
