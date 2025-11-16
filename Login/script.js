// Importa o BASE_URL e a função de salvar o token
import { BASE_URL, salvarToken } from 'serves/api.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('user-password');
    const loginForm = document.getElementById('loginForm');

    // 1. Lógica para mostrar/esconder a senha
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            if (type === 'password') {
                togglePassword.classList.remove('fa-eye');
                togglePassword.classList.add('fa-eye-slash');
            } else {
                togglePassword.classList.remove('fa-eye-slash');
                togglePassword.classList.add('fa-eye');
            }
        });
    }

    // 2. Lógica de submissão do formulário (AGORA COM API)
    if (loginForm) {
        // Adiciona 'async' para 'await'
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            // O ID 'user-name' está sendo usado para o Email, conforme seu HTML
            const email = document.getElementById('user-name').value;
            const password = passwordInput.value;
            
            // 3. Monta o DTO (igual ao da documentação)
            const loginDto = {
                email: email,
                password: password
            };

            // 4. Envia para a API (fetch)
            try {
                const response = await fetch(`${BASE_URL}/Auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginDto)
                });

                // 5. Trata a resposta (Status 200 = OK)
                if (response.status === 200) {
                    const data = await response.json(); // Ex: { token: "...", user: {...} }
                    
                    // 6. SALVA O TOKEN no localStorage!
                    salvarToken(data.token); 
                    // (Opcional: salvar nome do usuário)
                    // localStorage.setItem('userName', data.user.nome); 
                    
                    alert('Login bem-sucedido! Redirecionando para a Home.');
                    window.location.href = "../Home/index.html";

                } else if (response.status === 401 || response.status === 404) {
                    // 401 (Unauthorized) ou 404 (Not Found) = Login inválido
                    alert('Email ou senha incorretos.');
                } else {
                    alert('Erro desconhecido ao tentar logar.');
                }
            } catch (error) {
                console.error('Falha na rede ou API .NET offline:', error);
                alert('Não foi possível conectar ao servidor. Verifique se sua API .NET está rodando.');
            }
        });
    }
});