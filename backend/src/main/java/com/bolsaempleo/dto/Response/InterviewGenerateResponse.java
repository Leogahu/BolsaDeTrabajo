package com.bolsaempleo.dto.Response;

import java.util.List;

public record InterviewGenerateResponse(
    List<InterviewQuestionPublicDto> questions,
    String profileSummary
) {}
