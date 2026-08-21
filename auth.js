// Gerenciador de Logins e Autenticação (Local storage para o GitHub Pages)

const USERS_KEY = 'olympius_registered_users';
const SESSION_KEY = 'olympius_current_user';

// Carrega os usuários salvos no navegador ou inicia uma lista vazia
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Salva a lista de usuários atualizada
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Manipula o formulário de cadastro
function handleRegister(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('reg-username').value.trim();
    const passwordInput = document.getElementById('reg-password').value;
    const confirmPasswordInput = document.getElementById('reg-confirm-password').value;
    const msg = document.getElementById('reg-msg');

    if (passwordInput !== confirmPasswordInput) {
        showError(msg, 'As senhas não coincidem.');
        return;
    }

    const users = getUsers();
    const userExists = users.some(user => user.username.toLowerCase() === usernameInput.toLowerCase());

    if (userExists) {
        showError(msg, 'Este nome de usuário já está cadastrado.');
        return;
    }

    // Cria o novo perfil do Olympius
    const newUser = {
        username: usernameInput,
        password: passwordInput, // Em produção real, senhas devem ser tratadas via backend
        xp: 0,
        nivel: 1,
        diasOfensiva: 0,
        criadoEm: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Inicia sessão automaticamente
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    
    closeAuthModal();
    updateUI(newUser);
}

// Manipula o formulário de login
function handleLogin(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('login-username').value.trim();
    const passwordInput = document.getElementById('login-password').value;
    const msg = document.getElementById('login-msg');

    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput);

    if (!user) {
        showError(msg, 'Usuário ou senha incorretos.');
        return;
    }

    // Salva a sessão ativa
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));

    closeAuthModal();
    updateUI(user);
}

// Encerra a sessão
function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
}

// Função auxiliar para exibir mensagens de erro
function showError(element, text) {
    if (element) {
        element.textContent = text;
        element.classList.remove('hidden');
    }
}

// Verifica se já existe um usuário logado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const activeSession = localStorage.getItem(SESSION_KEY);
    if (activeSession) {
        const user = JSON.parse(activeSession);
        updateUI(user);
    }
});
