document.addEventListener('DOMContentLoaded', () => {
    
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('user-password');
    const loginForm = document.getElementById('loginForm');

    // 1. Lógica para mostrar/esconder a senha
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            // Verifica o tipo do input
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Troca o ícone
            if (type === 'password') {
                togglePassword.classList.remove('fa-eye');
                togglePassword.classList.add('fa-eye-slash');
            } else {
                togglePassword.classList.remove('fa-eye-slash');
                togglePassword.classList.add('fa-eye');
            }
        });
    }

    // 2. Lógica de submissão do formulário (simulação)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o recarregamento da página
            
            const nome = document.getElementById('user-name').value;
            const numero = passwordInput.value;
            
            console.log("Login submetido:");
            console.log("Nome:", nome);
            console.log("Numero/Senha:", numero);

            // Simula um login bem-sucedido e redireciona para a Home
            alert('Login bem-sucedido! Redirecionando para a Home.');
            
            // Redireciona para a Home
            // (Ajuste o caminho se a pasta Home não for ../Home/index.html)
            window.location.href = "../Home/index.html";
        });
    }
});