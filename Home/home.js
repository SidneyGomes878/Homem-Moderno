// ===================================================
// == ESTADO GLOBAL DO APLICATIVO
// ===================================================

let allSelections = [];
let selectedProfessional = null;
let selectedTime = null;
let userAppointments = []; 
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

// Cache dos novos elementos do Modal Agendar
const successMessage = document.getElementById('successMessage');
const payButton = document.getElementById('payButton');

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
    
    // Garante que tabServicos e tabAgendamentos existam antes de usar
    if(tabServicos) tabServicos.classList.remove('active');
    if(tabAgendamentos) tabAgendamentos.classList.remove('active');

    if (tabName === 'servicos') {
        if(contentServicos) contentServicos.classList.remove('hidden');
    } else if (tabName === 'agendamentos') {
        if(contentAgendamentos) contentAgendamentos.classList.remove('hidden');
    }
    if (element) {
        element.classList.add('active');
    }
}

function goToHome() {
    closeAgendarModal();
}

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
        checkLoginAndProceed();
    }
}

// ===================================================
// == LÓGICA DE VERIFICAÇÃO DE LOGIN
// ===================================================
function checkLoginAndProceed() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        openAgendarModal(false);
    } else {
        alert("Você precisa fazer login para continuar o agendamento.");
        window.location.href = "../Login/index.html";
    }
}

// ===================================================
// == LÓGICA DA BARRA DE PESQUISA
// ===================================================
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    const serviceItems = document.querySelectorAll('.service-item');

    searchInput.addEventListener('input', (e) => {
        const filterText = e.target.value.toLowerCase().trim();

        serviceItems.forEach(item => {
            const nameElement = item.querySelector('.service-name');
            if (nameElement) {
                const name = nameElement.textContent.toLowerCase();
                if (name.includes(filterText)) {
                    item.style.display = ''; 
                } else {
                    item.style.display = 'none';
                }
            }
        });
    });
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

// NOVO: Função de pagamento
function processPayment() {
    // 1. Mostra a mensagem de sucesso
    if(successMessage) {
        successMessage.classList.remove('hidden');
    }

    // 2. Esconde o botão de pagar
    if(payButton) {
        payButton.classList.add('hidden');
    }
    
    // 3. (Simulação) Fecha o modal e reseta tudo após 3 segundos
    setTimeout(() => {
        closeAgendarModal();
    }, 3000); // Espera 3 segundos
}


function openAgendarModal(isViewing = false) { 
    
    // Garante que a UI esteja no estado inicial
    if(successMessage) {
        successMessage.classList.add('hidden');
    }
    if(payButton) {
        payButton.classList.remove('hidden');
    }

    if (isViewing) {
        currentModalData = userAppointments[0];
    } else {
        const newAppointment = {
            selections: [...allSelections], 
            professional: selectedProfessional,
            time: selectedTime
        };
        // Salva no "BD" (se for um novo agendamento, não só visualização)
        if (!isViewing) {
            userAppointments = [newAppointment]; 
        }
        currentModalData = newAppointment;
    }
    
    loadAgendarSummary();
    
    proximoModal.classList.add('hidden');
    homeWrapper.classList.add('hidden');
    agendarModal.classList.remove('hidden');
}

function closeAgendarModal() {
    agendarModal.classList.add('hidden');
    homeWrapper.classList.remove('hidden'); 
    
    allSelections = [];
    selectedProfessional = null;
    selectedTime = null;
    currentModalData = {}; 
    updateHomeNextButton();

    document.querySelectorAll('.service-item.selected').forEach(item => item.classList.remove('selected'));
    
    // Se o usuário não tiver agendamentos, volta para "Serviços"
    // Se tiver, deixa na aba "Agendamentos" (para ele ver o que acabou de agendar)
    if(userAppointments.length === 0) {
        goToServicosTab();
    } else {
        showTab('agendamentos', tabAgendamentos);
    }
}

function removeItem(index) {
    if (currentModalData && currentModalData.selections) {
        const itemToRemove = currentModalData.selections[index];
        // Remove do array de dados do modal atual
        currentModalData.selections.splice(index, 1);
        
        // Remove do array de seleção global (carrinho)
        allSelections = allSelections.filter(item => item.name !== itemToRemove.name);
        
        if (userAppointments.includes(currentModalData)) {
             userAppointments[0] = currentModalData;
        }

        loadAgendarSummary();
        updateHomeNextButton(); // Atualiza o contador do botão flutuante da Home

        if (currentModalData.selections.length === 0) {
            userAppointments = []; 
            closeAgendarModal();
        }
    }
}

function loadAgendarSummary() {
    let totalValue = 0;
    modalItemsList.innerHTML = '<h3>ITENS</h3>'; 
    let itemHtml = '';

    if (!currentModalData || !currentModalData.selections || currentModalData.selections.length === 0) {
        modalItemsList.insertAdjacentHTML('beforeend', '<p style="color:#888; text-align: center;">Nenhum item selecionado.</p>');
        modalTotalAmountSpan.textContent = `R$0,00`;
        // Esconde o botão de pagar se não houver itens
        if(payButton) payButton.classList.add('hidden');
        return;
    }

    // Garante que o botão de pagar está visível se houver itens
    if(payButton) payButton.classList.remove('hidden');

    currentModalData.selections.forEach((item, index) => {
        const priceFormatted = `R$${item.price.toFixed(2).replace('.', ',')}`;
        totalValue += item.price;

        let detailsHtml = '';
        
        if (item.type === 'service') {
            detailsHtml = `<p class="item-time-prof">${currentModalData.time || 'N/A'}<br>Profissional: ${currentModalData.professional || 'N/A'}</p>`;
        } else {
             detailsHtml = `<p class="item-time-prof">Produto</p>`;
        }

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
    showTab('serviços', document.getElementById('tab-serviços'));
    initSearch();
});