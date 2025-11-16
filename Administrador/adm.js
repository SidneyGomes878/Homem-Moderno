// Versão única e limpa do script admin: renderiza cards, confirma/cancela e atualiza receitas
function formatTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Estado de receita e map
const agendamentoPrecoMap = new Map();
let todayRevenueValue = 0;
let confirmedCountValue = 0;
let confirmedRevenue = 0;
let canceledRevenue = 0;

function formatCurrency(value) {
    return 'R$ ' + Number(value || 0).toFixed(2).replace('.', ',');
}

function updateRevenueDisplays() {
    const el = document.getElementById('todayRevenue');
    const countEl = document.getElementById('confirmedCount');
    const canceledCountEl = document.getElementById('canceledCount');
    const confirmedRevEl = document.getElementById('confirmedRevenue');
    const canceledRevEl = document.getElementById('canceledRevenue');

    if (el) el.textContent = formatCurrency(todayRevenueValue);
    if (countEl) countEl.textContent = String(confirmedCountValue);
    if (canceledCountEl) canceledCountEl.textContent = String(document.querySelectorAll('.canceled-list .appointment-card').length);
    if (confirmedRevEl) confirmedRevEl.textContent = formatCurrency(confirmedRevenue);
    if (canceledRevEl) canceledRevEl.textContent = formatCurrency(canceledRevenue);
}

function moveCardToList(cardEl, selector) {
    const list = document.querySelector(selector);
    if (!list) return;
    list.appendChild(cardEl);
}

