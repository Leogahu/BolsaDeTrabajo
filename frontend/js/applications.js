// Application/Postulation related functions
async function postular(postulacionId, postanteId) {
    const response = await fetch(`${API_URL}/postulaciones/${postulacionId}/postular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postanteId })
    });
    return response.json();
}

async function handlePostular(postulacionId) {
    if (!currentUser || currentUser.tipo !== 'postante') {
        showMessage('loginMessage', 'Debes iniciar sesión como postante', 'error');
        showPage('loginPage');
        return;
    }
    
    const result = await postular(postulacionId, currentUser.id);
    if (result.error) {
        alert(result.error);
    } else {
        alert('¡Postulación enviada con éxito!');
    }
}

async function getPostulacionesPostante(postanteId) {
    const response = await fetch(`${API_URL}/postantes/${postanteId}/postulaciones`);
    return response.json();
}

async function loadMyApplications() {
    if (!currentUser || currentUser.tipo !== 'postante') return;
    
    const result = await getPostulacionesPostante(currentUser.id);
    const container = document.getElementById('myApplications');
    
    if (result && result.length > 0) {
        container.innerHTML = result.map(app => `
            <div class="job-card">
                <h3>${app.postulacion?.titulo || 'Oferta'}</h3>
                <p class="company">${app.postulacion?.reclutador?.empresa || ''}</p>
                <p><strong>Estado:</strong> <span class="status-badge status-${app.estado.toLowerCase().replace('_', '-')}">${app.estado}</span></p>
                ${app.motivo ? `<p><strong>Motivo:</strong> ${app.motivo}</p>` : ''}
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">No has postulado a ninguna oferta</p>';
    }
}

async function getCandidatos(postulacionId) {
    const response = await fetch(`${API_URL}/postulaciones/${postulacionId}/candidatos`);
    return response.json();
}

async function updateEstado(candidatoId, estado, motivo) {
    const response = await fetch(`${API_URL}/postulaciones/${candidatoId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado, motivo })
    });
    return response.json();
}

async function viewCandidates(postulacionId) {
    showPage('candidatesPage');
    const result = await getCandidatos(postulacionId);
    const container = document.getElementById('candidatesList');
    
    if (result && result.length > 0) {
        container.innerHTML = result.map(c => `
            <div class="candidate-card">
                <div class="header">
                    <div class="avatar">${getInitials(c.postante?.nombreCompleto || '--')}</div>
                    <div>
                        <h4>${c.postante?.nombreCompleto || 'Postante'}</h4>
                        <p>${c.postante?.carrera || ''}</p>
                    </div>
                </div>
                <p><strong>Estado:</strong> <span class="status-badge status-${c.estado.toLowerCase().replace('_', '-')}">${c.estado}</span></p>
                ${c.motivo ? `<p><strong>Motivo:</strong> ${c.motivo}</p>` : ''}
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="changeStatus(${c.id}, 'EN_REVISION', '')">En Revisión</button>
                    <button class="btn btn-primary" onclick="changeStatus(${c.id}, 'CONTACTARAN', '')">Contactarán</button>
                    <button class="btn btn-secondary" onclick="finishCandidate(${c.id})">Finalizar</button>
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">No hay candidatos aún</p>';
    }
}

async function changeStatus(candidatoId, estado, motivo) {
    const result = await updateEstado(candidatoId, estado, motivo);
    if (!result.error) {
        alert('Estado actualizado');
    }
}

async function finishCandidate(candidatoId) {
    const motivo = prompt('Ingrese el motivo de finalización:');
    if (motivo) {
        await changeStatus(candidatoId, 'FINALIZADO', motivo);
    }
}
