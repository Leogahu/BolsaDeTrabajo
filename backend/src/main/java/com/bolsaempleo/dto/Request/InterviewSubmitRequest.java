package com.bolsaempleo.dto.Request;

import java.util.List;

public record InterviewSubmitRequest(
    List<Integer> answers
) {}
