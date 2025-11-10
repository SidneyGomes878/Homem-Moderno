// ===================================================
// == ESTADO GLOBAL DO APLICATIVO
// ===================================================

let allSelections = [];
let selectedProfessional = null;
let selectedTime = null;
let userAppointments = []; 

// NOVO: Variável para armazenar os dados do modal atual
let currentModalData = {}; 

// ===================================================
// == ELEMENTOS DO DOM (CACHE)
// ===================================================
const homeWrapper = document.getElementById('homeWrapper');
const nextButtonHome = document.getElementById('nextButtonHome');
const nextCountHome = document.getElementById('nextCountHome');
const tabServicos = document.getElementById('tab-serviços');
const tabAgendamentos = document.getElementById('tab-agendamentos');
const contentServicos = document.getElementById('servicosContent');
const contentAgendamentos = document.getElementById('agendamentosContent');
const sliderTrack = document.getElementById('sliderTrack');
const sliderNav = document.getElementById('sliderNav');
const slides = sliderTrack ? sliderTrack.querySelectorAll('.slide') : [];
const slideCount = slides.length;
let currentSlide = 0;
let slideInterval;
const proximoModal = document.getElementById('proximoModal');
const professionalList = document.getElementById('professionalList');
const timeList = document.getElementById('timeList');
const nextButtonProximo = document.getElementById('nextButtonProximo');
const nextCountProximo = document.getElementById('nextCountProximo');
const agendarModal = document.getElementById('agendarModal');
const modalItemsList = document.getElementById('modalItemsList');
const modalTotalAmountSpan = document.getElementById('modalTotalAmount');


// ===================================================
// == LÓGICA DO CARROSSEL (BANNER)
// ===================================================
function createDots() { if (!sliderNav || slideCount === 0) return; sliderNav.innerHTML = ''; for (let i = 0; i < slideCount; i++) { const dot = document.createElement('div'); dot.classList.add('slider-dot'); dot.setAttribute('data-slide', i); dot.addEventListener('click', () => { goToSlide(i); resetInterval(); }); sliderNav.appendChild(dot); } }
function updateDots() { const dots = document.querySelectorAll('.slider-dot'); dots.forEach(dot => { dot.classList.remove('active'); if (parseInt(dot.getAttribute('data-slide')) === currentSlide) { dot.classList.add('active'); } }); }
function goToSlide(slideIndex) { if (!sliderTrack) return; const offset = -(100 / slideCount) * slideIndex; sliderTrack.style.transform = `translateX(${offset}%)`; currentSlide = slideIndex; updateDots(); }
function nextSlide() { let nextIndex = (currentSlide + 1) % slideCount; goToSlide(nextIndex); }
function startInterval() { clearInterval(slideInterval); slideInterval = setInterval(nextSlide, 3000); }
function resetInterval() { clearInterval(slideInterval); startInterval(); }
function initCarousel() { if (slides.length > 0) { createDots(); goToSlide(0); startInterval(); } }


// ===================================================
// == LÓGICA DA TELA HOME (ETAPA 1)
// ===================================================

function showTab(tabName, element) {
    if (tabName === 'agendamentos') {
        if (userAppointments.length > 0) {
            openAgendarModal(true); 
            return; 
        }
    }
    contentServicos.classList.add('hidden');
    contentAgendamentos.classList.add('hidden');
    tabServicos.classList.remove('active');
    tabAgendamentos.classList.remove('active');
    if (tabName === 'servicos') {
        contentServicos.classList.remove('hidden');
    } else if (tabName === 'agendamentos') {
        contentAgendamentos.classList.remove('hidden');
    }
    if (element) {
        element.classList.add('active');
    }
}

// NOVO: Função para o link "Adicionar mais itens"
function goToHome() {
    closeAgendarModal();
}

/**
 * Helper para o botão "Agendar agora"
 */
function goToServicosTab() {
    showTab('servicos', tabServicos);
}

function toggleItem(element, itemName, type) {
    const price = parseFloat(element.getAttribute('data-price'));
    const itemIndex = allSelections.findIndex(s => s.name === itemName);
    if (itemIndex === -1) {
        allSelections.push({ name: itemName, price: price, type: type });
        element.classList.add('selected');
    } else {
        allSelections.splice(itemIndex, 1);
        element.classList.remove('selected');
    }
    updateHomeNextButton();
}

function updateHomeNextButton() {
    const count = allSelections.length;
    if (count > 0) {
        nextButtonHome.classList.remove('hidden');
    } else {
        nextButtonHome.classList.add('hidden');
    }
    nextCountHome.textContent = `${count} selecionado${count !== 1 ? 's' : ''}`;
}

function handleNextStep() {
    if (allSelections.length === 0) return;
    const hasServices = allSelections.some(item => item.type === 'service');
    if (hasServices) {
        openProximoModal();
    } else {
        openAgendarModal(false);
    }
}

