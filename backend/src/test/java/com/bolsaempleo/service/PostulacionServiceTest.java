package com.bolsaempleo.service;

import com.bolsaempleo.exception.BusinessRuleException;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.mapper.PostulacionEstadoMapper;
import com.bolsaempleo.mapper.PostulacionMapper;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.repository.PostulacionEstadoRepository;
import com.bolsaempleo.repository.PostulacionRepository;
import com.bolsaempleo.model.Postulacion;
import com.bolsaempleo.model.Postante;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PostulacionServiceTest {

    @Mock
    private PostulacionRepository postulacionRepository;

    @Mock
    private PostulacionEstadoRepository postulacionEstadoRepository;

    @Mock
    private PostanteRepository postanteRepository;

    @Mock
    private PostulacionMapper postulacionMapper;

    @Mock
    private PostulacionEstadoMapper postulacionEstadoMapper;

    @Mock
    private NotificacionService notificacionService;

    @Mock
    private ChatService chatService;

    @InjectMocks
    private PostulacionService postulacionService;

    @Test
    void postulacionNoExiste() {
        when(postulacionRepository.findById(1L))
                .thenReturn(java.util.Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> postulacionService.postular(1L, 1L)
        );
    }

    @Test
    void obtenerCandidatosVacanteInexistente() {
        when(postulacionRepository.existsById(1L))
                .thenReturn(false);

        assertThrows(
                ResourceNotFoundException.class,
                () -> postulacionService.obtenerCandidatos(1L)
        );
    }

    @Test
    void eliminarVacanteInexistente() {
        when(postulacionRepository.existsById(1L))
                .thenReturn(false);

        assertThrows(
                ResourceNotFoundException.class,
                () -> postulacionService.eliminar(1L)
        );
    }

    @Test
    void buscarEstadoInexistente() {
        when(postulacionEstadoRepository
                .findByPostulacionIdAndPostanteIdWithDetails(1L, 1L))
                .thenReturn(java.util.Optional.empty());

        assertThrows(
                BusinessRuleException.class,
                () -> postulacionService.buscarEstado(1L, 1L)
        );
    }

    @Test
    void postanteNoExiste() {

        Postulacion postulacion = new Postulacion();

        when(postulacionRepository.findById(1L))
                .thenReturn(Optional.of(postulacion));

        when(postanteRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> postulacionService.postular(1L, 1L)
        );
    }

    @Test
    void postulacionDuplicada() {

        Postulacion postulacion = new Postulacion();
        Postante postante = new Postante();

        when(postulacionRepository.findById(1L))
                .thenReturn(Optional.of(postulacion));

        when(postanteRepository.findById(1L))
                .thenReturn(Optional.of(postante));

        when(postulacionEstadoRepository
                .findByPostulacionIdAndPostanteId(1L, 1L))
                .thenReturn(Optional.of(org.mockito.Mockito.mock(
                        com.bolsaempleo.model.PostulacionEstado.class)));

        assertThrows(
                BusinessRuleException.class,
                () -> postulacionService.postular(1L, 1L)
        );
    }
}