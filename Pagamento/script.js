document.addEventListener('DOMContentLoaded', () => {
    updateContinueButton();
});

let selectedMethod = null;

// Cache dos elementos
const pixDetails = document.getElementById('pix-details');
const cartaoDetails = document.getElementById('cartao-details');
const payNowButton = document.getElementById('payNowButton');

function selectPayment(element, method) {
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });

    pixDetails.classList.add('hidden');
    cartaoDetails.classList.add('hidden');

    element.classList.add('selected');
    selectedMethod = method;

    if (method === 'pix') {
        pixDetails.classList.remove('hidden');
    } else if (method === 'cartao') {
        cartaoDetails.classList.remove('hidden');
    }

    updateContinueButton();
}

function updateContinueButton() {
    if (selectedMethod) {
        payNowButton.classList.remove('hidden');
    } else {
        payNowButton.classList.add('hidden');
    }
}

function goBack() {
    window.location.href = "../Home/index.html?action=openAgendarModal";
}

function continuePayment() {
    if (!selectedMethod) return;

    agendarServicos();
}

async function agendarServicos() {
    const appointmentData = JSON.parse(sessionStorage.getItem('currentAppointment'));
    if (!appointmentData) {
        alert('Erro: Dados do agendamento não encontrados.');
        return;
    }

    const { selections, professional, time } = appointmentData;
    if (!selections || selections.length === 0) {
        alert('Erro: Nenhum serviço selecionado.');
        return;
    }
    if (!time) {
        alert('Erro: Horário não selecionado.');
        return;
    }
    
    const today = new Date();
    const [hours, minutes] = time.split(':');
    today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const dataHora = today.toISOString();

    console.log('Iniciando agendamento de', selections.length, 'serviço(s)...');
    console.log('Horário:', dataHora);
    console.log('Profissional:', professional);

    try {
        const agendamentosRealizados = [];
        const agendamentosFalhados = [];

        for (let i = 0; i < selections.length; i++) {
            const selection = selections[i];
            try {
                const agendamento = {
                    tipoCorte: selection.name,
                    dataHora: dataHora,
                    preco: Math.round(selection.price)
                };
                
                console.log(`Enviando agendamento ${i + 1}/${selections.length}:`, agendamento);
                const response = await window.API.createAgendamento(agendamento);
                console.log(`Agendamento ${i + 1} criado com sucesso:`, response);
                agendamentosRealizados.push(selection.name);
            } catch (error) {
                console.error(`Erro ao criar agendamento ${i + 1}:`, error);
                agendamentosFalhados.push({ nome: selection.name, erro: error.message });
            }
        }

        // Exibe resultado final
        if (agendamentosFalhados.length === 0) {
            alert(`${agendamentosRealizados.length} agendamento(s) realizado(s) com sucesso!\n\nServiços: ${agendamentosRealizados.join(', ')}`);
            sessionStorage.removeItem('currentAppointment');
            window.location.href = "../Agendamentos/agendamento.html";
        } else if (agendamentosRealizados.length > 0) {
            // Alguns funcionaram, outros não
            const mensagem = `Agendamento parcialmente concluído:\n\n` +
                `Realizados (${agendamentosRealizados.length}): ${agendamentosRealizados.join(', ')}\n\n` +
                `Falharam (${agendamentosFalhados.length}): ${agendamentosFalhados.map(f => f.nome).join(', ')}`;
            alert(mensagem);
            sessionStorage.removeItem('currentAppointment');
            window.location.href = "../Agendamentos/agendamento.html";
        } else {
            // Todos falharam
            const mensagem = `Erro ao realizar agendamentos:\n\n` +
                agendamentosFalhados.map(f => `${f.nome}: ${f.erro}`).join('\n');
            alert(mensagem);
        }
    } catch (error) {
        console.error("Erro no agendamento:", error);
        alert('Erro no agendamento: ' + error.message);
    }
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