package com.microservices.QuizApp.Services;


import com.microservices.QuizApp.Model.Question;
import com.microservices.QuizApp.dao.QuestionDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class QuestionServices {

    @Autowired
    QuestionDao questionDao;

    public List<Question> getAllQuestions(){
        return questionDao.findAll();

    }

    public List<Question> getQuestionByCategory(String category){
        return  questionDao.findByCategory(category);
    }
}
