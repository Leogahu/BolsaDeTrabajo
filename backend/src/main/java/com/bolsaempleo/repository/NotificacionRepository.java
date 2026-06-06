package com.bolsaempleo.repository;

import com.bolsaempleo.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioIdAndUsuarioTipoOrderByFechaCreacionDesc(
        Long usuarioId, Notificacion.TipoUsuario usuarioTipo);

    long countByUsuarioIdAndUsuarioTipoAndLeidaFalse(Long usuarioId, Notificacion.TipoUsuario usuarioTipo);
}
