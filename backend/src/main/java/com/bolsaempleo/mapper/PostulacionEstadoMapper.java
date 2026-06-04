package com.bolsaempleo.mapper;

import com.bolsaempleo.dto.Response.PostulacionEstadoResponse;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.model.Postulacion;
import com.bolsaempleo.model.PostulacionEstado;
import org.springframework.stereotype.Component;

@Component
public class PostulacionEstadoMapper {

    public PostulacionEstadoResponse toResponse(PostulacionEstado estado) {
        Postante postante = estado.getPostante();
        Postulacion postulacion = estado.getPostulacion();

        String empresa = "Empresa Aliada";
        if (postulacion != null && postulacion.getReclutador() != null && postulacion.getReclutador().getEmpresa() != null) {
            empresa = postulacion.getReclutador().getEmpresa();
        }

        return new PostulacionEstadoResponse(
            estado.getId(),
            estado.getEstado() != null ? estado.getEstado().name() : null,
            estado.getFechaPostulacion(),
            estado.getFechaActualizacion(),
            estado.getMotivo(),
            postante != null ? new PostulacionEstadoResponse.PostanteResumen(
                postante.getId(),
                postante.getNombres(),
                postante.getApellidos(),
                postante.getEmail(),
                postante.getCarrera(),
                postante.getCvPath(),
                postante.getFotoPerfil()
            ) : null,
            postulacion != null ? new PostulacionEstadoResponse.PostulacionResumen(
                postulacion.getId(),
                postulacion.getTitulo(),
                postulacion.getUbicacion(),
                empresa
            ) : null
        );
    }
}
