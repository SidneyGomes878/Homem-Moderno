// A URL base da sua API (da documentação)
const BASE_URL = "http://localhost:5141/api";

/**
 * Salva o token JWT no navegador depois do login.
 * @param {string} token O token recebido da API.
 */
function salvarToken(token) {
    localStorage.setItem('jwt_token', token);
}

/**
 * Pega o token JWT salvo no navegador.
 * @returns {string | null} O token, ou null se não existir.
 */
function obterToken() {
    return localStorage.getItem('jwt_token');
}

/**
 * Remove o token (faz o "logout").
 */
function logout() {
    localStorage.removeItem('jwt_token');
    // localStorage.removeItem('userName'); // Se você salvar o nome do usuário
}

/**
 * Verifica se o usuário está logado (se tem um token).
 * @returns {boolean}
 */
function estaLogado() {
    const token = obterToken();
    return token != null;
}

// Exporta as funções para que outros scripts possam usá-las
export { BASE_URL, salvarToken, obterToken, logout, estaLogado };