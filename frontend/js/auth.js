const API_URL = 'http://localhost:8080/api';
let currentUser = null;
let pageHistory = [];

async function login(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

async function registerPostante(data, cvFile) {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('nombreCompleto', data.nombreCompleto);
    formData.append('email', data.email);
    formData.append('telefono', data.telefono);
    formData.append('carrera', data.carrera);
    if (cvFile) {
        formData.append('cvFile', cvFile);
    }

    const response = await fetch(`${API_URL}/auth/postante/register`, {
        method: 'POST',
        body: formData
    });
    return response.json();
}

async function registerReclutador(data) {
    const response = await fetch(`${API_URL}/auth/reclutador/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updatePostanteProfile(id, data) {
    const response = await fetch(`${API_URL}/auth/postante/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateReclutadorProfile(id, data) {
    const response = await fetch(`${API_URL}/auth/reclutador/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

// Event Handlers
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');

    try {
        const result = await login(username, password);

        if (result.error) {
            messageDiv.textContent = result.error;
            messageDiv.classList.remove('hidden', 'success');
            messageDiv.classList.add('error');
        } else {
            currentUser = result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            messageDiv.classList.add('hidden');
            event.target.reset();

            if (currentUser.tipo === 'postante') {
                renderDashboardPostulante(currentUser); 
            } else if (currentUser.tipo === 'reclutador') {
                renderDashboardReclutador(currentUser);
            }
        }
    } catch (error) {
        console.error("Error en el login:", error);
        messageDiv.textContent = "Error de conexión con el servidor";
        messageDiv.classList.remove('hidden');
    }
}

async function handlePostanteRegister(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        username: formData.get('username'),
        password: formData.get('password'),
        nombreCompleto: formData.get('nombreCompleto'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        carrera: formData.get('carrera')
    };
    
    const cvFile = form.querySelector('input[name="cvFile"]').files[0];
    
    const result = await registerPostante(data, cvFile);
    
    if (result.error) {
        showMessage('registerMessage', result.error, 'error');
    } else {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        showPage('loginPage');
    }
}

async function handleReclutadorRegister(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        username: formData.get('username'),
        password: formData.get('password'),
        nombreCompleto: formData.get('nombreCompleto'),
        email: formData.get('email'),
        empresa: formData.get('empresa')
    };
    
    const result = await registerReclutador(data);
    
    if (result.error) {
        showMessage('registerMessage', result.error, 'error');
    } else {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        showPage('loginPage');
    }
}

async function handleUpdateProfile(e) {
    e.preventDefault();
    
    const data = {
        nombreCompleto: document.getElementById('profileNombreCompleto').value,
        email: document.getElementById('profileEmail').value,
        telefono: document.getElementById('profileTelefono').value,
        carrera: document.getElementById('profileCarrera').value
    };
    
    const password = document.getElementById('profilePassword').value;
    if (password) data.password = password;
    
    const result = await updatePostanteProfile(currentUser.id, data);
    
    if (result.error) {
        alert(result.error);
    } else {
        alert('Perfil actualizado');
        currentUser = { ...currentUser, ...data };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

async function handleUpdateReclutadorProfile(e) {
    e.preventDefault();
    
    const data = {
        nombreCompleto: document.getElementById('profileRNombreCompleto').value,
        email: document.getElementById('profileREmail').value,
        empresa: document.getElementById('profileREmpresa').value
    };
    
    const password = document.getElementById('profileRPassword').value;
    if (password) data.password = password;
    
    const result = await updateReclutadorProfile(currentUser.id, data);
    
    if (result.error) {
        alert(result.error);
    } else {
        alert('Perfil actualizado');
        currentUser = { ...currentUser, ...data };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function logout() {
    currentUser = null;
    pageHistory = [];
    localStorage.removeItem('currentUser');
    showPage('homePage');
}

function switchRegisterTab(tipo) {
    const tabs = document.querySelectorAll('.auth-tabs button');
    tabs[0].classList.toggle('active', tipo === 'postante');
    tabs[1].classList.toggle('active', tipo === 'reclutador');
    
    document.getElementById('postanteRegisterForm').classList.toggle('hidden', tipo !== 'postante');
    document.getElementById('reclutadorRegisterForm').classList.toggle('hidden', tipo !== 'reclutador');
}

window.switchLoginTab = function(tipo) {
    document.getElementById('loginTipo').value = tipo;
    document.getElementById('loginTabPostulante').classList.remove('active');
    document.getElementById('loginTabReclutador').classList.remove('active');
    if (tipo === 'postante') {
        document.getElementById('loginTabPostulante').classList.add('active');
    } else {
        document.getElementById('loginTabReclutador').classList.add('active');
    }
};