// ===================================================
// == LÓGICA DO MODAL "PRÓXIMO" (ETAPA 2)
// ===================================================
function openProximoModal() { proximoModal.classList.remove('hidden'); homeWrapper.classList.add('hidden'); resetProximoSelections(); }
function closeProximoModal() { proximoModal.classList.add('hidden'); homeWrapper.classList.remove('hidden'); }
function resetProximoSelections() { selectedProfessional = null; selectedTime = null; professionalList.querySelectorAll('.selection-item').forEach(item => item.classList.remove('selected')); timeList.querySelectorAll('.time-slot').forEach(item => item.classList.remove('selected')); updateProximoNextButton(); }
function selectProfessional(element, name) { professionalList.querySelectorAll('.selection-item').forEach(item => item.classList.remove('selected')); element.classList.add('selected'); selectedProfessional = name; updateProximoNextButton(); }
function selectTime(element, time) { timeList.querySelectorAll('.time-slot').forEach(item => item.classList.remove('selected')); element.classList.add('selected'); selectedTime = time; updateProximoNextButton(); }
function updateProximoNextButton() { if (selectedProfessional && selectedTime) { nextButtonProximo.classList.remove('hidden'); nextCountProximo.textContent = `${selectedProfessional} @ ${selectedTime}`; } else { nextButtonProximo.classList.add('hidden'); nextCountProximo.textContent = 'Selecione'; } }

// ===================================================
// == LÓGICA DO MODAL "AGENDAR" (ETAPA 3)
// ===================================================

/**
 * Abre o modal final "Agendar".
 * (ATUALIZADO: Salva dados no currentModalData)
 */
function openAgendarModal(isViewing = false) { 
    
    if (isViewing) {
        currentModalData = userAppointments[0];
    } else {
        const newAppointment = {
            selections: [...allSelections], 
            professional: selectedProfessional,
            time: selectedTime
        };
        userAppointments = [newAppointment]; 
        currentModalData = newAppointment;
    }
    
    loadAgendarSummary();
    
    proximoModal.classList.add('hidden');
    homeWrapper.classList.add('hidden');
    agendarModal.classList.remove('hidden');
}

/**
 * Fecha o modal "Agendar" e reseta o fluxo.
 * (ATUALIZADO: Limpa currentModalData)
 */
function closeAgendarModal() {
    agendarModal.classList.add('hidden');
    homeWrapper.classList.remove('hidden'); 
    
    allSelections = [];
    selectedProfessional = null;
    selectedTime = null;
    currentModalData = {}; // Limpa os dados do modal atual
    updateHomeNextButton();

    document.querySelectorAll('.service-item.selected').forEach(item => item.classList.remove('selected'));
    
    goToServicosTab();
}

/**
 * NOVO: Remove um item da lista de resumo (Modal Agendar)
 * @param {number} index - O índice do item a ser removido
 */
function removeItem(index) {
    if (currentModalData && currentModalData.selections) {
        // Remove o item do array de dados do modal atual
        currentModalData.selections.splice(index, 1);
        
        // Se este era um agendamento salvo, atualiza o "banco de dados"
        if (userAppointments.includes(currentModalData)) {
             userAppointments[0] = currentModalData;
        }

        // Recarrega o resumo (que agora lê de currentModalData)
        loadAgendarSummary();

        // Se o carrinho do modal ficar vazio, força o fechamento
        if (currentModalData.selections.length === 0) {
            userAppointments = []; // Limpa o agendamento salvo
            closeAgendarModal();
        }
    }
}


/**
 * Carrega o resumo final no modal "Agendar".
 * (ATUALIZADO: Lê de currentModalData, adiciona ícone de lixeira)
 */
function loadAgendarSummary() {
    let totalValue = 0;
    modalItemsList.innerHTML = '<h3>ITENS</h3>'; 
    let itemHtml = '';

    // Verifica se currentModalData está preenchido
    if (!currentModalData || !currentModalData.selections || currentModalData.selections.length === 0) {
        modalItemsList.insertAdjacentHTML('beforeend', '<p style="color:#888; text-align: center;">Nenhum item selecionado.</p>');
        modalTotalAmountSpan.textContent = `R$0,00`;
        return;
    }

    currentModalData.selections.forEach((item, index) => {
        const priceFormatted = `R$${item.price.toFixed(2).replace('.', ',')}`;
        totalValue += item.price;

        let detailsHtml = '';
        
        if (item.type === 'service') {
            detailsHtml = `<p class="item-time-prof">${currentModalData.time || 'N/A'}<br>Profissional: ${currentModalData.professional || 'N/A'}</p>`;
        } else {
             detailsHtml = `<p class="item-time-prof">Produto</p>`;
        }

        // Template ATUALIZADO com a lixeira
        itemHtml += `
            <div class="item-card" id="item-card-${index}">
                <div class="item-details">
                    <p class="item-name">${index + 1}. ${item.name}</p>
                    ${detailsHtml}
                </div>
                <div class="item-price-container">
                    <span class="item-price">${priceFormatted}</span>
                    <i class="fas fa-trash-alt delete-icon" onclick="removeItem(${index})"></i>
                </div>
            </div>
        `;
    });

    modalItemsList.insertAdjacentHTML('beforeend', itemHtml);
    modalTotalAmountSpan.textContent = `R$${totalValue.toFixed(2).replace('.', ',')}`;
}

// ===================================================
// == INICIALIZAÇÃO
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
    updateHomeNextButton();
    initCarousel(); 
    showTab('servicos', document.getElementById('tab-serviços'));
});