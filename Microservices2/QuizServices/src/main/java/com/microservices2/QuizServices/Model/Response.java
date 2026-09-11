package com.microservices2.QuizServices.Model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class Response  {
    private Integer id;
    private String response;
}
