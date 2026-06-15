package com.bolsaempleo.dto.Response;

import java.util.List;

public record InterviewQuestionDto(
    String question,
    List<String> options,
    int correctIndex
) {}
