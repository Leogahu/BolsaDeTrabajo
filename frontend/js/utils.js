// Utility functions
function showPage(pageId) {
    const targetPage = document.getElementById(pageId);
    if (!targetPage) {
        console.warn(`La página ${pageId} no existe en el DOM.`);
        return;
    }

    if (pageHistory[pageHistory.length - 1] !== pageId) {
        pageHistory.push(pageId);
    }

    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    
    targetPage.classList.remove('hidden');

    const pageInitializers = {
        'perfilPage': () => currentUser?.tipo === 'postante' && loadProfileData(),
        'perfilReclutadorPage': () => currentUser?.tipo === 'reclutador' && loadReclutadorProfileData(),
        'misPostulacionesPage': () => currentUser?.tipo === 'postante' && loadMyApplications(),
        'habilidadesPage': () => currentUser?.tipo === 'postante' && loadSkills(),
        'dashboardPostulantePage': () => renderDashboardPostulante(currentUser),
        'dashboardReclutadorPage': () => renderDashboardReclutador(currentUser)
    };

    if (pageInitializers[pageId]) {
        pageInitializers[pageId]();
    }
}

function goToHome() {
    pageHistory = [];
    if (currentUser?.tipo === 'postante') {
        showPage('dashboardPostulantePage');
        if (typeof loadPage === 'function') loadPage(0);
    } else if (currentUser?.tipo === 'reclutador') {
        showPage('dashboardReclutadorPage');
        if (typeof loadMisPostulaciones === 'function') loadMisPostulaciones();
    } else {
        showPage('homePage');
    }
}

function goBack() {
    if (pageHistory.length > 1) {
        pageHistory.pop();
        const prevPage = pageHistory[pageHistory.length - 1];
        
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        document.getElementById(prevPage).classList.remove('hidden');
    } else {
        goToHome();
    }
}

function showMessage(elementId, message, type = 'error') {
    const el = document.getElementById(elementId);
    el.className = type === 'error' ? 'error-message' : 'success-message';
    el.textContent = message;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES');
}

function toggleDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

function updateHeader() {
    if (currentUser) {
        const perfilPage = currentUser.tipo === 'postante' ? 'perfilPage' : 'perfilReclutadorPage';
        const habilidadesItem = currentUser.tipo === 'postante' 
            ? `<a href="#" onclick="showPage('habilidadesPage'); toggleDropdown();">Habilidades verificadas</a>`
            : '';
        
        document.getElementById('headerUser').innerHTML = `
            <div class="user-menu">
                <div class="user-photo" onclick="toggleDropdown()">${getInitials(currentUser.nombreCompleto)}</div>
                <div class="dropdown-menu" id="userDropdown">
                    <a href="#" onclick="showPage('${perfilPage}'); toggleDropdown();">Mi perfil</a>
                    <a href="#" onclick="showPage('misPostulacionesPage'); toggleDropdown();">Mis postulaciones</a>
                    ${habilidadesItem}
                    <a href="#" onclick="logout(); toggleDropdown();" class="logout">Cerrar sesión</a>
                </div>
            </div>
        `;
    } else {
        document.getElementById('headerUser').innerHTML = '';
    }
}

function loadProfileData() {
    if (!currentUser) return;
    document.getElementById('profileUsername').value = currentUser.username || '';
    document.getElementById('profileNombreCompleto').value = currentUser.nombreCompleto || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    document.getElementById('profileTelefono').value = currentUser.telefono || '';
    document.getElementById('profileCarrera').value = currentUser.carrera || '';
    document.getElementById('profilePassword').value = '';
}

function loadReclutadorProfileData() {
    if (!currentUser) return;
    document.getElementById('profileRUsername').value = currentUser.username || '';
    document.getElementById('profileRNombreCompleto').value = currentUser.nombreCompleto || '';
    document.getElementById('profileREmail').value = currentUser.email || '';
    document.getElementById('profileREmpresa').value = currentUser.empresa || '';
    document.getElementById('profileRPassword').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateHeader();
        if (currentUser.tipo === 'postante') {
            showPage('dashboardPostulantePage');
            if (typeof loadPage === 'function') loadPage(0);
        } else {
            showPage('dashboardReclutadorPage');
            if (typeof loadMisPostulaciones === 'function') loadMisPostulaciones();
        }
    } else {
        showPage('homePage');
    }
});
