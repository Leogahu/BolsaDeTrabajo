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
    initToggleRegistroUnificado();
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
                this.textContent = isPassword ? 'visibility' : 'visibility_off';
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
    
}

function initToggleLogin() {
    const btnPostulante = document.getElementById('toggle-postulante');
    const btnReclutador = document.getElementById('toggle-reclutador');
    
    if (btnPostulante && btnReclutador) {
        btnPostulante.addEventListener('click', () => {
            tipoUsuarioSeleccionado = 'postante';
            setActive(btnPostulante, btnReclutador);
        });

        btnReclutador.addEventListener('click', () => {
            tipoUsuarioSeleccionado = 'reclutador'; 
            setActive(btnReclutador, btnPostulante);
        });
    }
}

function initToggleRegistroUnificado() {
    const btnC_Postulante = document.getElementById('toggle-cpost'); 
    const btnC_Empresa = document.getElementById('toggle-cemp');    
    const btnR_Candidato = document.getElementById('toggle-rcand'); 
    const btnR_Empresa = document.getElementById('toggle-remp');    

    if (btnC_Empresa) {
        btnC_Empresa.addEventListener('click', () => {
            window.location.href = '../Reclutador/Rregistro.html'; 
        });
    }

    if (btnR_Candidato) {
        btnR_Candidato.addEventListener('click', () => {
            window.location.href = '../Candidatos/Cregister.html'; 
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
   
    const errorDiv = document.getElementById('error-message');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('contrasena');

    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }

    const credentials = {
        username: emailInput.value, 
        password: passwordInput.value
    };

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            const user = await response.json();
            setSession(user); 
            
            if (user.tipo === 'postante') {
                window.location.href = ROUTES.cdashboard;
            } else {
                window.location.href = ROUTES.rdashboard;
            }
        } else {
            const errorData = await response.json();
            if (errorDiv) {
                errorDiv.textContent = errorData.error || "Usuario o contraseña incorrectos";
                errorDiv.style.display = 'block';
                
                emailInput.style.outline = '2px solid #DC2626';
                passwordInput.style.outline = '2px solid #DC2626';
            }
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
        if (errorDiv) {
            errorDiv.textContent = "Error de conexión con el servidor";
            errorDiv.style.display = 'block';
        }
    }
}

async function handleRegisterPostante(event) {
    event.preventDefault();

    const postanteData = {
        username: document.getElementById('username').value, 
        nombreCompleto: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('contrasena').value,
        telefono: "NP",
        carrera: "NP"
    };
    console.log("Enviando datos de registro:", postanteData);
    try {
        const response = await fetch('http://localhost:8080/api/auth/postante/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postanteData)
        });

        if (response.ok) {
            window.location.href = '../../login.html';
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