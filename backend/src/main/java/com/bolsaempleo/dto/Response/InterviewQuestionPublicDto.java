package com.bolsaempleo.dto.Response;

import java.util.List;

public record InterviewQuestionPublicDto(
    String question,
    List<String> options
) {}
