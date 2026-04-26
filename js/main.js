// ChapaTuChamba - Sistema de Navegación y Funcionalidades

// ============================================
// NAVEGACIÓN PRINCIPAL
// ============================================

// Rutas de navegación
const ROUTES = {
  // Landing
  landing: 'ladingpage.html',
  registro: 'registro.html',
  
  // Registro
  cregistro: '../Candidatos/Cregister.html',
  rregistro: '../Reclutador/Rregistro.html',
  
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

// Función para navegar
function navigateTo(page) {
  window.location.href = page;
}

// Guardar sesión
function setSession(userType) {
  localStorage.setItem('userType', userType);
  localStorage.setItem('isLogged', 'true');
}

// Obtener sesión
function getSession() {
  return {
    isLogged: localStorage.getItem('isLogged') === 'true',
    userType: localStorage.getItem('userType')
  };
}

// Cerrar sesión
function logout() {
  localStorage.removeItem('isLogged');
  localStorage.removeItem('userType');
  navigateTo(ROUTES.landing);
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initNavegacion();
  initFormularios();
});

function initNavegacion() {
  // Botones de navegación en landingpage
  const btnBuscar = document.getElementById('btn-buscar');
  const btnReclutador = document.getElementById('btn-reclutador');
  
  if (btnBuscar) {
    btnBuscar.addEventListener('click', function() {
      navigateTo(ROUTES.cregistro);
    });
  }
  
  if (btnReclutador) {
    btnReclutador.addEventListener('click', function() {
      navigateTo(ROUTES.rregistro);
    });
  }
  
  // Botones en registro.html
  const linkRegistro = document.getElementById('link-registro');
  if (linkRegistro) {
    linkRegistro.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo(ROUTES.cregistro);
    });
  }
  
  // Link login en Cregister
  const linkLogin = document.getElementById('link-login');
  if (linkLogin) {
    linkLogin.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo(ROUTES.registro);
    });
  }
  
  // Botón Empresa en Cregister
  const btnEmpresa = document.getElementById('btn-empresa');
  if (btnEmpresa) {
    btnEmpresa.addEventListener('click', function() {
      navigateTo(ROUTES.rregistro);
    });
  }
  
// Botón Iniciar Sesión en navbar
  const btnLogin = document.getElementById('btn-login-nav');
  if (btnLogin) {
    btnLogin.addEventListener('click', function() {
      navigateTo(ROUTES.registro);
    });
  }

  // Botón Soy Candidato en Rregistro
  const btnSoyCandidato = document.getElementById('btn-soy-candidato');
  if (btnSoyCandidato) {
    btnSoyCandidato.addEventListener('click', function() {
      navigateTo(ROUTES.cregistro);
    });
  }
};
  
  
  // Sidebar - Candidatos
  initSidebar('sidebar-candidato', ROUTES.cdashboard);
  initSidebar('sidebar-oportunidades', ROUTES.cvacantes);
  initSidebar('sidebar-postulaciones', ROUTES.cpostulaciones);
  initSidebar('sidebar-pruebas', ROUTES.chabilidades);
  initSidebar('sidebar-perfil', ROUTES.cperfil);
  initSidebar('sidebar-alertas', ROUTES.calertas);
  initSidebar('sidebar-simulador', ROUTES.centrevistas);
  initSidebar('sidebar-cerrar', ROUTES.landing);
  
  // Sidebar - Reclutador
  initSidebar('sidebar-inicio-r', ROUTES.rdashboard);
  initSidebar('sidebar-vacantes', ROUTES.rvacantes);
  initSidebar('sidebar-gestion', ROUTES.rgestion);
  initSidebar('sidebar-publicar', ROUTES.rpubOferta);
  initSidebar('sidebar-feedback', ROUTES.rfeedback);
  initSidebar('sidebar-reportes', ROUTES.rreportes);
  initSidebar('sidebar-empresa', ROUTES.rportal);
  initSidebar('sidebar-cerrar-r', ROUTES.landing);


