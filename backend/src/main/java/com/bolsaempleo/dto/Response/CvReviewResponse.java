package com.bolsaempleo.dto.Response;

import java.util.List;

public record CvReviewResponse(
    String overallAssessment,
    List<String> strengths,
    List<String> recommendations,
    int score
) {}
