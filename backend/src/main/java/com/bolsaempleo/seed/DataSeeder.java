package com.bolsaempleo.seed;

import com.bolsaempleo.model.Postante;
import com.bolsaempleo.model.Postulacion;
import com.bolsaempleo.model.Reclutador;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.repository.PostulacionRepository;
import com.bolsaempleo.repository.ReclutadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final ReclutadorRepository reclutadorRepository;
    private final PostanteRepository postanteRepository;
    private final PostulacionRepository postulacionRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${APP_ADMIN_EMAIL:admin@bolsaempleo.com}")
    private String adminEmail;

    @Value("${APP_ADMIN_PASSWORD:AdminSecure123*}")
    private String adminPassword;

    @Value("${APP_DEMO_POSTANTE_EMAIL:candidato@demo.com}")
    private String demoPostanteEmail;

    @Value("${APP_DEMO_RECLUTADOR_EMAIL:reclutador@demo.com}")
    private String demoReclutadorEmail;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void run(ApplicationArguments args) {
        Reclutador admin = ensureReclutador(
            "admin_empresa", adminEmail, "Administrador", "General",
            "Bolsa de Empleo Global Corp", adminPassword
        );

        Reclutador demoReclutador = ensureReclutador(
            "reclutador_demo", demoReclutadorEmail, "María", "García",
            "TechNova Perú", "Demo1234*"
        );

        ensurePostante(
            "candidato_demo", demoPostanteEmail, "Carlos", "Ruiz",
            "Ingeniería de Software", "UTP", "Demo1234*"
        );

        if (postulacionRepository.count() == 0) {
            Postulacion vacante = new Postulacion();
            vacante.setTitulo("Desarrollador Frontend Junior");
            vacante.setDescripcion("Buscamos talento junior con Angular y ganas de aprender.");
            vacante.setRequisitos("Conocimientos básicos de HTML, CSS, JavaScript y Angular.");
            vacante.setUbicacion("Lima");
            vacante.setTipoModalidad("Remoto");
            vacante.setTipoPuesto("Tiempo completo");
            vacante.setSalarioMinimo(1800.0);
            vacante.setSalarioMaximo(2800.0);
            vacante.setReclutador(demoReclutador != null ? demoReclutador : admin);
            vacante.setFechaPublicacion(LocalDateTime.now());
            postulacionRepository.save(vacante);
            System.out.println(">>>> DataSeeder: Vacante demo publicada.");
        }
    }

    private Reclutador ensureReclutador(
            String username, String email, String nombres, String apellidos,
            String empresa, String password) {
        return reclutadorRepository.findByEmail(email).orElseGet(() -> {
            Reclutador r = new Reclutador();
            r.setUsername(username);
            r.setEmail(email);
            r.setPassword(passwordEncoder.encode(password));
            r.setEmpresa(empresa);
            r.setNombres(nombres);
            r.setApellidos(apellidos);
            r.setCargo("Reclutadora de talento");
            r.setSector("Tecnología");
            r.setDescripcion("Apasionada por conectar talento junior con oportunidades reales.");
            System.out.println(">>>> DataSeeder: Reclutador demo creado -> " + email);
            return reclutadorRepository.save(r);
        });
    }

    private void ensurePostante(
            String username, String email, String nombres, String apellidos,
            String carrera, String institucion, String password) {
        if (postanteRepository.existsByEmail(email)) return;

        Postante p = new Postante();
        p.setUsername(username);
        p.setEmail(email);
        p.setPassword(passwordEncoder.encode(password));
        p.setNombres(nombres);
        p.setApellidos(apellidos);
        p.setCarrera(carrera);
        p.setInstitucion(institucion);
        p.setEgresado(false);
        p.setDescripcion("Desarrollador en formación con interés en frontend y proyectos reales.");
        postanteRepository.save(p);
        System.out.println(">>>> DataSeeder: Postante demo creado -> " + email);
    }
}
