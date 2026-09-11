package com.microservices2.QuizServices.dao;

import com.microservices2.QuizServices.Model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizDao extends JpaRepository<Quiz,Integer> {
}
