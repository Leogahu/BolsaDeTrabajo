// Skills related functions
async function addHabilidades(postanteId, habilidades) {
    const response = await fetch(`${API_URL}/postantes/${postanteId}/habilidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habilidades)
    });
    return response.json();
}

async function getHabilidades(postanteId) {
    const response = await fetch(`${API_URL}/postantes/${postanteId}/habilidades`);
    return response.json();
}

async function verificarHabilidad(habilidadId) {
    const response = await fetch(`${API_URL}/postantes/habilidades/${habilidadId}/verificar`, {
        method: 'PUT'
    });
    return response.json();
}

async function addSkill() {
    if (!currentUser || currentUser.tipo !== 'postante') return;
    
    const skillName = document.getElementById('newSkill').value.trim();
    if (!skillName) return;
    
    const result = await addHabilidades(currentUser.id, [skillName]);
    document.getElementById('newSkill').value = '';
    loadSkills();
}

async function loadSkills() {
    if (!currentUser || currentUser.tipo !== 'postante') return;
    
    const result = await getHabilidades(currentUser.id);
    const container = document.getElementById('skillsList');
    
    if (result && result.length > 0) {
        container.innerHTML = result.map(s => `
            <div class="skill-tag">
                ${s.nombre}
                ${s.verificada ? '<span class="verified-badge">★</span>' : ''}
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p>No tienes habilidades agregadas</p>';
    }
}
