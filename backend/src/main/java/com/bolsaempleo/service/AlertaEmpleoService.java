package com.bolsaempleo.service;

import com.bolsaempleo.dto.Request.AlertaEmpleoRequest;
import com.bolsaempleo.dto.Response.AlertaEmpleoResponse;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.model.AlertaEmpleo;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.repository.AlertaEmpleoRepository;
import com.bolsaempleo.repository.PostanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertaEmpleoService {

    private final AlertaEmpleoRepository alertaEmpleoRepository;
    private final PostanteRepository postanteRepository;

    @Transactional(readOnly = true)
    public List<AlertaEmpleoResponse> listar(Long postanteId) {
        return alertaEmpleoRepository.findByPostanteId(postanteId).stream().map(this::toResponse).toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public AlertaEmpleoResponse crear(Long postanteId, AlertaEmpleoRequest request) {
        Postante postante = postanteRepository.findById(postanteId)
            .orElseThrow(() -> new ResourceNotFoundException("Postante", postanteId));

        AlertaEmpleo alerta = new AlertaEmpleo();
        alerta.setPostante(postante);
        alerta.setKeyword(request.keyword());
        alerta.setModalidad(request.modalidad());
        alerta.setFrecuencia(request.frecuencia() != null ? request.frecuencia() : "Diaria");
        alerta.setActiva(true);

        return toResponse(alertaEmpleoRepository.save(alerta));
    }

    @Transactional(rollbackFor = Exception.class)
    public void eliminar(Long id) {
        if (!alertaEmpleoRepository.existsById(id)) {
            throw new ResourceNotFoundException("AlertaEmpleo", id);
        }
        alertaEmpleoRepository.deleteById(id);
    }

    private AlertaEmpleoResponse toResponse(AlertaEmpleo a) {
        return new AlertaEmpleoResponse(
            a.getId(), a.getKeyword(), a.getModalidad(),
            a.getFrecuencia(), a.isActiva(), a.getFechaCreacion()
        );
    }
}
