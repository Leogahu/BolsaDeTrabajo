package com.bolsaempleo.seed;

import com.bolsaempleo.model.Reclutador;
import com.bolsaempleo.repository.ReclutadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final ReclutadorRepository reclutadorRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${APP_ADMIN_EMAIL:admin@bolsaempleo.com}")
    private String adminEmail;

    @Value("${APP_ADMIN_PASSWORD:AdminSecure123*}")
    private String adminPassword;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void run(ApplicationArguments args) {
        ensureRole("ROLE_POSTANTE");
        ensureRole("ROLE_RECLUTADOR");
        ensureRole("ROLE_ADMIN");

        if (!reclutadorRepository.existsByEmail(adminEmail)) {
            Reclutador adminDefault = new Reclutador();
            adminDefault.setUsername("admin_empresa");
            adminDefault.setEmail(adminEmail);
            adminDefault.setPassword(passwordEncoder.encode(adminPassword)); 
            adminDefault.setEmpresa("Bolsa de Empleo Global Corp");
            adminDefault.setNombres("Administrador");
            adminDefault.setApellidos("General"); 
            
            reclutadorRepository.save(adminDefault);
            System.out.println(">>>> DataSeeder: Cuenta de Reclutador administrativo inicializada con éxito.");
        }
    }

    private void ensureRole(String roleName) {
    }
}
