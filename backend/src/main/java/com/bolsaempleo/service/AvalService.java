package com.bolsaempleo.service;

import com.bolsaempleo.dto.Request.AvalRequest;
import com.bolsaempleo.dto.Response.AvalResponse;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.model.Avales;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.repository.AvalRepository;
import com.bolsaempleo.repository.PostanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvalService {

    private final AvalRepository avalRepository;
    private final PostanteRepository postanteRepository;

    @Transactional(readOnly = true)
    public List<AvalResponse> listarPorPostante(Long postanteId) {
        if (!postanteRepository.existsById(postanteId)) {
            throw new ResourceNotFoundException("Postante", postanteId);
        }
        return avalRepository.findByPostanteId(postanteId).stream().map(this::toResponse).toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public AvalResponse crear(Long postanteId, AvalRequest request) {
        Postante postante = postanteRepository.findById(postanteId)
            .orElseThrow(() -> new ResourceNotFoundException("Postante", postanteId));

        Avales aval = new Avales();
        aval.setNombreAvalador(request.nombreAvalador());
        aval.setCargoInstitucion(request.cargoInstitucion());
        aval.setComentarioAval(request.comentarioAval());
        aval.setContactoEmail(request.contactoEmail());
        aval.setPostante(postante);

        return toResponse(avalRepository.save(aval));
    }

    @Transactional(rollbackFor = Exception.class)
    public void eliminar(Long id) {
        if (!avalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Aval", id);
        }
        avalRepository.deleteById(id);
    }

    private AvalResponse toResponse(Avales aval) {
        return new AvalResponse(
            aval.getId(),
            aval.getNombreAvalador(),
            aval.getCargoInstitucion(),
            aval.getComentarioAval(),
            aval.getContactoEmail()
        );
    }
}
