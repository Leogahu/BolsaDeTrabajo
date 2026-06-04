package com.bolsaempleo.security;

import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.repository.ReclutadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final PostanteRepository postanteRepository;
    private final ReclutadorRepository reclutadorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {
        return postanteRepository.findByEmail(email)
                .map(p -> UserPrincipal.create(p.getId(), p.getEmail(), p.getPassword(), "ROLE_POSTANTE", true))
                .orElseGet(() -> reclutadorRepository.findByEmail(email)
                        .map(r -> UserPrincipal.create(r.getId(), r.getEmail(), r.getPassword(), "ROLE_RECLUTADOR", true))
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email)));
    }
}
