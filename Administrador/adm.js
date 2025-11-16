// ===================================================
// == LÓGICA DO PAINEL ADMIN
// ===================================================

/**
 * Simula a confirmação de um agendamento.
 * O card fica verde e os botões desaparecem.
 */
function confirmAppointment(buttonElement) {
    const card = buttonElement.closest('.appointment-card');
    card.style.borderColor = 'var(--verde-sucesso)'; // Reusando a cor de sucesso
    
    const actions = card.querySelector('.card-actions');
    actions.innerHTML = '<p style="color: var(--verde-sucesso); font-weight: 600; margin: 0;">Confirmado!</p>';
}

/**
 * Simula o cancelamento de um agendamento.
 * O card fica vermelho (ou some).
 */
function cancelAppointment(buttonElement) {
    const card = buttonElement.closest('.appointment-card');
    card.style.opacity = '0.5';
    
    const actions = card.querySelector('.card-actions');
    actions.innerHTML = '<p style="color: #ff6b6b; font-weight: 600; margin: 0;">Cancelado</p>';
}