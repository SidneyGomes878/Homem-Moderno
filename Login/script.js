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

    // 2. Lógica de submissão do formulário (Login Simulado)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nome = document.getElementById('user-name').value;
            
            // === SALVA O LOGIN NO NAVEGADOR ===
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', nome);

            console.log("Login realizado para:", nome);

            alert('Login bem-sucedido! Redirecionando para a Home.');
            
            // Redireciona para a Home
            window.location.href = "../Home/index.html";
        });
    }
});