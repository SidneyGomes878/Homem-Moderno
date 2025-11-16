document.addEventListener('DOMContentLoaded', () => {
    
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('user-password');
    const loginForm = document.getElementById('loginForm');

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

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            console.log('API available:', window.API);
            if (!window.API) {
                alert('API não carregada. Recarregue a página.');
                return;
            }
            
            const email = document.getElementById('user-name').value;
            const password = document.getElementById('user-password').value;
            
            try {
                const response = await window.API.loginUser({ email, password });
                console.log("Login realizado para:", email);
                alert('Login bem-sucedido! Redirecionando para a Home.');
                window.location.href = "../Home/index.html";
            } catch (error) {
                console.error("Erro no login:", error);
                alert('Erro no login: ' + error.message);
            }
        });
    }
});