// Importa as funções de API (caminho relativo sobe um nível ../)
// CORRIGIDO: O caminho deve ser '../serves/api.js'
import { BASE_URL, obterToken } from '../server/api.js';

// ===================================================
// == INICIALIZAÇÃO (Carrega dados ao abrir a página)
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
    // Busca os agendamentos da API
    carregarAgendamentos();
    
    // Adiciona o nome do usuário ao header (lendo do localStorage salvo no Login)
    const userName = localStorage.getItem('userName') || 'Admin';
    const welcomeTextStrong = document.querySelector('.welcome-text strong');
    if (welcomeTextStrong) {
        welcomeTextStrong.textContent = userName;
    }
});

/**
 * Busca os agendamentos na API e preenche a tela
 */
async function carregarAgendamentos() {
    const token = obterToken();
    if (!token) {
        alert("Você não está autenticado. Redirecionando para o Login.");
        window.location.href = "../Login/index.html";
        return;
    }

    try {
        // 1. Busca Agendamentos (Endpoint de Admin da documentação)
        const response = await fetch(`${BASE_URL}/Agendamentos/lista-todos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const agendamentos = await response.json();
            
            // Simulação de filtro (API deveria fazer isso)
            const pendentes = agendamentos.filter(a => a.status !== 'Finalizado' && a.status !== 'Cancelado');
            const finalizados = agendamentos.filter(a => a.status === 'Finalizado');

            preencherAgendamentosHoje(pendentes);
            preencherServicosFinalizados(finalizados);

        } else if (response.status === 401 || response.status === 403) {
            alert("Sessão expirada ou sem permissão de Admin. Faça login novamente.");
            window.location.href = "../Login/index.html";
        } else {
            alert("Erro ao buscar agendamentos da API.");
        }
    } catch (error) {
        console.error("Erro ao conectar na API:", error);
        alert("Não foi possível conectar ao servidor. Verifique se a API .NET está rodando.");
    }
}

/**
 * Preenche a lista horizontal "Agendamentos de hoje"
 */
function preencherAgendamentosHoje(agendamentos) {
    const container = document.querySelector('.horizontal-scroll');
    if (!container) return;

    container.innerHTML = ''; // Limpa os cards estáticos

    if (agendamentos.length === 0) {
        container.innerHTML = '<p style="padding-left: 20px; color: var(--cinza-texto);">Nenhum agendamento pendente hoje.</p>';
        return;
    }

    agendamentos.forEach(ag => {
        const dataHora = new Date(ag.dataHora);
        const hora = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const cardHtml = `
            <div class="appointment-card" data-id="${ag.id}">
                <span class="time">${hora}</span>
                <p class="client-name">Cliente: <strong>${ag.usuarioNome || 'Não definido'}</strong></p>
                <p class="service-name">${ag.tipoCorte}</p>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="window.confirmAppointment(this, ${ag.id})">Confirmar</button>
                    <button class="btn btn-secondary" onclick="window.cancelAppointment(this, ${ag.id})">Cancelar</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}

/**
 * Preenche a lista "Serviços finalizados"
 */
function preencherServicosFinalizados(agendamentos) {
    const container = document.querySelector('.finished-list');
    if (!container) return;

    container.innerHTML = ''; // Limpa os itens estáticos
    
    if (agendamentos.length === 0) {
        container.innerHTML = '<p style="color: var(--cinza-texto); margin-left: 20px;">Nenhum serviço finalizado hoje.</p>';
        return;
    }

    agendamentos.forEach(ag => {
        const dataHora = new Date(ag.dataHora);
        const hora = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const itemHtml = `
            <div class="finished-item">
                <div class="item-details">
                    <span class="name">${ag.usuarioNome || 'Não definido'}</span>
                    <span class="time-range">${hora}</span>
                </div>
                <span class="item-price">R$ ${ag.preco.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    });
}


// ===================================================
// == LÓGICA DOS BOTÕES (INTEGRADA COM API)
// ===================================================

/**
 * CORREÇÃO: Anexa a função ao 'window' para torná-la global
 */
window.confirmAppointment = function(buttonElement, id) {
    console.log("Confirmando agendamento (visual):", id);
    const card = buttonElement.closest('.appointment-card');
    card.style.borderColor = 'var(--verde-sucesso)';
    
    const actions = card.querySelector('.card-actions');
    actions.innerHTML = '<p style="color: var(--verde-sucesso); font-weight: 600; margin: 0;">Confirmado!</p>';
}

/**
 * CORREÇÃO: Anexa a função ao 'window' para torná-la global
 */
window.cancelAppointment = async function(buttonElement, id) {
    const token = obterToken();
    if (!token) {
        alert("Sessão expirada.");
        window.location.href = "../Login/index.html";
        return;
    }

    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) {
        return;
    }

    try {
        // Chama o endpoint de admin para cancelar (POST, conforme doc)
        const response = await fetch(`${BASE_URL}/Agendamentos/admin/cancelar/${id}`, {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200 || response.status === 204) { // 204 = No Content (sucesso)
            // Atualiza a UI
            const card = buttonElement.closest('.appointment-card');
            card.style.opacity = '0.5';
            
            const actions = card.querySelector('.card-actions');
            actions.innerHTML = '<p style="color: #ff6b6b; font-weight: 600; margin: 0;">Cancelado</p>';
        } else if (response.status === 401) {
            alert("Sessão expirada.");
            window.location.href = "../Login/index.html";
        } else {
            alert("Erro ao tentar cancelar o agendamento.");
        }
    } catch (error) {
        console.error("Erro ao conectar na API:", error);
        alert("Não foi possível conectar ao servidor.");
    }
}