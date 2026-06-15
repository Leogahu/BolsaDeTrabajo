package com.bolsaempleo.dto.Request;

public record InterviewCheckAnswerRequest(
    int questionIndex,
    int selectedIndex
) {}
