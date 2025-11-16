// Importa a URL base da API
import { BASE_URL } from 'serves/api.js'; 

document.addEventListener('DOMContentLoaded', () => {
    
    // Lógica para alternar visualização de senha
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    });

    // Lógica de submissão do formulário de registro (AGORA COM API)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // 1. Adiciona 'async' para podermos usar 'await'
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 2. Coleta os dados do formulário
            const nome = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const telefone = document.getElementById('reg-phone').value;
            const password = document.getElementById('reg-password').value;

            // 3. Monta o DTO (igual ao da documentação)
            const registrarDto = {
                nome,
                email,
                password,
                telefone
            };

            // 4. Envia para a API (fetch)
            try {
                const response = await fetch(`${BASE_URL}/Auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(registrarDto)
                });

                // 5. Trata a resposta (Status 201 = Criado com Sucesso)
                if (response.status === 201) {
                    const data = await response.json();
                    console.log("Resposta API:", data); // { message: "Usuário criado...", user: {...} }
                    alert('Conta criada com sucesso! Redirecionando para o Login.');
                    window.location.href = "../Login/index.html";
                } else {
                    // Trata erros (ex: email já existe, senha fraca, etc.)
                    const errorData = await response.json();
                    alert(`Erro ao registrar: ${errorData.message || 'Tente novamente.'}`);
                }
            } catch (error) {
                console.error('Falha na rede ou API .NET offline:', error);
                alert('Não foi possível conectar ao servidor. Verifique se sua API .NET está rodando.');
            }
        });
    }

    // Lógica do Botão Google (simulação)
    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Login com Google (ainda não implementado)');
        });
    }
});