function initSidebar(elementId, targetPage) {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      if (elementId === 'sidebar-cerrar' || elementId === 'sidebar-cerrar-r') {
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
  // Formulario de login en registro.html
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }
  
  // Toggle en registro.html
  initToggleLogin();
  
  // Formulario de registro candidato
  const cregForm = document.getElementById('cregistro-form');
  if (cregForm) {
    cregForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleRegister('candidato');
    });
  }
  
  // Toggle en Cregister
  initToggleCregister();
  
  // Formulario de registro reclutador
  const rregForm = document.getElementById('rregistro-form');
  if (rregForm) {
    rregForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleRegister('reclutador');
    });
  }
  
  // Toggle en Rregister
  initToggleRregister();
}

function initToggleLogin() {
  const btnPostulante = document.getElementById('toggle-postulante');
  const btnReclutador = document.getElementById('toggle-reclutador');
  
  if (btnPostulante && btnReclutador) {
    // Estilos iniciales
    btnPostulante.style.background = 'white';
    btnPostulante.style.boxShadow = '0px 1px 2px rgba(0, 0, 0, 0.05)';
    btnPostulant.style.color = '#0D1C2E';
    
    btnReclutador.style.background = 'transparent';
    btnReclutador.style.boxShadow = 'none';
    btnReclutador.style.color = '#434655';
    
    btnPostulante.addEventListener('click', function() {
      btnPostulant.classList.add('active');
      btnReclutador.classList.remove('active');
      
      btnPostulante.style.background = 'white';
      btnPostulante.style.boxShadow = '0px 1px 2px rgba(0, 0, 0, 0.05)';
      btnPostulant.style.color = '#0D1C2E';
      
      btnReclutador.style.background = 'transparent';
      btnReclutador.style.boxShadow = 'none';
      btnReclutador.style.color = '#434655';
    });
    
    btnReclutador.addEventListener('click', function() {
      btnReclutador.classList.add('active');
      btnPostulant.classList.remove('active');
      
      btnReclutador.style.background = 'white';
      btnReclutador.style.boxShadow = '0px 1px 2px rgba(0, 0, 0, 0.05)';
      btnReclutador.style.color = '#0D1C2E';
      
      btnPostulante.style.background = 'transparent';
      btnPostulante.style.boxShadow = 'none';
      btnPostulant.style.color = '#434655';
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

function handleLogin() {
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;
  const isPostulante = document.getElementById('toggle-postulante')?.classList.contains('active');
  const isReclutador = document.getElementById('toggle-reclutador')?.classList.contains('active');
  
  if (email && password) {
    // Determinar tipo de usuario
    let userType = 'candidato';
    if (isReclutador) {
      userType = 'reclutador';
    }
    
    setSession(userType);
    
    // Redireccionar al dashboard correspondiente
    if (userType === 'reclutador') {
      navigateTo(ROUTES.rdashboard);
    } else {
      navigateTo(ROUTES.cdashboard);
    }
  } else {
    alert('Por favor completa todos los campos');
  }
}

function handleRegister(userType) {
  const name = document.getElementById('nombre')?.value;
  const email = document.getElementById('correo')?.value;
  const password = document.getElementById('contrasena')?.value;
  
  if (name && email && password) {
    // Guardar datos (simulado)
    setSession(userType);
    
    // Ir a login para iniciar sesión
    navigateTo(ROUTES.registro);
  } else {
    alert('Por favor completa todos los campos');
  }
}

// ============================================
// POSTULACIONES
// ============================================

function applyToJob(jobId, companyName, jobTitle) {
  // Obtener postulaciones guardadas
  let aplicaciones = JSON.parse(localStorage.getItem('aplicaciones') || '[]');
  
  // Agregar nueva postulación
  aplicaciones.push({
    id: jobId,
    empresa: companyName,
    puesto: jobTitle,
    estado: 'Postulado',
    fecha: new Date().toLocaleDateString()
  });
  
  localStorage.setItem('aplicaciones', JSON.stringify(aplicaciones));
  
  alert('¡Te has postulado correctamente!');
  
  // Ir a mis postulaciones
  navigateTo(ROUTES.cpostulaciones);
}

// Buscar botón de aplicar en Cvacantes
document.addEventListener('DOMContentLoaded', function() {
  const btnAplicar = document.getElementById('btn-aplicar');
  if (btnAplicar) {
    btnAplicar.addEventListener('click', function() {
      applyToJob(
        '1',
        'TechNova Solutions',
        'Desarrollador Frontend Junior'
      );
    });
  }
});