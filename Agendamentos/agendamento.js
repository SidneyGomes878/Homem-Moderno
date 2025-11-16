const sliderTrack = document.getElementById('sliderTrack');
const sliderNav = document.getElementById('sliderNav');
const slides = sliderTrack ? sliderTrack.querySelectorAll('.slide') : [];
const slideCount = slides.length;
let currentSlide = 0;
let slideInterval;

function createDots() {
    if (!sliderNav || slideCount === 0) return;
    sliderNav.innerHTML = ''; 
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        dot.setAttribute('data-slide', i);
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetInterval(); 
        });
        sliderNav.appendChild(dot);
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
        if (parseInt(dot.getAttribute('data-slide')) === currentSlide) {
            dot.classList.add('active');
        }
    });
}

function goToSlide(slideIndex) {
    if (!sliderTrack) return;
    const offset = -(100 / slideCount) * slideIndex;
    sliderTrack.style.transform = `translateX(${offset}%)`;
    currentSlide = slideIndex;
    updateDots();
}

function nextSlide() {
    let nextIndex = (currentSlide + 1) % slideCount;
    goToSlide(nextIndex);
}

function startInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000); 
}

function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
}

function initCarousel() {
    if (slides.length > 0) {
        createDots();
        goToSlide(0);
        startInterval();
    }
}

function goToServicosTab() {
    window.location.href = "../Home/index.html";
}

async function checkAppointments() {
    try {
        const userAppointments = await window.API.getMyAgendamentos();
        
        if (userAppointments && userAppointments.agendamentos && userAppointments.agendamentos.length > 0) {
            const emptyState = document.querySelector('.empty-state');
            if (emptyState) emptyState.style.display = 'none';
            
            renderAppointments(userAppointments.agendamentos);
        } else {
            // Garante que o estado de "Nenhum agendamento" está visível.
        }
    } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        alert('Erro ao carregar agendamentos: ' + error.message);
    }
}

function renderAppointments(appointments) {
    const container = document.getElementById('agendamentosContent');
    if (!container) return;
    
    // Criar container para os cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'appointments-cards';
    
    appointments.forEach(appointment => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <div class="card-header">
                <h4>${appointment.tipoCorte}</h4>
                <div class="card-actions">
                    <button class="action-btn delete-btn" onclick="cancelAppointment(${appointment.id})" title="Cancelar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <p><i class="fas fa-calendar"></i> ${new Date(appointment.dataHora).toLocaleDateString()}</p>
                <p><i class="fas fa-clock"></i> ${new Date(appointment.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p><i class="fas fa-dollar-sign"></i> R$ ${appointment.preco}</p>
                <p class="status ${appointment.status.toLowerCase()}"><i class="fas fa-info-circle"></i> ${appointment.status}</p>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
    
    container.appendChild(cardsContainer);
}

async function reagendar(id) {
    try {
        const appointment = await window.API.getAgendamentoById(id);
        const newDateTime = prompt('Digite a nova data e hora (YYYY-MM-DDTHH:MM):', appointment.dataHora.slice(0,16));
        if (newDateTime) {
            await window.API.updateAgendamento(id, {
                tipoCorte: appointment.tipoCorte,
                dataHora: newDateTime,
                preco: appointment.preco
            });
            alert('Agendamento reagendado com sucesso!');
            location.reload();
        }
    } catch (error) {
        console.error('Erro ao reagendar:', error);
        alert('Erro ao reagendar: ' + error.message);
    }
}

async function cancelAppointment(id) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        try {
            await window.API.cancelAgendamento(id);
            alert('Agendamento cancelado com sucesso!');
            // Recarregar a página para atualizar a lista
            location.reload();
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
            alert('Erro ao cancelar agendamento: ' + error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initCarousel(); 
    checkAppointments();
    
    // Verifica se o usuário está logado e mostra logout
    const token = localStorage.getItem('authToken');
    const logoutBtn = document.getElementById('logoutBtn');
    if (token && logoutBtn) {
        logoutBtn.style.display = 'inline-block';
    }
});

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    window.location.href = "../Login/index.html";
}