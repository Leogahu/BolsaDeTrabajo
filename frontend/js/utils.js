// Utility functions
function showPage(pageId) {
    pageHistory.push(pageId);
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    
    if (pageId === 'perfilPage' && currentUser?.tipo === 'postante') {
        loadProfileData();
    } else if (pageId === 'perfilReclutadorPage' && currentUser?.tipo === 'reclutador') {
        loadReclutadorProfileData();
    } else if (pageId === 'misPostulacionesPage' && currentUser?.tipo === 'postante') {
        loadMyApplications();
    } else if (pageId === 'habilidadesPage' && currentUser?.tipo === 'postante') {
        loadSkills();
    }
}

function goToHome() {
    pageHistory = [];
    if (currentUser?.tipo === 'postante') {
        showPage('dashboardPage');
        loadPage(0);
    } else if (currentUser?.tipo === 'reclutador') {
        showPage('reclutadorPage');
        loadMisPostulaciones();
    } else {
        // Usuario no autenticado, mostrar página de home
        showPage('homePage');
    }
}

function goBack() {
    if (pageHistory.length > 0) {
        const prevPage = pageHistory.pop();
        showPage(prevPage);
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

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (currentUser.tipo === 'postante') {
            showPage('dashboardPage');
            loadPage(0);
        } else {
            showPage('reclutadorPage');
            loadMisPostulaciones();
        }
        updateHeader();
    } else {
        // Mostrar página de home si no hay usuario autenticado
        showPage('homePage');
    }
});
