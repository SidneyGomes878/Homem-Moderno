// ===================================================
// == ESTADO GLOBAL DO APLICATIVO
// ===================================================

// Array global para armazenar os serviços selecionados.
// { name: 'Corte Social', price: 25.00 }
let selectedServices = [];

// Variáveis globais para armazenar as seleções do Modal "Próximo"
let selectedProfessional = null;
let selectedTime = null;

// ===================================================
// == ELEMENTOS DO DOM (CACHE)
// ===================================================

// Wrapper da Home
const homeWrapper = document.getElementById('homeWrapper');

// Botão Flutuante da Home
const nextButtonHome = document.getElementById('nextButtonHome');
const nextCountHome = document.getElementById('nextCountHome');

// Modal 1: Próximo
const proximoModal = document.getElementById('proximoModal');
const professionalList = document.getElementById('professionalList');
const timeList = document.getElementById('timeList');
const nextButtonProximo = document.getElementById('nextButtonProximo');
const nextCountProximo = document.getElementById('nextCountProximo');

// Modal 2: Agendar
const agendarModal = document.getElementById('agendarModal');
const modalItemsList = document.getElementById('modalItemsList');
const modalTotalAmountSpan = document.getElementById('modalTotalAmount');


// ===================================================
// == LÓGICA DA TELA HOME (ETAPA 1)
// ===================================================

/**
 * Adiciona ou remove um serviço da seleção.
 * Chamado pelo onclick de cada .service-item na Home.
 */
function toggleService(element, serviceName) {
    const price = parseFloat(element.getAttribute('data-price'));
    const serviceIndex = selectedServices.findIndex(s => s.name === serviceName);

    if (serviceIndex === -1) {
        selectedServices.push({ name: serviceName, price: price });
        element.classList.add('selected');
    } else {
        selectedServices.splice(serviceIndex, 1);
        element.classList.remove('selected');
    }
    
    updateHomeNextButton();
}

/**
 * Atualiza o botão flutuante "Próximo" da Home (visibilidade e contagem).
 */
function updateHomeNextButton() {
    const count = selectedServices.length;
    
    if (count > 0) {
        nextButtonHome.classList.remove('hidden');
    } else {
        nextButtonHome.classList.add('hidden');
    }
    nextCountHome.textContent = `${count} selecionado${count !== 1 ? 's' : ''}`;
}

// ===================================================
// == LÓGICA DO MODAL "PRÓXIMO" (ETAPA 2)
// ===================================================

/**
 * Abre o modal "Próximo" (Etapa 2).
 * Chamado pelo botão flutuante da Home.
 */
function openProximoModal() {
    if (selectedServices.length > 0) {
        proximoModal.classList.remove('hidden');
        homeWrapper.classList.add('hidden'); // Esconde a Home
        // Reseta as seleções anteriores do modal "Próximo"
        resetProximoSelections();
    }
}

/**
 * Fecha o modal "Próximo" e volta para a Home.
 */
function closeProximoModal() {
    proximoModal.classList.add('hidden');
    homeWrapper.classList.remove('hidden'); // Mostra a Home
}

/**
 * Reseta as seleções dentro do modal "Próximo".
 */
function resetProximoSelections() {
    selectedProfessional = null;
    selectedTime = null;

    // Limpa classes 'selected' dos profissionais
    professionalList.querySelectorAll('.selection-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Limpa classes 'selected' dos horários
    timeList.querySelectorAll('.time-slot').forEach(item => {
        item.classList.remove('selected');
    });

    updateProximoNextButton();
}

/**
 * Seleciona um profissional.
 */
function selectProfessional(element, name) {
    // Remove 'selected' de outros
    professionalList.querySelectorAll('.selection-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Adiciona 'selected' ao clicado
    element.classList.add('selected');
    selectedProfessional = name;
    
    updateProximoNextButton();
}

/**
 * Seleciona um horário.
 */
function selectTime(element, time) {
    // Remove 'selected' de outros
    timeList.querySelectorAll('.time-slot').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Adiciona 'selected' ao clicado
    element.classList.add('selected');
    selectedTime = time;
    
    updateProximoNextButton();
}

/**
 * Atualiza o botão flutuante 2 (dentro do modal "Próximo").
 * Mostra apenas se profissional E horário foram selecionados.
 */
function updateProximoNextButton() {
    if (selectedProfessional && selectedTime) {
        nextButtonProximo.classList.remove('hidden');
        nextCountProximo.textContent = `${selectedProfessional} @ ${selectedTime}`;
    } else {
        nextButtonProximo.classList.add('hidden');
        nextCountProximo.textContent = 'Selecione';
    }
}


// ===================================================
// == LÓGICA DO MODAL "AGENDAR" (ETAPA 3)
// ===================================================

/**
 * Abre o modal final "Agendar" (Etapa 3).
 * Chamado pelo botão flutuante do modal "Próximo".
 */
function openAgendarModal() {
    // 1. Carrega os dados no modal ANTES de exibi-lo
    loadAgendarSummary();
    
    // 2. Esconde o modal "Próximo"
    proximoModal.classList.add('hidden');
    
    // 3. Exibe o modal "Agendar"
    agendarModal.classList.remove('hidden');
}

/**
 * Fecha o modal "Agendar" e reseta todo o fluxo, voltando para a Home.
 */
function closeAgendarModal() {
    agendarModal.classList.add('hidden');
    homeWrapper.classList.remove('hidden'); // Mostra a Home
    
    // Reseta o estado global para um novo agendamento
    selectedServices = [];
    selectedProfessional = null;
    selectedTime = null;
    updateHomeNextButton();

    // Desmarcar itens na Home
    document.querySelectorAll('.service-item.selected').forEach(item => {
        item.classList.remove('selected');
    });
}

/**
 * Carrega o resumo final no modal "Agendar".
 * Puxa dados de `selectedServices`, `selectedProfessional` e `selectedTime`.
 */
function loadAgendarSummary() {
    let totalValue = 0;
    
    // Limpa a lista (mantendo o título H3)
    modalItemsList.innerHTML = '<h3>ITENS</h3>'; 

    let itemHtml = '';
    selectedServices.forEach((service, index) => {
        const priceFormatted = `R$${service.price.toFixed(2).replace('.', ',')}`;
        totalValue += service.price;

        itemHtml += `
            <div class="item-card">
                <div class="item-details">
                    <p class="item-name">${index + 1}. ${service.name}</p>
                    <p class="item-time-prof">${selectedTime}<br>Profissional: ${selectedProfessional}</p>
                </div>
                <span class="item-price">${priceFormatted}</span>
            </div>
        `;
    });

    modalItemsList.insertAdjacentHTML('beforeend', itemHtml);
    modalTotalAmountSpan.textContent = `R$${totalValue.toFixed(2).replace('.', ',')}`;
}

// Inicialização: Garante que os botões flutuantes estão ocultos
document.addEventListener('DOMContentLoaded', () => {
    updateHomeNextButton();
});