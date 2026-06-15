package com.bolsaempleo.dto.Response;

public record InterviewCheckAnswerResponse(
    boolean correct,
    int correctIndex
) {}