function renderAppointmentCard(agendamento) {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    card.dataset.id = agendamento.id;

    if (agendamento.status === 'Confirmado') card.classList.add('confirmed');
    if (agendamento.status === 'Cancelado') card.classList.add('canceled');

    const timeSpan = document.createElement('span');
    timeSpan.className = 'time';
    timeSpan.textContent = formatTime(agendamento.dataHora);

    const clientP = document.createElement('p');
    clientP.className = 'client-name';
    const clientName = (agendamento.usuario && agendamento.usuario.nome) ? agendamento.usuario.nome : 'Cliente';
    clientP.innerHTML = `Cliente: <strong>${clientName}</strong>`;

    const serviceP = document.createElement('p');
    serviceP.className = 'service-name';
    serviceP.textContent = agendamento.tipoCorte || '';

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'card-actions';

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary';
    confirmBtn.textContent = 'Confirmar';
    confirmBtn.onclick = async () => {
        await confirmAppointment(confirmBtn, agendamento.id);
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.onclick = async () => {
        await cancelAppointment(cancelBtn, agendamento.id);
    };

    actionsDiv.appendChild(confirmBtn);
    actionsDiv.appendChild(cancelBtn);

    card.appendChild(timeSpan);
    card.appendChild(clientP);
    card.appendChild(serviceP);
    card.appendChild(actionsDiv);

    return card;
}

function addToFinishedList(agendamento) {
    const list = document.querySelector('.finished-list');
    if (!list) return;

    const item = document.createElement('div');
    item.className = 'finished-item';

    const details = document.createElement('div');
    details.className = 'item-details';

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = (agendamento.usuario && agendamento.usuario.nome) ? agendamento.usuario.nome : 'Cliente';

    const timeRange = document.createElement('span');
    timeRange.className = 'time-range';
    const t = new Date(agendamento.dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeRange.textContent = `${t}`;

    details.appendChild(name);
    details.appendChild(timeRange);

    const price = document.createElement('span');
    price.className = 'item-price';
    price.textContent = agendamento.preco ? `R$ ${Number(agendamento.preco).toFixed(2).replace('.', ',')}` : 'R$ 0,00';

    item.appendChild(details);
    item.appendChild(price);

    list.appendChild(item);
}

async function confirmAppointment(buttonElement, agendamentoId) {
    buttonElement.disabled = true;
    try {
        let ag = null;
        if (window.API && window.API.getAgendamentoById) {
            const full = await window.API.getAgendamentoById(agendamentoId);
            ag = full.agendamento || full;
        }

        const payload = {
            tipoCorte: ag?.tipoCorte || ag?.TipoCorte || 'Corte',
            dataHora: ag?.dataHora,
            preco: ag?.preco != null ? ag.preco : 0,
            status: 'Confirmado'
        };
        if (ag?.usuario && ag.usuario.id) payload.usuarioId = ag.usuario.id;

        await window.API.updateAgendamento(agendamentoId, payload);

        const card = buttonElement.closest('.appointment-card');
        if (card) {
            const wasConfirmed = card.classList.contains('confirmed');
            card.classList.add('confirmed');
            const actions = card.querySelector('.card-actions');
            actions.innerHTML = '<p style="color: #27ae60; font-weight: 600; margin: 0;">Confirmado!</p>';
            moveCardToList(card, '.confirmed-list');

            const price = Number(payload.preco) || 0;
            confirmedRevenue += price;
            if (new Date(payload.dataHora).toDateString() === new Date().toDateString()) {
                todayRevenueValue += price;
                confirmedCountValue += wasConfirmed ? 0 : 1;
            } else {
                confirmedCountValue += wasConfirmed ? 0 : 1;
            }
            agendamentoPrecoMap.set(agendamentoId, price);
            updateRevenueDisplays();
        }
    } catch (err) {
        console.error('Erro ao confirmar:', err);
        alert('Falha ao confirmar. Verifique o console.');
    } finally {
        buttonElement.disabled = false;
    }
}

async function cancelAppointment(buttonElement, agendamentoId) {
    buttonElement.disabled = true;
    try {
        let ag = null;
        if (window.API && window.API.getAgendamentoById) {
            const full = await window.API.getAgendamentoById(agendamentoId);
            ag = full.agendamento || full;
        }

        const payload = {
            tipoCorte: ag?.tipoCorte || ag?.TipoCorte || 'Corte',
            dataHora: ag?.dataHora,
            preco: ag?.preco != null ? ag.preco : 0,
            status: 'Cancelado'
        };
        if (ag?.usuario && ag.usuario.id) payload.usuarioId = ag.usuario.id;

        await window.API.updateAgendamento(agendamentoId, payload);

        const card = buttonElement.closest('.appointment-card');
        if (card) {
            const wasConfirmed = card.classList.contains('confirmed');
            card.classList.add('canceled');
            const actions = card.querySelector('.card-actions');
            actions.innerHTML = '<p style="color: #ff6b6b; font-weight: 600; margin: 0;">Cancelado</p>';
            moveCardToList(card, '.canceled-list');

            const price = Number(payload.preco) || 0;
            canceledRevenue += price;
            if (wasConfirmed) {
                confirmedRevenue = Math.max(0, confirmedRevenue - price);
                if (new Date(payload.dataHora).toDateString() === new Date().toDateString()) {
                    todayRevenueValue = Math.max(0, todayRevenueValue - price);
                    confirmedCountValue = Math.max(0, confirmedCountValue - 1);
                }
            }
            agendamentoPrecoMap.set(agendamentoId, price);
            updateRevenueDisplays();
        }
    } catch (err) {
        console.error('Erro ao cancelar:', err);
        alert('Falha ao cancelar. Verifique o console.');
    } finally {
        buttonElement.disabled = false;
    }
}

async function loadAdminAppointments() {
    if (!window.API || !window.API.getAllAgendamentos) {
        console.warn('API não disponível em admin.');
        return;
    }

    try {
        const resp = await window.API.getAllAgendamentos();
        console.log('Agendamentos recebidos (admin):', resp);

        const agendamentos = resp.agendamentos || [];
        const hoje = new Date();
        hoje.setHours(0,0,0,0);

        // containers
        const container = document.querySelector('.horizontal-scroll');
        const finished = document.querySelector('.finished-list');
        const confirmedList = document.querySelector('.confirmed-list');
        const canceledList = document.querySelector('.canceled-list');

        if (container) container.innerHTML = '';
        if (finished) finished.innerHTML = '';
        if (confirmedList) confirmedList.innerHTML = '';
        if (canceledList) canceledList.innerHTML = '';

        // reset
        todayRevenueValue = 0;
        confirmedCountValue = 0;
        confirmedRevenue = 0;
        canceledRevenue = 0;
        agendamentoPrecoMap.clear();

        agendamentos.forEach(a => {
            const dt = new Date(a.dataHora);
            const dtDay = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());

            if (a.preco) agendamentoPrecoMap.set(a.id, a.preco);

            const card = renderAppointmentCard(a);

            if (a.status && a.status.toLowerCase() === 'confirmado') {
                card.classList.add('confirmed');
                if (confirmedList) confirmedList.appendChild(card);
                confirmedRevenue += Number(a.preco) || 0;
                if (dt.toDateString() === new Date().toDateString()) {
                    todayRevenueValue += Number(a.preco) || 0;
                    confirmedCountValue += 1;
                }
                return;
            }

            if (a.status && a.status.toLowerCase() === 'cancelado') {
                card.classList.add('canceled');
                if (canceledList) canceledList.appendChild(card);
                canceledRevenue += Number(a.preco) || 0;
                return;
            }

            // passado e confirmado -> finished
            if (dt < new Date() && a.status && a.status.toLowerCase() === 'confirmado') {
                if (finished) addToFinishedList(a);
                return;
            }

            // hoje
            if (dt.toDateString() === new Date().toDateString()) {
                if (container) container.appendChild(card);
            } else {
                if (finished) addToFinishedList(a);
            }
        });

        updateRevenueDisplays();

    } catch (err) {
        console.error('Erro ao carregar agendamentos admin:', err);
    }
}

// Quando a página carrega, tentar puxar os agendamentos (se usuário for admin)
document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('userRole');
    console.log('Admin page role:', role);
    if (role === 'Admin') {
        loadAdminAppointments();
    } else {
        console.warn('Usuário não é admin — pulando carregamento de agendamentos admin.');
    }
});