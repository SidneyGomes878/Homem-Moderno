document.addEventListener('DOMContentLoaded', () => {

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

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const telefone = document.getElementById('reg-phone').value;
            const password = document.getElementById('reg-password').value;
            
            try {
                await window.API.registerUser({ nome, email, password, telefone });
                alert('Conta criada com sucesso! Redirecionando para o Login.');
                window.location.href = "../Login/index.html";
            } catch (error) {
                console.error("Erro no registro:", error);
                alert('Erro no registro: ' + error.message);
            }
        });
    }

    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Iniciando autenticação com Google...');
        });
    }
});