// Importa o BASE_URL e a função de salvar o token
import { BASE_URL, salvarToken } from '../serves/api.js';

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

    // 2. Lógica de submissão do formulário (AGORA COM LÓGICA DE ADMIN)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            // O ID 'user-name' está sendo usado para o Email
            const email = document.getElementById('user-name').value;
            const password = passwordInput.value;
            
            const loginDto = {
                email: email,
                password: password
            };

            try {
                // 3. Envia para a API
                const response = await fetch(`${BASE_URL}/Auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginDto)
                });

                // 4. Trata a resposta (Status 200 = OK)
                if (response.status === 200) {
                    const data = await response.json(); // Ex: { token: "...", user: { id: 1, nome: "...", papel: "Admin" } }
                    
                    // 5. SALVA O TOKEN!
                    salvarToken(data.token); 
                    
                    // Salva o nome do usuário para o header do Admin
                    if(data.user && data.user.nome) {
                        localStorage.setItem('userName', data.user.nome);
                    }
                    
                    // === LÓGICA DE REDIRECIONAMENTO CORRIGIDA ===
                    if (data.user && (data.user.papel === "Admin" || data.user.papel === "Administrador")) {
                        
                        // Se for Admin, redireciona para o painel Admin
                        alert('Login de Administrador bem-sucedido!');
                        window.location.href = "Administrador/adm.html"; // Manda para o Admin

                    } else {
                        
                        // Se for Cliente ou outro, redireciona para a Home
                        alert('Login bem-sucedido! Redirecionando para a Home.');
                        window.location.href = "Home/index.html"; // Manda para a Home
                    }
                    // === FIM DA CORREÇÃO ===

                } else if (response.status === 401 || response.status === 404) {
                    alert('Email ou senha incorretos.');
                } else {
                    const errorData = await response.json();
                    alert(`Erro ao logar: ${errorData.message || 'Tente novamente.'}`);
                }
            } catch (error) {
                console.error('Falha na rede ou API .NET offline:', error);
                alert('Não foi possível conectar ao servidor. Verifique se sua API .NET está rodando.');
            }
        });
    }
});