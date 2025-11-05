// ============================================
// SLIDER AUTOMÁTICO DO BANNER (INALTERADO)
// ============================================
// Seleciona o container do slider e os slides individuais.
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
// Inicializa o índice do slide atual em 0 (primeiro slide).
let currentSlide = 0;

// Função para avançar para o próximo slide (loop infinito).
function nextSlide() {
    // Incrementa o índice e usa módulo (%) para voltar ao início após o último slide.
    currentSlide = (currentSlide + 1) % slides.length;
    // Aplica transformação CSS para deslizar horizontalmente (cada slide = 100% largura).
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Inicia o intervalo: troca de slide a cada 3 segundos (3000ms) para carrossel automático.
setInterval(nextSlide, 3000);

// ============================================
// TABS NAVEGÁVEIS (INALTERADO)
// ============================================
// Seleciona todas as tabs e seções de conteúdo.
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.content-section');

// Adiciona event listener de clique em cada tab para alternar seções.
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove 'active' de todas as tabs e seções (desativa tudo).
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        // Ativa a tab clicada e a seção correspondente (via data-tab).
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// ============================================
// ACCORDION (EXPANDIR/RECOLHER CATEGORIAS) (INALTERADO)
// ============================================
// Seleciona todos os cabeçalhos do accordion.
const accordionHeaders = document.querySelectorAll('.accordion-header');

// Adiciona event listener de clique em cada cabeçalho para toggle.
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        // Busca o corpo do accordion pelo ID no data-target.
        const body = document.getElementById(header.dataset.target);
        // Verifica se já está ativo (para toggle: só um aberto por vez).
        const isActive = header.classList.contains('active');

        // Fecha todos os accordions (remove 'active' de cabeçalhos e corpos).
        accordionHeaders.forEach(h => {
            h.classList.remove('active');
            const b = document.getElementById(h.dataset.target);
            if (b) b.classList.remove('active');
        });

        // Se não estava ativo, abre apenas este (adiciona 'active' para expansão via CSS).
        if (!isActive) {
            header.classList.add('active');
            body.classList.add('active');
        }
    });
});

// ============================================
// SELEÇÃO DE SERVIÇOS E CONTROLE DO BOTÃO FLUTUANTE (AJUSTADO PARA O BOTÃO)
// ============================================
// Array para armazenar IDs dos serviços selecionados (ex: ['navalhado', 'social'] – usado para contagem e alerta).
let selectedServices = [];
// Seleciona todos os círculos de seleção de serviços.
const serviceSelectors = document.querySelectorAll('.service-select');

// Adiciona event listener de clique em cada seletor para marcar/desmarcar.
serviceSelectors.forEach(selector => {
    selector.addEventListener('click', () => {
        // Pega o ID do serviço do atributo data-service.
        const serviceName = selector.dataset.service;
        // Verifica se já está no array (índice > -1 significa selecionado).
        const index = selectedServices.indexOf(serviceName);

        if (index > -1) {
            // Desmarca: remove do array e da classe visual (círculo dourado some).
            selectedServices.splice(index, 1);
            selector.classList.remove('checked');
        } else {
            // Marca: adiciona ao array e à classe visual (círculo dourado aparece).
            selectedServices.push(serviceName);
            selector.classList.add('checked');
        }

        // Atualiza o botão flutuante com a nova contagem e visibilidade.
        updateNextButton();
    });
});

// Função para atualizar o botão "Próximo" (AJUSTE PRINCIPAL: Agora usa spans separados para duas linhas).
function updateNextButton() {
    // Seleciona o span da contagem pelo ID.
    const countSpan = document.getElementById('nextCount');
    // Seleciona o botão principal pelo ID.
    const button = document.getElementById('nextButton');
    // Calcula a quantidade de serviços selecionados.
    const count = selectedServices.length;

    // Atualiza apenas o texto da contagem (ex: "2 selecionados" – o título "Próximo" fica fixo no HTML/CSS).
    countSpan.textContent = `${count} selecionados`;

    // Se há pelo menos 1 seleção, mostra o botão (adiciona classe 'visible' para fade-in pop-up via CSS).
    if (count > 0) {
        button.classList.add('visible');
    } else {
        // Se zero, esconde o botão (remove classe, opacidade 0 e visibility hidden).
        button.classList.remove('visible');
    }
}

// Função chamada ao clicar no botão "Próximo" (AJUSTE: Usa selectedServices para alerta detalhado).
// Nota: Definida como global para funcionar com onclick no HTML.
function nextStep() {
    // Verifica se há seleções antes de prosseguir.
    if (selectedServices.length > 0) {
        // Alerta simula avanço: lista os serviços selecionados (em app real, redirecione ou abra modal).
        alert(`Avançando para próxima etapa do agendamento!\nServiços selecionados: ${selectedServices.join(', ')}\nTotal: ${selectedServices.length} itens.`);
        // Exemplo para produção: window.location.href = 'agendamento.html?services=' + selectedServices.join(',');
        // Ou limpe seleções após clique: selectedServices = []; updateNextButton();
    } else {
        // Fallback se não houver seleções (não deve acontecer, mas previne erros).
        alert('Selecione pelo menos um serviço para prosseguir.');
    }
}

// ============================================
// BUSCA EM TEMPO REAL (INALTERADO, MAS COMPATÍVEL COM BOTÃO)
// ============================================
// Seleciona o input de busca e todos os itens de serviço.
const searchInput = document.getElementById('searchInput');
const serviceItems = document.querySelectorAll('.service-item');

// Event listener para 'input' (dispara a cada tecla, filtra em tempo real).
searchInput.addEventListener('input', (e) => {
    // Texto da busca em minúsculas (case-insensitive).
    const query = e.target.value.toLowerCase();
    // Itera sobre cada item de serviço.
    serviceItems.forEach(item => {
        // Pega o texto do item (nome, tempo, preço) em minúsculas.
        const text = item.textContent.toLowerCase();
        // Mostra se contém a query (display: flex mantém layout); esconde caso contrário.
        item.style.display = text.includes(query) ? 'flex' : 'none';
    });
    // Nota: A busca filtra visualmente, mas a contagem do botão considera todas as seleções (mesmo ocultas).
});

// ============================================
// FUNÇÃO PARA ÍCONE DE RELÓGIO (ADICIONADA PARA COMPLETAR CONTATOS)
// ============================================
// Função global chamada pelo onclick no ícone de relógio (simula exibição de horários).
function showSchedule() {
    alert('Horários de Atendimento:\nSegunda a Sábado: 9h às 20h\nDomingo: Fechado\nFeriados: Consultar via WhatsApp.');
}

// ============================================
// NOTAS FINAIS
// ============================================
// - O botão flutuante é atualizado automaticamente em seleções, independentemente de tabs ou busca.
// - Para múltiplos accordions abertos: Remova o loop de fechamento no accordion.
// - Teste: Abra index.html, selecione serviços – o botão aparece com contagem em duas linhas.
// - Expansão: Adicione mais .service-select no HTML; o JS gerencia tudo.
