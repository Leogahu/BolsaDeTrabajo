package com.bolsaempleo.dto.Response;

import java.util.List;

public record InterviewResultResponse(
    int score,
    int total,
    double percentage,
    String level,
    String feedback
) {}
