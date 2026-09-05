package com.microservices.QuizApp.dao;


import com.microservices.QuizApp.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionDao  extends JpaRepository<Question,Integer> {
}
