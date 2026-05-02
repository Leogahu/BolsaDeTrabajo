// ChapaTuChamba - Sistema de Navegación y Funcionalidades
// NAVEGACIÓN PRINCIPAL

// Rutas de navegación
const ROUTES = {
  // Landing
  landing: 'ladingpage.html',
  login: 'login.html',
  
  // Registro
  cregistro: 'main/Candidatos/Cregister.html',
  rregistro: 'main/Reclutador/Rregistro.html',
  
  // Dashboards
  cdashboard: 'main/Candidatos/Cdashboard.html',
  rdashboard: 'main/Reclutador/Rdashboard.html',
  
  // Candidatos
  cvacantes: 'main/Candidatos/Cvacantes.html',
  cpostulaciones: 'main/Candidatos/Cpostulaciones.html',
  chabilidades: 'main/Candidatos/Chabilidades.html',
  cperfil: 'main/Candidatos/Cperfil.html',
  calertas: 'main/Candidatos/Calertas.html',
  centrevistas: 'main/Candidatos/Centrevistas.html',
  cexplorar: 'main/Candidatos/Cexplorar.html',
  cdetalles: 'main/Candidatos/Cdetalles.html',
  ceditarPerfil: 'main/Candidatos/CeditarPerfil.html',
  
  // Reclutador
  rvacantes: 'main/Reclutador/Rvacantes.html',
  rgestion: 'main/Reclutador/Rgestion.html',
  rpubOferta: 'main/Reclutador/RpubOferta.html',
  rfeedback: 'main/Reclutador/Rfeedback.html',
  rreportes: 'main/Reclutador/Rreportes.html',
  rportal: 'main/Reclutador/Rportal.html'
};

function navigateTo(page) {
    const target = page.startsWith('/') ? page : '/' + page;
    window.location.href = target;
}

function setSession(userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('userType', userData.tipo);
    localStorage.setItem('isLogged', 'true');
}

function getSession() {
    const user = localStorage.getItem('currentUser');
    return {
        isLogged: localStorage.getItem('isLogged') === 'true',
        userType: localStorage.getItem('userType'),
        user: user ? JSON.parse(user) : null
    };
}

function logout() {
    localStorage.clear();
    navigateTo(ROUTES.landing);
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initNavegacion();
    initFormularios();
    cargarDatosUsuario();
});

function cargarDatosUsuario() {
    const session = getSession();
    const nombreElemento = document.getElementById('user-name-display');
    
    if (session.isLogged && session.user && nombreElemento) {
        nombreElemento.textContent = session.user.nombreCompleto;
    }
}
function initNavegacion() {
    const btnBuscar = document.getElementById('btn-buscar');
    const btnReclutador = document.getElementById('btn-reclutador');
    
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => navigateTo(ROUTES.cregistro));
    }
    
    if (btnReclutador) {
        btnReclutador.addEventListener('click', () => navigateTo(ROUTES.rregistro));
    }
    
    const linkRegistro = document.getElementById('link-registro');
    if (linkRegistro) {
        linkRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.cregistro);
        });
    }
    
    const linkLogin = document.getElementById('link-login') || document.getElementById('btn-login-nav');
    if (linkLogin) {
        linkLogin.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.login);
        });
    }
    
    const btnEmpresa = document.getElementById('btn-empresa') || document.getElementById('toggle-cemp');
    if (btnEmpresa) {
        btnEmpresa.onclick = () => navigateTo(ROUTES.rregistro);
    }
    
    const btnSoyCandidato = document.getElementById('btn-soy-candidato') || document.getElementById('toggle-rcand');
    if (btnSoyCandidato) {
        btnSoyCandidato.onclick = () => navigateTo(ROUTES.cregistro);
    }

    const btnToggle = document.getElementById('togglePassword') || document.querySelector('.toggle-password');
    if (btnToggle) {
        btnToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('contrasena');
            if (passwordInput) {
                const isPassword = passwordInput.getAttribute('type') === 'password';
                passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
                this.textContent = isPassword ? 'visibility_off' : 'visibility';
                this.style.cursor = 'pointer';
                this.style.userSelect = 'none';
            }
        });
    }

    const sidebars = {
        'sidebar-candidato': ROUTES.cdashboard,
        'sidebar-oportunidades': ROUTES.cvacantes,
        'sidebar-postulaciones': ROUTES.cpostulaciones,
        'sidebar-pruebas': ROUTES.chabilidades,
        'sidebar-perfil': ROUTES.cperfil,
        'sidebar-alertas': ROUTES.calertas,
        'sidebar-simulador': ROUTES.centrevistas,
        'sidebar-cerrar': 'LOGOUT',
        'sidebar-inicio-r': ROUTES.rdashboard,
        'sidebar-vacantes': ROUTES.rvacantes,
        'sidebar-gestion': ROUTES.rgestion,
        'sidebar-publicar': ROUTES.rpubOferta,
        'sidebar-feedback': ROUTES.rfeedback,
        'sidebar-reportes': ROUTES.rreportes,
        'sidebar-empresa': ROUTES.rportal,
        'sidebar-cerrar-r': 'LOGOUT'
    };

    Object.entries(sidebars).forEach(([id, target]) => {
        initSidebar(id, target);
    });
}

