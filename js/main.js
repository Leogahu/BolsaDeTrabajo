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

function setSession(userData, type) {
    const session = {
        isLogged: true,
        userType: type, // 'postante' o 'reclutador'
        user: {
            id: userData.id,
            nombreCompleto: userData.nombreCompleto, // Asegúrate que el backend envíe este campo
            email: userData.email,
            username: userData.username
        }
    };
    localStorage.setItem('userSession', JSON.stringify(session));
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

function handleLogout() {
    logout();
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
    if (event) event.preventDefault();

    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('contrasena');
    const errorMsg = document.getElementById('error-message');

    [emailInput, passInput].forEach(input => input.style.borderColor = 'var(--border-color)');
    errorMsg.style.display = 'none';

    const loginData = { 
        username: emailInput.value, 
        password: passInput.value 
    };

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const userData = await response.json();
            setSession(userData, userData.tipo);
            window.location.href = userData.tipo === 'reclutador' ? ROUTES.rdashboard : ROUTES.cdashboard;
        } else {
            emailInput.style.borderColor = '#dc2626';
            passInput.style.borderColor = '#dc2626';
            errorMsg.style.display = 'block';
            errorMsg.textContent = "Credenciales incorrectas. Verifica tu correo y contraseña.";
        }
    } catch (error) {
        console.error('Error:', error);
        errorMsg.style.display = 'block';
        errorMsg.textContent = "Error de conexión con el servidor.";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

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
            alert("Error: " + (error.error || "Datos invalidos"));
        }
    } catch (e) {
        console.error("Error de red:", e);
    }
}

async function handleRegisterReclutador(event) {
    if (event) event.preventDefault(); 
    
    const nombreCompleto = document.getElementById('nombreCompleto')?.value;
    const empresa = document.getElementById('empresa')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('contrasena')?.value;

    if (!nombreCompleto || !empresa || !email || !password) {
        alert('Por favor, completa todos los campos obligatorios');
        return;
    }

    const reclutadorData = {
        username: email,        
        password: password,
        nombreCompleto: nombreCompleto,
        email: email,
        empresa: empresa
    };

    try {
        const response = await fetch('http://localhost:8080/api/reclutadores/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reclutadorData)
        });

        if (response.ok) {
            window.location.href = '../../login.html';
        } else {
            const error = await response.json();
            alert('Error: ' + (error.error || 'No se pudo registrar'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor');
    }
}
// ============================================
// POSTULACIONES
// ============================================

async function applyToJob(jobId) {
    const session = getSession();

    if (!session.isLogged || session.userType !== 'postante') {
        alert('Debes iniciar sesion como postulante para aplicar');
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
        console.error('Error en la postulacion:', error);
        alert('Error de conexion con el servidor');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const companyForm = document.getElementById('companyRegisterForm');
    if (companyForm) {
        companyForm.addEventListener('submit', handleRegisterReclutador);
    }
    const btnAplicar = document.getElementById('btn-aplicar');
    if (btnAplicar) {
        btnAplicar.addEventListener('click', function() {
            const ofertaId = this.getAttribute('data-oferta-id') || '1';
            applyToJob(ofertaId);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('userSession'));

    if (session.isLogged) {
        const title = document.getElementById('welcome-title');
        if (title) title.textContent = `¡Hola, ${session.user.nombreCompleto}`;
        
        const avatar = document.getElementById('user-avatar');
        if (avatar) avatar.src = `https://ui-avatars.com/api/?name=${session.user.nombreCompleto}&background=0052EA&color=fff`;
    }

    const setup = (triggerId, menuId) => {
        const trigger = document.getElementById(triggerId);
        const menu = document.getElementById(menuId);
        if (trigger && menu) {
            trigger.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m.id !== menuId) m.classList.remove('show');
                });
                menu.classList.toggle('show');
            };
        }
    };

    setup('notif-trigger', 'notif-dropdown');
    setup('msg-trigger', 'msg-dropdown');
    setup('profile-trigger', 'profile-dropdown');

    window.onclick = () => {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    };
});

function removeNotif(btn) {
    const list = document.getElementById('notif-list');
    const dot = document.getElementById('notif-dot');
    btn.closest('li').remove();

    if (list.children.length === 0) {
        list.innerHTML = '<p style="font-size:12px; color:#94A3B8; text-align:center;">Sin notificaciones</p>';
        if (dot) dot.style.display = 'none';
    }
}


