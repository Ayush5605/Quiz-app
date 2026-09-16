package com.microservices2.QuizServices.Model;

import lombok.Data;

@Data
public class QuizDTO {
    String categoryName;
    Integer numQuestions;
    String title;

}
