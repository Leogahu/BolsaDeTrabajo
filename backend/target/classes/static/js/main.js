const ROUTES = {
  landing: 'landingpage.html',
  login: 'login.html',
  cregistro: 'main/Candidatos/Cregister.html',
  rregistro: 'main/Reclutador/Rregistro.html',
  cdashboard: 'main/Candidatos/Cdashboard.html',
  rdashboard: 'main/Reclutador/Rdashboard.html',
  cvacantes: 'main/Candidatos/Cvacantes.html',
  cpostulaciones: 'main/Candidatos/Cpostulaciones.html',
  chabilidades: 'main/Candidatos/Chabilidades.html',
  cperfil: 'main/Candidatos/Cperfil.html',
  calertas: 'main/Candidatos/Calertas.html',
  centrevistas: 'main/Candidatos/Centrevistas.html',
  cexplorar: 'main/Candidatos/Cexplorar.html',
  cdetalles: 'main/Candidatos/Cdetalles.html',
  ceditarPerfil: 'main/Candidatos/CeditarPerfil.html',
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
        userType: type,
        user: {
            id: userData.id,
            nombreCompleto: userData.nombreCompleto,
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
        const response = await fetch('/api/auth/login', {
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
    };
    console.log("Enviando datos de registro:", postanteData);
    try {
        const response = await fetch('/api/auth/postante/register', {
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
        const response = await fetch('/api/reclutadores/register', {
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
        const response = await fetch('/api/postulaciones', {
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
    if (session && session.isLogged) {
        const title = document.getElementById('welcome-title');
        if (title) title.textContent = `¡Hola, ${session.user.nombreCompleto}`;
        
        const avatar = document.getElementById('user-avatar');
        if (avatar) avatar.src = `https://ui-avatars.com/api/?name=${session.user.nombreCompleto}&background=0052EA&color=fff`;
    }

    const setup = (triggerId, menuId) => {
        const trigger = document.getElementById(triggerId);
        const menu = document.getElementById(menuId);
        if (trigger && menu) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m.id !== menuId) m.classList.remove('show');
                });
                menu.classList.toggle('show');
            });

            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
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

let currentStep = 1;
let isPublishing = false;

document.addEventListener('DOMContentLoaded', () => {
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
        const tp = document.getElementById('tipoPuesto').value;
        const u = document.getElementById('ubicacion').value;
        if (!t || !tp || !u) { 
            alert("Por favor, completa el título, tipo de puesto y la ubicación."); 
            return false; 
        }
    }
    if (step === 2) {
        const d = document.getElementById('descripcion').value;
        const r = document.getElementById('requisitos').value;
        if (!d || !r) {
            alert("Por favor, completa la descripción y los requisitos del puesto.");
            return false;
        }
    }
    if (step === 3) {
        const m = document.getElementById('tipoModalidad').value;
        const sMin = document.getElementById('salarioMinimo').value;
        const sMax = document.getElementById('salarioMaximo').value;
        if (!m || !sMin || !sMax) {
            alert("Por favor, selecciona la modalidad e ingresa los rangos salariales.");
            return false;
        }
        if (parseFloat(sMin) > parseFloat(sMax)) {
            alert("El salario mínimo no puede ser mayor que el salario máximo.");
            return false;
        }
    }
    return true;
}

function prepararRevision() {
    const resumen = document.getElementById('resumenFinal');
    if (resumen) {
        resumen.innerHTML = `
            <div class="review-item"><strong>Título del Puesto:</strong> ${document.getElementById('titulo').value}</div>
            <div class="review-item"><strong>Tipo de Puesto:</strong> ${document.getElementById('tipoPuesto').value}</div>
            <div class="review-item"><strong>Ubicación:</strong> ${document.getElementById('ubicacion').value}</div>
            <div class="review-item"><strong>Modalidad:</strong> ${document.getElementById('tipoModalidad').value}</div>
            <div class="review-item"><strong>Rango Salarial:</strong> S/ ${parseFloat(document.getElementById('salarioMinimo').value).toFixed(2)} - S/ ${parseFloat(document.getElementById('salarioMaximo').value).toFixed(2)}</div>
            <div class="review-item"><strong>Descripción:</strong> ${document.getElementById('descripcion').value.substring(0, 120)}...</div>
            <div class="review-item"><strong>Requisitos:</strong> ${document.getElementById('requisitos').value.substring(0, 120)}...</div>
        `;
    }
}

async function ejecutarPublicacion() {
    if (isPublishing) return; 

    const session = JSON.parse(localStorage.getItem('userSession'));
    const editId = localStorage.getItem('editPostulacionId'); 

    if (!session || !session.user) {
        alert("Sesión no encontrada. Inicia sesión nuevamente.");
        return;
    }

    const btn = document.getElementById('btnPublicar');
    
    const ofertaData = {
        titulo: document.getElementById('titulo').value,
        tipoPuesto: document.getElementById('tipoPuesto').value,
        ubicacion: document.getElementById('ubicacion').value,
        descripcion: document.getElementById('descripcion').value,
        requisitos: document.getElementById('requisitos').value,
        tipoModalidad: document.getElementById('tipoModalidad').value,
        salarioMinimo: parseFloat(document.getElementById('salarioMinimo').value),
        salarioMaximo: parseFloat(document.getElementById('salarioMaximo').value),
        fechaPublicacion: new Date().toISOString()
    };

    const url = editId 
        ? `/api/postulaciones/${editId}` 
        : `/api/reclutadores/${session.user.id}/postulaciones`;
    
    const metodo = editId ? 'PUT' : 'POST'; 

    try {
        isPublishing = true;
        if (btn) {
            btn.disabled = true;
            btn.textContent = editId ? "Guardando cambios..." : "Publicando...";
        }

        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ofertaData)
        });

        if (response.ok) {
            localStorage.removeItem('editPostulacionId');
            window.location.href = 'Rvacantes.html';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error en el servidor");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error: " + error.message);
        isPublishing = false; 
        if (btn) {
            btn.disabled = false;
            btn.textContent = editId ? "Guardar Cambios" : "Publicar Empleo";
        }
    }
}

async function cargarMisOfertas() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    const container = document.getElementById('mis-ofertas-container');
    if (!session || !container) return;

    try {
        const response = await fetch(`/api/reclutadores/${session.user.id}/postulaciones`);
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

function verPostulantes(id) {
    localStorage.setItem('viewJobId', id);
    window.location.href = ROUTES.rgestion; 
}

let idAEliminar = null; 

function eliminarVacante(id) {
    idAEliminar = id; 
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'flex'; 
}
document.addEventListener('DOMContentLoaded', () => {
    const btnConfirmar = document.getElementById('confirmDelete');
    const btnCancelar = document.getElementById('cancelDelete');
    const modal = document.getElementById('deleteModal');

    btnCancelar.onclick = () => {
        modal.style.display = 'none';
        idAEliminar = null;
    };
    btnConfirmar.onclick = async () => {
        if (!idAEliminar) return;

        try {
            const response = await fetch(`/api/postulaciones/${idAEliminar}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                modal.style.display = 'none'; 
                cargarVacantesReclutador();   
            } else {
                alert("Error al eliminar");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            idAEliminar = null;
        }
    };
});
function editarVacante(id) {
    localStorage.setItem('editPostulacionId', id);
    window.location.href = 'RpubOferta.html'; 
}
function filtrarVacantes(estado) {
    const cards = document.querySelectorAll('.job-card');
    cards.forEach(card => {
        const statusText = card.querySelector('.status-badge').textContent.trim().toLowerCase();
        if (estado === 'all' || statusText === estado) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
function irAPublicar() {
    localStorage.removeItem('editPostulacionId');
    window.location.href = 'RpubOferta.html';
}
document.getElementById('filterActive')?.addEventListener('click', () => filtrarVacantes('activa'));
document.getElementById('filterAll')?.addEventListener('click', () => filtrarVacantes('all'));

document.addEventListener('DOMContentLoaded', async () => {
    const editId = localStorage.getItem('editPostulacionId');
    
    if (editId) {
        const titleElement = document.querySelector('.page-title');
        if (titleElement) titleElement.textContent = "Editar Vacante";
        
        try {
            const response = await fetch(`/api/postulaciones/${editId}`);
            const data = await response.json();
            
            if(document.getElementById('titulo')) document.getElementById('titulo').value = data.titulo;
            if(document.getElementById('ubicacion')) document.getElementById('ubicacion').value = data.ubicacion;
            if(document.getElementById('descripcion')) document.getElementById('descripcion').value = data.descripcion;
            if(document.getElementById('requisitos')) document.getElementById('requisitos').value = data.requisitos;
            if(document.getElementById('tipoPuesto')) document.getElementById('tipoPuesto').value = data.tipoPuesto;
            if(document.getElementById('tipoModalidad')) document.getElementById('tipoModalidad').value = data.tipoModalidad;
            if(document.getElementById('salarioMinimo')) document.getElementById('salarioMinimo').value = data.salarioMinimo;
            if(document.getElementById('salarioMaximo')) document.getElementById('salarioMaximo').value = data.salarioMaximo;
        } catch (error) {
            console.error("Error cargando datos para editar:", error);
        }
    }
});


let currentPage = 0;
const JOBS_PER_PAGE = 16;

// Estructuras de control globales
let todasLasVacantesDescargadas = []; 
let filtrosSeleccionados = {
    tipoPuesto: [],  // Ej: ['Empleo Junior', 'Practicas Profesionales']
    modalidad: []    // Ej: ['Presencial']
};
let palabraBusqueda = "";

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('opportunities-grid')) {
        cargarEmpleos();
        configurarEventosFiltros();
        
        const btnLoadMore = document.getElementById('btnLoadMore');
        if (btnLoadMore) {
            btnLoadMore.onclick = () => {
                currentPage++;
                cargarEmpleos();
            };
        }
    }
});

function verDetailVacante(id) {
    localStorage.setItem('selectedJobId', id);
    window.location.href = 'Cvacantes.html';
}

// 1. Configuración de Listeners para Tags y Barra de Búsqueda
function configurarEventosFiltros() {
    // Evento para los Tags de Filtro
    const tags = document.querySelectorAll('.filter-tag');
    tags.forEach(tag => {
        tag.style.cursor = 'pointer'; // Asegurar feedback visual
        
        tag.addEventListener('click', () => {
            const tipo = tag.getAttribute('data-filter-type');
            const valor = tag.getAttribute('data-value');
            
            // Alternar estado en la estructura de datos
            if (filtrosSeleccionados[tipo].includes(valor)) {
                filtrosSeleccionados[tipo] = filtrosSeleccionados[tipo].filter(v => v !== valor);
                // Restaurar estilo visual apagado
                tag.style.background = '';
                tag.style.color = '';
                tag.style.borderColor = '';
            } else {
                filtrosSeleccionados[tipo].push(valor);
                // Aplicar estilo visual encendido (azul corporativo de ChapaTuChamba)
                tag.style.background = '#2563EB';
                tag.style.color = '#FFFFFF';
                tag.style.borderColor = '#2563EB';
            }
            
            // Ejecutar el motor de filtrado
            aplicarFiltrosYBusqueda();
        });
    });

    // Evento para el Botón Buscar
    const btnSearch = document.getElementById('btn-search');
    const inputSearch = document.getElementById('search-input');
    
    if (btnSearch && inputSearch) {
        btnSearch.addEventListener('click', () => {
            palabraBusqueda = inputSearch.value.trim().toLowerCase();
            aplicarFiltrosYBusqueda();
        });

        // Soporte para ejecutar la búsqueda al pulsar la tecla "Enter"
        inputSearch.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                palabraBusqueda = inputSearch.value.trim().toLowerCase();
                aplicarFiltrosYBusqueda();
            }
        });
    }
}

// 2. Carga Inicial y Paginación desde la API de Postulaciones
async function cargarEmpleos() {
    const btnLoadMore = document.getElementById('btnLoadMore');

    try {
        const response = await fetch(`/api/postulaciones?page=${currentPage}&size=${JOBS_PER_PAGE}`);
        if (!response.ok) throw new Error("Error cargando los empleos");
        
        const data = await response.json(); 
        const nuevosEmpleos = data.content;

        // Concatenamos las nuevas vacantes al repositorio global en memoria
        todasLasVacantesDescargadas = todasLasVacantesDescargadas.concat(nuevosEmpleos);

        // Control del botón de cargar más
        if (btnLoadMore) {
            btnLoadMore.style.display = data.last ? 'none' : 'block';
        }

        // Renderizamos procesando los filtros activos actuales
        aplicarFiltrosYBusqueda();

    } catch (error) {
        console.error("Error al procesar la carga:", error);
    }
}

// 3. El Motor de Filtrado Multicriterio (Puesto + Modalidad + Búsqueda de Texto)
function aplicarFiltrosYBusqueda() {
    const grid = document.getElementById('opportunities-grid');
    
    // Filtrar el gran arreglo en memoria basándonos en las reglas elegidas
    const vacantesFiltradas = todasLasVacantesDescargadas.filter(empleo => {
        
        // Regla A: Coincidencia de Texto (Título)
        const tituloMatch = palabraBusqueda === "" || 
                            (empleo.titulo && empleo.titulo.toLowerCase().includes(palabraBusqueda));
        
        // Regla B: Coincidencia de Tipo de Puesto (Si no hay selección, pasan todos)
        const tipoPuestoActual = empleo.tipo_puesto || empleo.tipoPuesto || "";
        const puestoMatch = filtrosSeleccionados.tipoPuesto.length === 0 || 
                            filtrosSeleccionados.tipoPuesto.includes(tipoPuestoActual);
                            
        // Regla C: Coincidencia de Modalidad (Si no hay selección, pasan todos)
        const modalidadActual = empleo.tipo_modalidad || empleo.tipoModalidad || "";
        const modalidadMatch = filtrosSeleccionados.modalidad.length === 0 || 
                               filtrosSeleccionados.modalidad.includes(modalidadActual);

        // El registro debe cumplir obligatoriamente las tres condiciones concurrentes
        return tituloMatch && puestoMatch && modalidadMatch;
    });

    // 4. Renderizado del resultado filtrado
    if (vacantesFiltradas.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748B; padding: 20px;">No se encontraron vacantes con los criterios seleccionados.</p>';
        return;
    }

    const htmlCards = vacantesFiltradas.map(empleo => {
        const nombreEmpresa = empleo.empresa?.nombre || empleo.nombreEmpresa || "Empresa Aliada";
        const inicialesLogo = nombreEmpresa.substring(0, 2).toUpperCase();

        const sueldoMin = empleo.sueldoMin || empleo.sueldo_min;
        const sueldoMax = empleo.sueldoMax || empleo.sueldo_max;
        let textoSueldo = "Consultar";

        if (sueldoMin && sueldoMax) {
            textoSueldo = `S/. ${sueldoMin} - S/. ${sueldoMax}`;
        } else if (sueldoMin || sueldoMax) {
            textoSueldo = `S/. ${sueldoMin || sueldoMax}`;
        }

        const modalidad = empleo.tipo_modalidad || empleo.tipoModalidad || "No especificado";

        return `
            <div class="job-card" onclick="verDetailVacante(${empleo.id})" style="cursor: pointer;">
                <div class="bookmark-icon">🔖</div>
                <div class="company-logo" style="background: #0052EA; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px;">
                    ${inicialesLogo}
                </div>
                <div class="job-badge" style="background: #E0FFF9; color: #00D1B2;">Junior Real</div>
                <div class="job-title" title="${empleo.titulo}">${empleo.titulo}</div>
                <div class="company-name">${nombreEmpresa}</div>
                <div class="job-meta" style="display: flex; flex-wrap: wrap; gap: 8px;">
                    <span>📍 ${empleo.ubicacion || 'Perú'}</span>
                    <span>💻 ${modalidad}</span>
                    <span>💵 ${textoSueldo}</span>
                </div>
            </div>
        `;
    }).join('');

    grid.innerHTML = htmlCards;
}

function verDetalleVacante(id) {
    localStorage.setItem('selectedJobId', id);
    window.location.href = 'Cvacantes.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('jobs-grid')) {
        cargarVacantesReclutador();
    }
});

async function cargarVacantesReclutador() {
    const grid = document.getElementById('jobs-grid');
    const session = JSON.parse(localStorage.getItem('userSession'));

    if (!session || !session.user) return;

    try {
        const response = await fetch(`/api/reclutadores/${session.user.id}/postulaciones`);
        const vacantes = await response.json();
        
        let htmlContent = `
            <div class="promo-card">
                <div class="promo-card-bg"></div>
                <div style="position: relative; z-index: 2;">
                    <div style="font-size: 13px; font-weight: 600; opacity: 0.8;">Total Vacantes</div>
                    <div style="font-size: 42px; font-weight: 800;">${vacantes.length}</div>
                    <div style="font-size: 13px; opacity: 0.9;">Procesos activos actualmente</div>
                    <div class="promo-link" onclick="window.location.href='Rdashboard.html'">Ver Dashboard →</div>
                </div>
            </div>
        `;
        
        const vacantesHtml = vacantes.map(v => {
            const fecha = v.fechaPublicacion ? new Date(v.fechaPublicacion).toLocaleDateString() : 'Reciente';
            
            return `
            <div class="job-card">
                <div class="job-card-border" style="background: #2563EB;"></div>
                
                <div class="job-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; position: relative;">
                    <div style="flex: 1; min-width: 0;" onclick="verDetalleVacante(${v.id})" style="cursor:pointer;"> 
                        <div class="job-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 16px; font-weight: 700;">
                            ${v.titulo}
                        </div>
                        <div class="badge-group" style="margin-top: 4px;">
                            <span class="badge badge-junior-real">JUNIOR REAL</span>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0;">
                        <div class="status-badge status-active" style="margin: 0; white-space: nowrap;">
                            <span style="width: 8px; height: 8px; background: #22C55E; border-radius: 50%;"></span>
                            Activa
                        </div>
                        <div class="card-actions-inline" style="display: flex; gap: 4px;">
                            <button class="card-action-btn" onclick="editarVacante(${v.id})" title="Editar">✎</button>
                            <button class="card-action-btn" onclick="eliminarVacante(${v.id})" title="Eliminar">🗑️</button>
                        </div>
                    </div>
                </div>

                <div class="metrics-row" style="margin-top: 15px;">
                    <div class="metric">
                        <span class="metric-label">PUBLICADO</span>
                        <span class="metric-value">${fecha}</span>
                    </div>
                    <div class="metric" onclick="verDetalleVacante(${v.id})" style="cursor:pointer">
                        <span class="metric-label">POSTULANTES</span>
                        <span class="metric-value metric-highlight">${v.candidatos?.length || 0} perfiles →</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">UBICACIÓN</span>
                        <span class="metric-value">${v.ubicacion}</span>
                    </div>
                </div>
            </div>`;
        }).join('');
        
        const boostCard = `
            <div class="boost-card">
                <div class="boost-icon">⚡</div>
                <div class="boost-title">¿Necesitas contratar rápido?</div>
                <div class="boost-btn">Impulsar Vacante</div>
            </div>
        `;

        grid.innerHTML = htmlContent + vacantesHtml + boostCard;

    } catch (error) {
        console.error("Error al cargar vacantes:", error);
        grid.innerHTML = "<p>Error al conectar con el servidor.</p>";
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('det-titulo')) {
        cargarDetalleVacante();
    }
});

async function cargarDetalleVacante() {
    const jobId = localStorage.getItem('selectedJobId');
    if (!jobId) {
        console.warn("No se encontró 'selectedJobId' en el localStorage.");
        document.getElementById('det-titulo').innerText = "Vacante no especificada";
        return;
    }

    try {
        const response = await fetch(`/api/postulaciones/${jobId}`);
        if (!response.ok) throw new Error("Error en la respuesta del servidor");
        
        const empleo = await response.json();

        document.getElementById('det-titulo').innerText = empleo.titulo || "Título no disponible";
        document.getElementById('det-ubicacion').innerText = empleo.ubicacion || "No especificada";
        document.getElementById('det-fecha').innerText = empleo.fechaPublicacion 
            ? new Date(empleo.fechaPublicacion).toLocaleDateString() 
            : 'Reciente';

        if (document.getElementById('det-modalidad')) {
            document.getElementById('det-modalidad').innerText = empleo.tipo_modalidad || empleo.modalidad || "No especificado";
        }
        if (document.getElementById('det-tipo-puesto')) {
            document.getElementById('det-tipo-puesto').innerText = empleo.tipo_puesto || empleo.tipoPuesto || "Full-time";
        }
        
        if (document.getElementById('det-sueldo')) {
            const sueldoMin = empleo.sueldo_min || empleo.sueldoMin;
            const sueldoMax = empleo.sueldo_max || empleo.sueldoMax;
            
            if (sueldoMin && sueldoMax) {
                document.getElementById('det-sueldo').innerText = `S/. ${sueldoMin} - S/. ${sueldoMax}`;
            } else if (sueldoMin || sueldoMax) {
                document.getElementById('det-sueldo').innerText = `S/. ${sueldoMin || sueldoMax}`;
            } else {
                document.getElementById('det-sueldo').innerText = "Sueldo no especificado";
            }
        }

        document.getElementById('det-descripcion').innerHTML = empleo.descripcion || "Sin descripción.";
        document.getElementById('det-requisitos').innerHTML = empleo.requisitos || "Sin requisitos especificados.";
        const nombreEmpresa = empleo.empresa?.nombre || empleo.nombreEmpresa || empleo.reclutador?.empresa || "Empresa Confidencial"; 
        document.getElementById('det-empresa').innerText = nombreEmpresa;
        
        const iniciales = nombreEmpresa.substring(0, 2).toUpperCase();
        document.getElementById('det-empresa-logo').innerText = iniciales;
        if (document.getElementById('det-vacantes-activas')) {
            document.getElementById('det-vacantes-activas').innerText = empleo.empresa?.totalVacantes || "1";
        }

        const btnPostular = document.getElementById('btnPostular');
        if (btnPostular) {
            btnPostular.onclick = () => ejecutarPostulacion(jobId);
        }

    } catch (error) {
        console.error("Error cargando detalles:", error);
        document.getElementById('det-titulo').innerText = "Error al cargar la vacante";
    }
}

async function ejecutarPostulacion(idVacante) {
    const session = JSON.parse(localStorage.getItem('userSession'));
    
    if (!session || !session.user) {
        alert('Debes iniciar sesión como candidato para poder postularte.');
        window.location.href = ROUTES.login;
        return;
    }

    try {
        const response = await fetch(`/api/vacantes/${idVacante}/postular`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ candidatoId: session.user.id })
        });

        if (response.ok) {
            alert('¡Te has postulado con éxito a esta vacante!');
        } else {
            const errData = await response.json();
            alert(`Hubo un problema: ${errData.message || 'No se pudo procesar la postulación.'}`);
        }
    } catch (error) {
        console.error("Error al postular:", error);
        alert('Error de conexión. Inténtalo más tarde.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('CeditarPerfil.html')) {
        cargarDatosPerfil();
        document.getElementById('btn-guardar-perfil').addEventListener('click', actualizarDatosPerfil);
    }
});

async function cargarDatosPerfil() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    if (!session || !session.user) return;

    try {
        const response = await fetch(`/api/candidatos/${session.user.id}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('input-nombres').value = data.nombres || '';
            document.getElementById('input-apellidos').value = data.apellidos || '';
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function actualizarDatosPerfil() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    const nuevosNombres = document.getElementById('input-nombres').value;
    const nuevosApellidos = document.getElementById('input-apellidos').value;

    try {
        const response = await fetch(`/api/candidatos/${session.user.id}/actualizar-datos`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombres: nuevosNombres,
                apellidos: nuevosApellidos
            })
        });

        if (response.ok) {
            alert("Perfil actualizado correctamente");
            
            session.user.nombres = nuevosNombres;
            session.user.apellidos = nuevosApellidos;
            localStorage.setItem('userSession', JSON.stringify(session));
        } else {
            alert("Error al actualizar");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}