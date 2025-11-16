// Configuração da API
const API_BASE_URL = 'http://localhost:5141/api';

// Função auxiliar para obter o token do localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Função para decodificar JWT e obter o payload
function decodeJWT(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        console.log("Payload decodificado:", decoded);
        return decoded;
    } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
    }
}

// Função para obter o role do usuário (agora do localStorage, se salvo)
function getUserRole() {
    return localStorage.getItem('userRole');
}

// Função auxiliar para fazer requisições com autenticação
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (getAuthToken()) {
        headers['Authorization'] = `Bearer ${getAuthToken()}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        const error = { message: errorText || `Erro ${response.status}` };
        throw new Error(error.message);
    }

    // Tentar parsear JSON
    return response.json();
}

// Autenticação
async function registerUser(userData) {
    return apiRequest('/Auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

async function loginUser(credentials) {
    const response = await apiRequest('/Auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
    // Salvar token no localStorage
    if (response.token) {
        localStorage.setItem('authToken', response.token);
    }
    return response;
}

async function getUserById(id) {
    return apiRequest(`/Auth/${id}`);
}

// Usuários
async function getUserProfile() {
    return apiRequest('/Usuarios/perfil');
}

async function updateUserProfile(profileData) {
    return apiRequest('/Usuarios/atualizar-perfil', {
        method: 'PUT',
        body: JSON.stringify(profileData)
    });
}

// Agendamentos
async function createAgendamento(agendamentoData) {
    console.log('API.createAgendamento chamada com:', agendamentoData);
    const response = await apiRequest('/Agendamentos/agendar', {
        method: 'POST',
        body: JSON.stringify(agendamentoData)
    });
    console.log('API.createAgendamento resposta:', response);
    return response;
}

async function getMyAgendamentos() {
    return apiRequest('/Agendamentos/meus-agendamentos');
}

async function getAgendamentosDia(data) {
    return apiRequest(`/Agendamentos/dia?data=${data}`);
}

async function getAgendamentoById(id) {
    return apiRequest(`/Agendamentos/${id}`);
}

async function updateAgendamento(id, agendamentoData) {
    return apiRequest(`/Agendamentos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(agendamentoData)
    });
}

async function cancelAgendamento(id) {
    return apiRequest(`/Agendamentos/${id}`, {
        method: 'DELETE'
    });
}

async function cancelAgendamentoAdmin(id) {
    return apiRequest(`/Agendamentos/admin/${id}`, {
        method: 'DELETE'
    });
}

async function getAllAgendamentos() {
    return apiRequest('/Agendamentos/lista-todos');
}

// Notificações
async function getMyNotificacoes() {
    return apiRequest('/Notificacoes/minhas-notificacoes');
}

async function markNotificacaoAsViewed(id) {
    return apiRequest(`/Notificacoes/${id}/visualizar`, {
        method: 'PUT'
    });
}

async function deleteNotificacao(id) {
    return apiRequest(`/Notificacoes/${id}`, {
        method: 'DELETE'
    });
}

// Expor funções globalmente
window.API = {
    registerUser,
    loginUser,
    getUserById,
    getUserProfile,
    updateUserProfile,
    createAgendamento,
    getMyAgendamentos,
    getAgendamentosDia,
    getAgendamentoById,
    updateAgendamento,
    cancelAgendamento,
    cancelAgendamentoAdmin,
    getAllAgendamentos,
    getMyNotificacoes,
    markNotificacaoAsViewed,
    deleteNotificacao,
    getUserRole
};

console.log('API loaded successfully:', window.API);