function renderDashboardPostulante(user) {
  const container = document.getElementById('dashboardPostulantePage');
  if (!container) return;

  container.innerHTML = `
    <div class="dashboard-layout">
      <nav class="sidebar">
        <div class="sidebar-logo">🎓 ChapaTuChamba</div>
        <div class="sidebar-menu">
          <button id="navInicio" class="active">Inicio</button>
          <button id="navOportunidades">Oportunidades</button>
          <button id="navPostulaciones">Mis postulaciones</button>
        </div>
      </nav>
      <main class="dashboard-main">
        <div id="dashboardContent"></div>
      </main>
    </div>
  `;
  // Navegación
  document.getElementById('navInicio').onclick = () => renderPostulanteInicio(user);
  document.getElementById('navOportunidades').onclick = () => renderPostulanteOportunidades(user);
  document.getElementById('navPostulaciones').onclick = () => renderPostulantePostulaciones(user);
  document.getElementById('navPruebas').onclick = () => renderPostulantePruebas(user);
  document.getElementById('navCertificados').onclick = () => renderPostulanteCertificados(user);
  document.getElementById('profileBtn').onclick = () => renderPostulantePerfil(user);
  document.getElementById('configBtn').onclick = () => renderConfiguracion(user);
  document.getElementById('alertasBtn').onclick = () => renderAlertas(user);
  // Render inicial
  renderPostulanteInicio(user);
}

// Secciones
function renderPostulanteInicio(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>¡Hola, ${user.nombreCompleto.split(' ')[0]}!</h2>
    <div class="card">
      <div><b>Postulaciones activas:</b> <span id="countPostulaciones">0</span></div>
      <div><b>Siguiente prueba técnica:</b> <span id="nextTest">Ninguna programada</span></div>
    </div>
    <div class="card">
      <h3>Recomendados para ti</h3>
      <div id="recomendadosList">(Vacantes recomendadas...)</div>
    </div>
  `;
}
function renderPostulanteOportunidades(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Oportunidades</h2>
    <div class="card">
      <div>Filtros: <select><option>Todos los sectores</option></select> <select><option>Modalidad</option></select></div>
      <div id="oportunidadesList">(Listado de vacantes sin experiencia...)</div>
    </div>
  `;
}
function renderPostulantePostulaciones(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Mis Postulaciones</h2>
    <div class="card">
      <div id="pipelineList">(Pipeline de postulaciones...)</div>
    </div>
  `;
}
function renderPostulantePruebas(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Pruebas</h2>
    <div class="card">
      <div id="pruebasList">(Retos técnicos, simuladores...)</div>
    </div>
  `;
}
function renderPostulanteCertificados(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Certificados</h2>
    <div class="card certificates-gallery">
      <div class="certificate-card">(Diploma 1)</div>
      <div class="certificate-card">(Diploma 2)</div>
    </div>
  `;
}
function renderPostulantePerfil(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Mi Perfil</h2>
    <div class="profile-preview">
      <div class="user-photo" style="width:60px;height:60px;font-size:2rem;">${user.nombreCompleto[0]}</div>
      <div>
        <div><b>${user.nombreCompleto}</b></div>
        <div>${user.email}</div>
        <button class="btn btn-secondary" onclick="alert('Editar perfil (demo)')">Editar Perfil</button>
      </div>
    </div>
  `;
}
function renderConfiguracion(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Configuración</h2>
    <div class="card">(Opciones de configuración...)</div>
  `;
}
function renderAlertas(user) {
  document.getElementById('alertsSection').innerHTML = `
    <div class="card">(Notificaciones y alertas...)</div>
  `;
  setTimeout(()=>{
    document.getElementById('alertsSection').innerHTML = '';
  }, 4000);
}

window.renderDashboardPostulante = renderDashboardPostulante;
