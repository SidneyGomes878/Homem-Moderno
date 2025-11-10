document.addEventListener('DOMContentLoaded', () => {
    
    // Lógica para alternar visualização de senha
    // Agora suporta múltiplos campos se necessário, usando data-target
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

    // Lógica de submissão do formulário de registro (simulação)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Aqui você coletaria os dados:
            // const name = document.getElementById('reg-name').value;
            // const email = document.getElementById('reg-email').value;
            // ...

            alert('Conta criada com sucesso! Redirecionando para o Login.');
            window.location.href = "../Login/index.html";
        });
    }

    // Lógica do Botão Google (simulação)
    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Iniciando autenticação com Google...');
            // Aqui entraria a integração real com Firebase Auth ou similar
        });
    }
});