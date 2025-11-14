document.addEventListener('DOMContentLoaded', () => {
    // Esconde o botão "Pagar agora" no início
    updateContinueButton();
});

let selectedMethod = null;

// Cache dos elementos
const pixDetails = document.getElementById('pix-details');
const cartaoDetails = document.getElementById('cartao-details');
const payNowButton = document.getElementById('payNowButton'); // ID do novo botão flutuante

function selectPayment(element, method) {
    // Limpa seleção anterior
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Esconde todas as "caixinhas"
    pixDetails.classList.add('hidden');
    cartaoDetails.classList.add('hidden');

    // Adiciona seleção ao clicado
    element.classList.add('selected');
    selectedMethod = method;

    // Mostra a "caixinha" correta
    if (method === 'pix') {
        pixDetails.classList.remove('hidden');
    } else if (method === 'cartao') {
        cartaoDetails.classList.remove('hidden');
    }

    // Mostra o botão flutuante
    updateContinueButton();
}

function updateContinueButton() {
    // Controla a VISIBILIDADE (hidden) em vez de 'disabled'
    if (selectedMethod) {
        payNowButton.classList.remove('hidden');
    } else {
        payNowButton.classList.add('hidden');
    }
}

function goBack() {
    // Volta para a Home e reabre o modal de Agendar (simulação)
    window.location.href = "../Home/index.html?action=openAgendarModal";
}

function continuePayment() {
    if (!selectedMethod) return;

    if (selectedMethod === 'pix') {
        alert('Simulação: Pagamento PIX selecionado. (Em produção, aqui você verificaria o status do pagamento)');
    } else if (selectedMethod === 'cartao') {
        alert('Simulação: Pagamento Cartão selecionado. (Em produção, aqui você enviaria os dados do cartão)');
    }
    
    // (Lógica futura de pagamento)
}

function copyPixKey() {
    const pixKeyInput = document.getElementById('pixKeyInput');
    
    // Mostra o campo (necessário para o 'select')
    pixKeyInput.style.display = 'block'; 
    pixKeyInput.select();
    pixKeyInput.setSelectionRange(0, 99999); // Para mobile

    try {
        // Tenta copiar o texto
        document.execCommand('copy');
        alert('Chave PIX fictícia copiada!');
    } catch (err) {
        alert('Erro ao copiar a chave.');
    }

    // Esconde o campo novamente
    pixKeyInput.style.display = 'none';
}