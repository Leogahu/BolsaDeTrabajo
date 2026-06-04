package com.bolsaempleo.service;

import com.bolsaempleo.dto.Request.CertificadoRequest;
import com.bolsaempleo.dto.Response.CertificadoResponse;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.model.Certificados;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.repository.CertificadoRepository;
import com.bolsaempleo.repository.PostanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificadoService {

    private final CertificadoRepository certificadoRepository;
    private final PostanteRepository postanteRepository;

    @Transactional(readOnly = true)
    public List<CertificadoResponse> listarPorPostante(Long postanteId) {
        if (!postanteRepository.existsById(postanteId)) {
            throw new ResourceNotFoundException("Postante", postanteId);
        }
        return certificadoRepository.findByPostanteId(postanteId).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public CertificadoResponse crear(Long postanteId, CertificadoRequest request) {
        Postante postante = postanteRepository.findById(postanteId)
            .orElseThrow(() -> new ResourceNotFoundException("Postante", postanteId));

        Certificados cert = new Certificados();
        cert.setNombreCurso(request.nombreCurso());
        cert.setInstitucionEmisora(
            request.institucionEmisora() != null ? request.institucionEmisora() : "ChapaTuChamba"
        );
        cert.setFechaEmision(LocalDate.now());
        cert.setPostante(postante);

        return toResponse(certificadoRepository.save(cert));
    }

    private CertificadoResponse toResponse(Certificados cert) {
        return new CertificadoResponse(
            cert.getId(),
            cert.getNombreCurso(),
            cert.getInstitucionEmisora(),
            cert.getFechaEmision()
        );
    }
}