function initSidebar(elementId, targetPage) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            if (targetPage === 'LOGOUT') {
                logout();
            } else {
                navigateTo(targetPage);
            }
        });
    }
}

// ============================================
// FORMULARIOS
// ============================================

function initFormularios() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Intentando login...");
        await handleLogin(e);
    });
}
    
    initToggleLogin();
    
    const cregForm = document.getElementById('cregistro-form');
    if (cregForm) {
        cregForm.addEventListener('submit', (e) => handleRegisterPostante(e));
    }
    
function initToggleCregister() {
    const btnEmpresa = document.getElementById('toggle-cemp');   
    if (btnEmpresa) {
        btnEmpresa.addEventListener('click', function() {
            window.location.href = ROUTES.rregistro; 
        });
    }
}
    
    initToggleRregister();
}

function initToggleLogin() {
    const btnPostulante = document.getElementById('toggle-postulante');
    const btnReclutador = document.getElementById('toggle-reclutador');
    
    if (btnPostulante && btnReclutador) {
        // Variable para rastrear el rol (puedes declararla fuera de la función)
        btnPostulante.addEventListener('click', () => {
            tipoUsuarioSeleccionado = 'postante'; // <--- AGREGAR ESTO
            setActive(btnPostulante, btnReclutador);
        });

        btnReclutador.addEventListener('click', () => {
            tipoUsuarioSeleccionado = 'reclutador'; // <--- AGREGAR ESTO
            setActive(btnReclutador, btnPostulante);
        });
    }
}

function initToggleCregister() {
    const btnEmpresa = document.getElementById('toggle-cemp');
    if (btnEmpresa) {
        btnEmpresa.addEventListener('click', () => {
            window.location.href = ROUTES.rregistro;
        });
    }
}

function initToggleRregister() {
    const btnCandidato = document.getElementById('toggle-rcand');
    if (btnCandidato) {
        btnCandidato.addEventListener('click', () => {
            window.location.href = ROUTES.cregistro;
        });
    }
}

function initToggleCregister() {
  const btnPostulante = document.getElementById('toggle-cpost');
  const btnEmpresa = document.getElementById('toggle-cemp');
  
  if (btnPostulante && btnEmpresa) {
    btnPostulante.addEventListener('click', function() {
      btnPostulante.classList.add('active');
      btnEmpresa.classList.remove('active');
    });
    
    btnEmpresa.addEventListener('click', function() {
      btnEmpresa.classList.add('active');
      btnPostulante.classList.remove('active');
    });
  }
}

