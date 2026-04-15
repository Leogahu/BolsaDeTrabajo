// Job related functions
async function getPostulaciones(page = 0, keyword = '') {
    const url = `${API_URL}/reclutadores/postulaciones?page=${page}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}`;
    const response = await fetch(url);
    return response.json();
}

async function getPostulacionById(id) {
    const response = await fetch(`${API_URL}/reclutadores/postulaciones/${id}`);
    return response.json();
}

async function getPostulacionesByReclutador(reclutadorId) {
    const response = await fetch(`${API_URL}/reclutadores/${reclutadorId}/postulaciones`);
    return response.json();
}

async function createPostulacion(reclutadorId, data) {
    const response = await fetch(`${API_URL}/reclutadores/${reclutadorId}/postulaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function handleCreatePostulacion(e) {
    e.preventDefault();
    
    const data = {
        titulo: document.getElementById('jobTitle').value,
        descripcion: document.getElementById('jobDescription').value,
        requisitos: document.getElementById('jobRequirements').value,
        ubicacion: document.getElementById('jobLocation').value
    };
    
    const result = await createPostulacion(currentUser.id, data);
    
    if (result.error) {
        alert(result.error);
    } else {
        alert('¡Oferta publicada con éxito!');
        loadMisPostulaciones();
        e.target.reset();
    }
}

async function loadPage(page) {
    currentPage = page;
    const keyword = document.getElementById('searchInput')?.value || '';
    const result = await getPostulaciones(page, keyword);
    
    const container = document.getElementById('jobList');
    if (result.content && result.content.length > 0) {
        container.innerHTML = result.content.map(renderJobCard).join('');
    } else {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">No hay postulaciones disponibles</p>';
    }
    
    document.getElementById('pagination').innerHTML = renderPagination(result.totalPages);
}

function renderJobCard(job) {
    return `
        <div class="job-card">
            <h3>${job.titulo}</h3>
            <p class="company">${job.reclutador?.empresa || 'Empresa'}</p>
            <div class="details">
                <span>📍 ${job.ubicacion || 'No especificada'}</span>
                <span>📅 ${formatDate(job.fechaPublicacion)}</span>
            </div>
            <p class="description">${job.descripcion || ''}</p>
            <button class="btn btn-primary" onclick="handlePostular(${job.id})">Postular</button>
        </div>
    `;
}

function renderPagination(totalPages) {
    let html = '';
    for (let i = 0; i < totalPages && i < 10; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="loadPage(${i})">${i + 1}</button>`;
    }
    return html;
}

async function loadMisPostulaciones() {
    if (!currentUser || currentUser.tipo !== 'reclutador') return;
    
    const result = await getPostulacionesByReclutador(currentUser.id);
    const container = document.getElementById('myJobs');
    
    if (result && result.length > 0) {
        container.innerHTML = result.map(job => `
            <div class="job-card">
                <h3>${job.titulo}</h3>
                <div class="details">
                    <span>📍 ${job.ubicacion}</span>
                    <span>📅 ${formatDate(job.fechaPublicacion)}</span>
                </div>
                <button class="btn btn-secondary" onclick="viewCandidates(${job.id})">Ver Candidatos</button>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">No tienes ofertas publicadas</p>';
    }
}