// 1. VARIABLES DE ESTADO GLOBALES
let currentStep = 1;
let isPublishing = false;

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos
    const btnNext = document.getElementById('btnNext');
    const btnBack = document.getElementById('btnBack');
    const btnPublicar = document.getElementById('btnPublicar');
    if (btnNext) {
        btnNext.onclick = (e) => {
            e.preventDefault();
            if (validarPaso(currentStep)) {
                avanzarPaso();
            }
        };
    }

    if (btnBack) {
        btnBack.onclick = (e) => {
            e.preventDefault();
            retrocederPaso();
        };
    }

    if (btnPublicar) {
        btnPublicar.onclick = (e) => {
            e.preventDefault();
            ejecutarPublicacion();
        };
    }

    if (document.getElementById('mis-ofertas-container')) {
        cargarMisOfertas();
    }
});

function avanzarPaso() {
    if (currentStep < 4) {
        document.getElementById(`step${currentStep}`).style.display = 'none';
        
        const stepIndicator = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (stepIndicator) {
            stepIndicator.classList.remove('active');
            stepIndicator.classList.add('completed');
            stepIndicator.querySelector('.step-circle').innerHTML = '✓';
        }

        currentStep++;

        document.getElementById(`step${currentStep}`).style.display = 'block';
        const nextIndicator = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (nextIndicator) nextIndicator.classList.add('active');

        actualizarBotonesNavegacion();
        if (currentStep === 4) prepararRevision();
    }
}

function retrocederPaso() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).style.display = 'none';
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');

        currentStep--;

        document.getElementById(`step${currentStep}`).style.display = 'block';
        const prevIndicator = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (prevIndicator) {
            prevIndicator.classList.remove('completed');
            prevIndicator.classList.add('active');
            prevIndicator.querySelector('.step-circle').innerHTML = currentStep;
        }

        actualizarBotonesNavegacion();
    }
}

function actualizarBotonesNavegacion() {
    const btnBack = document.getElementById('btnBack');
    const btnNext = document.getElementById('btnNext');
    const btnPublicar = document.getElementById('btnPublicar');

    if (btnBack) btnBack.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    
    if (currentStep === 4) {
        if (btnNext) btnNext.style.display = 'none';
        if (btnPublicar) btnPublicar.style.display = 'block';
    } else {
        if (btnNext) btnNext.style.display = 'block';
        if (btnPublicar) btnPublicar.style.display = 'none';
    }
}

// --- LÓGICA DE NEGOCIO Y API ---

function validarPaso(step) {
    if (step === 1) {
        const t = document.getElementById('titulo').value;
        const u = document.getElementById('ubicacion').value;
        if (!t || !u) { 
            alert("Por favor, completa el título y la ubicación."); 
            return false; 
        }
    }
    return true;
}

function prepararRevision() {
    const resumen = document.getElementById('resumenFinal');
    if (resumen) {
        resumen.innerHTML = `
            <div class="review-item"><strong>Título:</strong> ${document.getElementById('titulo').value}</div>
            <div class="review-item"><strong>Ubicación:</strong> ${document.getElementById('ubicacion').value}</div>
            <div class="review-item"><strong>Descripción:</strong> ${document.getElementById('descripcion').value.substring(0, 150)}...</div>
        `;
    }
}

async function ejecutarPublicacion() {
    if (isPublishing) return; 

    const session = JSON.parse(localStorage.getItem('userSession'));
    if (!session || !session.user) {
        alert("Sesión no encontrada. Inicia sesión nuevamente.");
        return;
    }

    const btn = document.getElementById('btnPublicar');
    
    const ofertaData = {
        titulo: document.getElementById('titulo').value,
        descripcion: document.getElementById('descripcion').value,
        requisitos: document.getElementById('requisitos').value,
        ubicacion: document.getElementById('ubicacion').value,
        fechaPublicacion: new Date().toISOString()
    };

    try {
        isPublishing = true;
        if (btn) {
            btn.disabled = true;
            btn.textContent = "Publicando...";
        }

        const response = await fetch(`http://localhost:8080/api/reclutadores/${session.user.id}/postulaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ofertaData)
        });

        if (response.ok) {
            window.location.href = 'Rvacantes.html';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error en el servidor");
        }

    } catch (error) {
        console.error("Error al publicar:", error);
        alert("Hubo un error: " + error.message);
        isPublishing = false; 
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Publicar Empleo";
        }
    }
}

async function cargarMisOfertas() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    const container = document.getElementById('mis-ofertas-container');
    if (!session || !container) return;

    try {
        const response = await fetch(`http://localhost:8080/api/reclutadores/${session.user.id}/postulaciones`);
        const ofertas = await response.json();
        
        container.innerHTML = ofertas.map(oferta => `
            <div class="oferta-card">
                <h4>${oferta.titulo}</h4>
                <p>${oferta.ubicacion}</p>
                <div class="card-footer">
                    <span>Candidatos: ${oferta.candidatos?.length || 0}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error cargando ofertas:", error);
    }
}