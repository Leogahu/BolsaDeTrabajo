package com.bolsaempleo.dto.Response;

import java.util.List;

public record InterviewSessionResult(
    InterviewGenerateResponse response,
    List<InterviewQuestionDto> fullQuestions
) {}