function initToggleRregister() {
  const btnCandidato = document.getElementById('toggle-rcand');
  const btnEmpresa = document.getElementById('toggle-remp');
  
  if (btnCandidato && btnEmpresa) {
    btnCandidato.addEventListener('click', function() {
      btnCandidato.classList.add('active');
      btnEmpresa.classList.remove('active');
    });
    
    btnEmpresa.addEventListener('click', function() {
      btnEmpresa.classList.add('active');
      btnCandidato.classList.remove('active');
    });
  }
}

// ============================================
// HANDLERS
// ============================================

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error inesperado en el servidor');
    }
    return response.json();
}

async function handleLogin(event) {
    event.preventDefault();

    const credentials = {
        // Asegúrate de que los IDs coincidan con tu login.html ("email" y "password")[cite: 12]
        username: document.getElementById('email').value, 
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            const user = await response.json();
            // Usamos la función setSession que ya existe en tu main_6.js
            setSession(user); 
            
            // Redirección dinámica según el tipo que devuelve el servidor[cite: 7]
            if (user.tipo === 'postante') {
                window.location.href = ROUTES.cdashboard; // Usa el objeto ROUTES[cite: 13]
            } else {
                window.location.href = ROUTES.rdashboard;
            }
        } else {
            const errorData = await response.json();
            alert(errorData.error || "Credenciales incorrectas");
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
    }
}

async function handleRegisterPostante(event) {
    event.preventDefault();

    const postanteData = {
        // El modelo Postante requiere username, email, nombre y password
        username: document.getElementById('email').value, 
        nombreCompleto: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('contrasena').value,
        // Agrega valores por defecto si no tienes estos campos en el HTML[cite: 8]
        telefono: "No proporcionado",
        carrera: "No proporcionada"
    };

    try {
        const response = await fetch('http://localhost:8080/api/auth/postante/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postanteData)
        });

        if (response.ok) {
            alert("¡Registro exitoso!");
            window.location.href = 'login.html';
        } else {
            const error = await response.json();
            alert("Error: " + (error.error || "Datos inválidos"));
        }
    } catch (e) {
        console.error("Error de red:", e);
    }
}

async function handleRegisterReclutador(event) {
    if (event) event.preventDefault();
    
    const name = document.getElementById('nombre')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('contrasena')?.value;
    const empresa = document.getElementById('empresa')?.value || 'Empresa Individual';

    if (!name || !email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }

    const reclutadorData = {
        nombreCompleto: name,
        email: email,
        username: email,
        password: password,
        empresa: empresa
    };

    try {
        const response = await fetch('http://localhost:8080/api/auth/reclutador/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reclutadorData)
        });

        if (response.ok) {
            alert('¡Registro de empresa exitoso!');
            navigateTo(ROUTES.login);
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de red al intentar registrar');
    }
}
// ============================================
// POSTULACIONES
// ============================================

async function applyToJob(jobId) {
    const session = getSession();

    if (!session.isLogged || session.userType !== 'postante') {
        alert('Debes iniciar sesión como postulante para aplicar');
        navigateTo(ROUTES.login);
        return;
    }

    const postulacionData = {
        postante: { id: session.user.id },
        oferta: { id: jobId },
        fechaPostulacion: new Date().toISOString().split('T')[0],
        estado: 'PENDIENTE'
    };

    try {
        const response = await fetch('http://localhost:8080/api/postulaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postulacionData)
        });

        if (response.ok) {
            alert('¡Te has postulado correctamente!');
            navigateTo(ROUTES.cpostulaciones);
        } else {
            const error = await response.json();
            alert('Error al postular: ' + (error.message || 'Intenta de nuevo'));
        }
    } catch (error) {
        console.error('Error en la postulación:', error);
        alert('Error de conexión con el servidor');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const btnAplicar = document.getElementById('btn-aplicar');
    if (btnAplicar) {
        btnAplicar.addEventListener('click', function() {
            const ofertaId = this.getAttribute('data-oferta-id') || '1';
            applyToJob(ofertaId);
        });
    }
});