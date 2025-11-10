// ===================================================
// == LÓGICA DO CARROSSEL (BANNER)
// ===================================================
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

// ===================================================
// == LÓGICA DA PÁGINA AGENDAMENTOS
// ===================================================

/**
 * Redireciona o usuário de volta para a página de Serviços (Home).
 */
function goToServicosTab() {
    // Caminho relativo: sobe 1 (../) e entra na pasta Home/
    window.location.href = "../Home/index.html";
}

/**
 * Lógica principal da página (simulação).
 * Verifica se o usuário tem agendamentos.
 */
function checkAppointments() {
    // Simulação: por enquanto, o usuário nunca tem agendamentos.
    const userAppointments = []; // Array vazio

    if (userAppointments.length > 0) {
        // (Lógica futura): Esconder o .empty-state e mostrar 
        // a lista de agendamentos reais.
    } else {
        // Garante que o estado de "Nenhum agendamento" está visível.
        // (Já está visível no HTML, então nada precisa ser feito aqui
        // a menos que tivéssemos que esconder um loader).
    }
}


// ===================================================
// == INICIALIZAÇÃO
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
    initCarousel(); 
    checkAppointments();
});