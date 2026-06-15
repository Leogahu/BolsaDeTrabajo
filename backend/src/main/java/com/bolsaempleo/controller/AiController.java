package com.bolsaempleo.controller;

import com.bolsaempleo.dto.Request.InterviewCheckAnswerRequest;
import com.bolsaempleo.dto.Request.InterviewSubmitRequest;
import com.bolsaempleo.dto.Response.CvReviewResponse;
import com.bolsaempleo.dto.Response.InterviewCheckAnswerResponse;
import com.bolsaempleo.dto.Response.InterviewGenerateResponse;
import com.bolsaempleo.dto.Response.InterviewQuestionDto;
import com.bolsaempleo.dto.Response.InterviewResultResponse;
import com.bolsaempleo.security.SecurityUtils;
import com.bolsaempleo.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final OpenAiService openAiService;

    // Cache temporal de sesiones de entrevista (postanteId -> preguntas con respuestas correctas)
    private final ConcurrentHashMap<Long, List<InterviewQuestionDto>> interviewSessions = new ConcurrentHashMap<>();

    @PostMapping("/interview/generate")
    public ResponseEntity<InterviewGenerateResponse> generateInterview() {
        Long postanteId = SecurityUtils.getCurrentUserId();
        var session = openAiService.generateInterviewSession(postanteId);
        interviewSessions.put(postanteId, session.fullQuestions());
        return ResponseEntity.ok(session.response());
    }

    @PostMapping("/interview/check")
    public ResponseEntity<InterviewCheckAnswerResponse> checkAnswer(@RequestBody InterviewCheckAnswerRequest request) {
        Long postanteId = SecurityUtils.getCurrentUserId();
        List<InterviewQuestionDto> questions = interviewSessions.get(postanteId);
        if (questions == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(openAiService.checkAnswer(questions, request.questionIndex(), request.selectedIndex()));
    }

    @PostMapping("/interview/submit")
    public ResponseEntity<InterviewResultResponse> submitInterview(@RequestBody InterviewSubmitRequest request) {
        Long postanteId = SecurityUtils.getCurrentUserId();
        List<InterviewQuestionDto> questions = interviewSessions.get(postanteId);

        if (questions == null || questions.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        InterviewResultResponse result = openAiService.evaluateInterview(request.answers(), questions);
        interviewSessions.remove(postanteId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/cv/review")
    public ResponseEntity<CvReviewResponse> reviewCv() {
        Long postanteId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(openAiService.reviewCv(postanteId));
    }
}
