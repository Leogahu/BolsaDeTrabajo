// Home page controller
async function loadHomeStats() {
    try {
        // Cargar estadísticas de la API
        const jobsResponse = await fetch(`${API_URL}/postulaciones`);
        const candidatesResponse = await fetch(`${API_URL}/postantes`);
        const recruitersResponse = await fetch(`${API_URL}/reclutadores`);

        if (jobsResponse.ok && candidatesResponse.ok && recruitersResponse.ok) {
            const jobs = await jobsResponse.json();
            const candidates = await candidatesResponse.json();
            const recruiters = await recruitersResponse.json();

            // Actualizar estadísticas en la página
            const jobCount = Array.isArray(jobs) ? jobs.length : 0;
            const candidateCount = Array.isArray(candidates) ? candidates.length : 0;
            const recruiterCount = Array.isArray(recruiters) ? recruiters.length : 0;

            document.getElementById('statsJobs').textContent = `${jobCount}+`;
            document.getElementById('statsCandidates').textContent = `${candidateCount}+`;
            document.getElementById('statsCompanies').textContent = `${recruiterCount}+`;
        }
    } catch (error) {
        console.log('Stats not available yet - API may not be running');
        // Mantener los valores por defecto si la API no está disponible
    }
}

// Inicializar estadísticas cuando se carga la página de home
function initializeHome() {
    const homePage = document.getElementById('homePage');
    if (homePage && !homePage.classList.contains('hidden')) {
        loadHomeStats();
    }
}

// Actualizar showPage para cargar estadísticas del home
const originalShowPage = showPage;
showPage = function(pageId) {
    originalShowPage.call(this, pageId);
    
    if (pageId === 'homePage') {
        loadHomeStats();
    }
};
