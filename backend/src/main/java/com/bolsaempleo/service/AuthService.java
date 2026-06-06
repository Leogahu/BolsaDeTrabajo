package com.bolsaempleo.service;

import com.bolsaempleo.dto.Request.LoginRequest;
import com.bolsaempleo.dto.Response.AuthResponse;
import com.bolsaempleo.exception.BadCredentialsException;
import com.bolsaempleo.mapper.AuthMapper;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.model.Reclutador;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.repository.ReclutadorRepository;
import com.bolsaempleo.security.JwtService;
import com.bolsaempleo.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PostanteRepository postanteRepository;
    private final ReclutadorRepository reclutadorRepository;
    private final AuthMapper authMapper;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest credentials) {
        if (credentials.username() == null || credentials.password() == null || credentials.username().isBlank()) {
            throw new BadCredentialsException("Faltan ingresar las credenciales.");
        }
        var postanteOpt = postanteRepository.findByEmail(credentials.username());
        if (postanteOpt.isPresent()) {
            Postante postante = postanteOpt.get();
            if (matchesPassword(credentials.password(), postante.getPassword())) {
                return withToken(authMapper.toAuthResponse(postante), postante.getEmail(), postante.getPassword(), "ROLE_POSTANTE", postante.getId());
            }
        } else {
            postanteOpt = postanteRepository.findByUsername(credentials.username());
            if (postanteOpt.isPresent()) {
                Postante postante = postanteOpt.get();
                if (matchesPassword(credentials.password(), postante.getPassword())) {
                    return withToken(authMapper.toAuthResponse(postante), postante.getEmail(), postante.getPassword(), "ROLE_POSTANTE", postante.getId());
                }
            }
        }
        var reclutadorOpt = reclutadorRepository.findByEmail(credentials.username());
        if (reclutadorOpt.isPresent()) {
            Reclutador reclutador = reclutadorOpt.get();
            if (matchesPassword(credentials.password(), reclutador.getPassword())) {
                return withToken(authMapper.toAuthResponse(reclutador), reclutador.getEmail(), reclutador.getPassword(), "ROLE_RECLUTADOR", reclutador.getId());
            }
        } else {
            reclutadorOpt = reclutadorRepository.findByUsername(credentials.username());
            if (reclutadorOpt.isPresent()) {
                Reclutador reclutador = reclutadorOpt.get();
                if (matchesPassword(credentials.password(), reclutador.getPassword())) {
                    return withToken(authMapper.toAuthResponse(reclutador), reclutador.getEmail(), reclutador.getPassword(), "ROLE_RECLUTADOR", reclutador.getId());
                }
            }
        }
        throw new BadCredentialsException("Usuario o contraseña incorrectos.");
    }

    private boolean matchesPassword(String raw, String stored) {
        if (stored == null) {
            return false;
        }
        if (stored.startsWith("$2a$") || stored.startsWith("$2b$")) {
            return passwordEncoder.matches(raw, stored);
        }
        return stored.equals(raw);
    }

    private AuthResponse withToken(AuthResponse base, String email, String password, String role, Long id) {
        UserPrincipal principal = UserPrincipal.create(id, email, password, role, true);
        String token = jwtService.generateToken(principal);
        return new AuthResponse(
                base.id(),
                base.username(),
                base.nombres(),
                base.apellidos(),
                base.nombreCompleto(),
                base.email(),
                base.empresa(),
                base.fotoPerfil(),
                base.tipo(),
                token
        );
    }
}
