// Dashboard Reclutador
// Estructura principal y navegación lateral

function renderDashboardReclutador(user) {
  document.body.innerHTML = `
    <div class="dashboard-layout">
      <nav class="sidebar">
        <div class="sidebar-logo"> <span class="icon">🏢</span> ChapaTuChamba</div>
        <div class="sidebar-menu">
          <button id="navVacantes" class="active">Vacantes</button>
          <button id="navPostulantes">Postulantes</button>
          <button id="navPublicar">Publicar Oferta</button>
          <button id="navReportes">Reportes</button>
        </div>
      </nav>
      <main class="dashboard-main">
        <div class="topbar">
          <button class="icon-btn" id="alertasBtn" title="Alertas">🔔</button>
          <button class="icon-btn" id="configBtn" title="Configuración">⚙️</button>
          <div class="user-photo" id="profileBtn" title="Mi Perfil">${user.nombreCompleto[0]}</div>
        </div>
        <div id="dashboardContent"></div>
      </main>
      <div class="alerts-section" id="alertsSection"></div>
    </div>
  `;
  // Navegación
  document.getElementById('navVacantes').onclick = () => renderVacantes(user);
  document.getElementById('navPostulantes').onclick = () => renderPostulantes(user);
  document.getElementById('navPublicar').onclick = () => renderPublicarOferta(user);
  document.getElementById('navReportes').onclick = () => renderReportes(user);
  document.getElementById('profileBtn').onclick = () => renderPerfilReclutador(user);
  document.getElementById('configBtn').onclick = () => renderConfiguracionReclutador(user);
  document.getElementById('alertasBtn').onclick = () => renderAlertasReclutador(user);
  // Render inicial
  renderVacantes(user);
}

// Secciones
function renderVacantes(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Vacantes</h2>
    <div class="card">
      <div>Ofertas activas, pausadas y cerradas. KPIs por vacante.</div>
      <div id="vacantesList">(Listado de vacantes...)</div>
    </div>
  `;
}
function renderPostulantes(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Postulantes</h2>
    <div class="card">
      <div>Ranking de talento, etiquetas de habilidades, pipeline de candidatos.</div>
      <div id="postulantesList">(Listado de postulantes...)</div>
    </div>
  `;
}
function renderPublicarOferta(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Publicar Oferta</h2>
    <div class="card">
      <div>Formulario inteligente para crear vacantes.</div>
      <div id="publicarForm">(Formulario de publicación...)</div>
    </div>
  `;
}
function renderReportes(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Reportes</h2>
    <div class="card">
      <div>Gráficos y métricas de reclutamiento.</div>
      <div id="reportesList">(Gráficos y reportes...)</div>
    </div>
  `;
}
function renderPerfilReclutador(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Mi Perfil</h2>
    <div class="profile-preview">
      <div class="user-photo" style="width:60px;height:60px;font-size:2rem;">${user.nombreCompleto[0]}</div>
      <div>
        <div><b>${user.nombreCompleto}</b></div>
        <div>${user.email}</div>
        <div>${user.empresa || ''}</div>
        <button class="btn btn-secondary" onclick="alert('Editar perfil (demo)')">Editar Perfil</button>
      </div>
    </div>
  `;
}
function renderConfiguracionReclutador(user) {
  document.getElementById('dashboardContent').innerHTML = `
    <h2>Configuración</h2>
    <div class="card">(Opciones de configuración...)</div>
  `;
}
function renderAlertasReclutador(user) {
  document.getElementById('alertsSection').innerHTML = `
    <div class="card">(Notificaciones y alertas...)</div>
  `;
  setTimeout(()=>{
    document.getElementById('alertsSection').innerHTML = '';
  }, 4000);
}

window.renderDashboardReclutador = renderDashboardReclutador;
