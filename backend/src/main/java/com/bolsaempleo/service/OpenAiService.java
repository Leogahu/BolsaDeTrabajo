package com.bolsaempleo.service;

import com.bolsaempleo.dto.Response.CvReviewResponse;
import com.bolsaempleo.dto.Response.InterviewCheckAnswerResponse;
import com.bolsaempleo.dto.Response.InterviewGenerateResponse;
import com.bolsaempleo.dto.Response.InterviewQuestionDto;
import com.bolsaempleo.dto.Response.InterviewQuestionPublicDto;
import com.bolsaempleo.dto.Response.InterviewResultResponse;
import com.bolsaempleo.dto.Response.InterviewSessionResult;
import com.bolsaempleo.exception.BusinessRuleException;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.model.Habilidad;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.repository.HabilidadRepository;
import com.bolsaempleo.repository.PostanteRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAiService {

    private final PostanteRepository postanteRepository;
    private final HabilidadRepository habilidadRepository;
    private final ObjectMapper objectMapper;

    @Value("${openai.api-key:}")
    private String apiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    @Value("${openai.api-url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    public InterviewSessionResult generateInterviewSession(Long postanteId) {
        Postante postante = postanteRepository.findById(postanteId)
            .orElseThrow(() -> new ResourceNotFoundException("Postante", postanteId));

        List<Habilidad> habilidades = habilidadRepository.findByPostanteId(postanteId);
        String profileContext = buildProfileContext(postante, habilidades);

        String prompt = """
            Eres un reclutador experto de ChapaTuChamba, una bolsa de trabajo para recién egresados.
            Genera una entrevista personalizada de EXACTAMENTE 10 preguntas de opción múltiple para el siguiente candidato.

            Perfil del candidato:
            %s

            Reglas estrictas:
            - Exactamente 10 preguntas
            - Cada pregunta debe tener exactamente 4 opciones (1 correcta y 3 incorrectas pero plausibles)
            - Las preguntas deben ser relevantes a su carrera, habilidades y perfil profesional
            - Mezcla preguntas técnicas, de soft skills y situacionales
            - correctIndex es el índice (0-3) de la respuesta correcta
            - Responde SOLO con JSON válido, sin markdown

            Formato JSON requerido:
            {
              "questions": [
                {
                  "question": "texto de la pregunta",
                  "options": ["opción A", "opción B", "opción C", "opción D"],
                  "correctIndex": 0
                }
              ]
            }
            """.formatted(profileContext);

        String rawJson = callOpenAi(prompt);                                         // ✅ renamed from "response"
        List<InterviewQuestionDto> fullQuestions = parseQuestions(rawJson);
        List<InterviewQuestionPublicDto> publicQuestions = fullQuestions.stream()
            .map(q -> new InterviewQuestionPublicDto(q.question(), q.options()))
            .toList();
        InterviewGenerateResponse generateResponse =                                  // ✅ renamed from "response"
            new InterviewGenerateResponse(publicQuestions, profileContext.trim());
        return new InterviewSessionResult(generateResponse, fullQuestions);
    }

    public InterviewCheckAnswerResponse checkAnswer(List<InterviewQuestionDto> questions, int questionIndex, int selectedIndex) {
        if (questionIndex < 0 || questionIndex >= questions.size()) {
            throw new BusinessRuleException("Índice de pregunta inválido");
        }
        InterviewQuestionDto q = questions.get(questionIndex);
        return new InterviewCheckAnswerResponse(selectedIndex == q.correctIndex(), q.correctIndex());
    }

    public InterviewResultResponse evaluateInterview(List<Integer> userAnswers, List<InterviewQuestionDto> questions) {
        if (userAnswers == null || questions == null || userAnswers.size() != questions.size()) {
            throw new BusinessRuleException("Las respuestas no coinciden con el número de preguntas");
        }

        int score = 0;
        for (int i = 0; i < questions.size(); i++) {
            if (userAnswers.get(i) != null && userAnswers.get(i) == questions.get(i).correctIndex()) {
                score++;
            }
        }

        int total = questions.size();
        double percentage = (score * 100.0) / total;
        String level;
        String feedback;

        if (percentage >= 90) {
            level = "Excelente";
            feedback = "Demuestras un dominio sólido del perfil profesional. Estás muy bien preparado para entrevistas reales.";
        } else if (percentage >= 70) {
            level = "Bueno";
            feedback = "Buen desempeño general. Refuerza las áreas donde fallaste practicando respuestas con el método STAR.";
        } else if (percentage >= 50) {
            level = "Regular";
            feedback = "Hay margen de mejora. Revisa tu perfil, habilidades y practica respuestas estructuradas antes de entrevistas.";
        } else {
            level = "Necesita mejorar";
            feedback = "Te recomendamos revisar los conceptos de tu carrera, completar pruebas de habilidades y practicar más en el simulador.";
        }

        return new InterviewResultResponse(score, total, percentage, level, feedback);
    }

    public CvReviewResponse reviewCv(Long postanteId) {
        Postante postante = postanteRepository.findById(postanteId)
            .orElseThrow(() -> new ResourceNotFoundException("Postante", postanteId));

        List<Habilidad> habilidades = habilidadRepository.findByPostanteId(postanteId);
        String profileContext = buildProfileContext(postante, habilidades);

        String prompt = """
            Eres un consultor de carrera experto de ChapaTuChamba.
            Analiza el perfil/CV del siguiente candidato junior y proporciona recomendaciones profesionales.

            Datos del candidato:
            %s

            Responde SOLO con JSON válido, sin markdown:
            {
              "overallAssessment": "evaluación general en 2-3 oraciones",
              "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
              "recommendations": ["recomendación 1", "recomendación 2", "recomendación 3", "recomendación 4"],
              "score": 75
            }

            El score es de 0 a 100 evaluando completitud y calidad del perfil para el mercado laboral junior.
            """.formatted(profileContext);

        String rawJson = callOpenAi(prompt);                                         
        return parseCvReviewResponse(rawJson);
    }

    private String buildProfileContext(Postante postante, List<Habilidad> habilidades) {
        String skills = habilidades.isEmpty()
            ? "Sin habilidades registradas"
            : habilidades.stream()
                .map(h -> h.getNombre() + (h.isVerificada() ? " (verificada)" : " (pendiente)"))
                .collect(Collectors.joining(", "));

        return """
            Nombre: %s %s
            Email: %s
            Carrera/Profesión: %s
            Institución: %s
            Egresado: %s
            Teléfono: %s
            Descripción/Resumen profesional: %s
            CV disponible: %s
            Habilidades: %s
            """.formatted(
            nullSafe(postante.getNombres()),
            nullSafe(postante.getApellidos()),
            nullSafe(postante.getEmail()),
            nullSafe(postante.getCarrera()),
            nullSafe(postante.getInstitucion()),
            postante.getEgresado() != null ? (postante.getEgresado() ? "Sí" : "No") : "No especificado",
            nullSafe(postante.getTelefono()),
            nullSafe(postante.getDescripcion()),
            postante.getCvPath() != null && !postante.getCvPath().isBlank() ? "Sí" : "No",
            skills
        );
    }

    private String nullSafe(String value) {
        return value != null && !value.isBlank() ? value : "No especificado";
    }

    private String callOpenAi(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new BusinessRuleException("La API de OpenAI no está configurada. Asigna la variable OPENAI_API_KEY.");
        }

        try {
            RestClient client = RestClient.create();

            Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                    Map.of("role", "system", "content", "Eres un asistente que responde únicamente en JSON válido."),
                    Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7,
                "response_format", Map.of("type", "json_object")
            );

            String rawResponse = client.post()                                      
                .uri(apiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(body)
                .retrieve()
                .body(String.class);

            JsonNode root = objectMapper.readTree(rawResponse);
            JsonNode content = root.path("choices").path(0).path("message").path("content");
            if (content.isMissingNode() || content.asText().isBlank()) {
                throw new BusinessRuleException("OpenAI no devolvió una respuesta válida");
            }
            return content.asText();
        } catch (BusinessRuleException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error al llamar a OpenAI: {}", e.getMessage());
            throw new BusinessRuleException("Error al comunicarse con OpenAI: " + e.getMessage());
        }
    }

    private List<InterviewQuestionDto> parseQuestions(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode questionsNode = root.path("questions");

            if (!questionsNode.isArray() || questionsNode.isEmpty()) {
                throw new BusinessRuleException("La IA no generó preguntas válidas");
            }

            List<InterviewQuestionDto> questions = new ArrayList<>();
            for (JsonNode q : questionsNode) {
                List<String> options = new ArrayList<>();
                q.path("options").forEach(opt -> options.add(opt.asText()));

                questions.add(new InterviewQuestionDto(
                    q.path("question").asText(),
                    options,
                    q.path("correctIndex").asInt(0)
                ));
            }

            return questions;
        } catch (BusinessRuleException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error al parsear entrevista: {}", e.getMessage());
            throw new BusinessRuleException("Error al procesar la entrevista generada");
        }
    }

    private CvReviewResponse parseCvReviewResponse(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);

            List<String> strengths = new ArrayList<>();
            root.path("strengths").forEach(s -> strengths.add(s.asText()));

            List<String> recommendations = new ArrayList<>();
            root.path("recommendations").forEach(r -> recommendations.add(r.asText()));

            return new CvReviewResponse(
                root.path("overallAssessment").asText("Sin evaluación disponible"),
                strengths,
                recommendations,
                root.path("score").asInt(0)
            );
        } catch (Exception e) {
            log.error("Error al parsear revisión de CV: {}", e.getMessage());
            throw new BusinessRuleException("Error al procesar la revisión del CV");
        }
    }
}