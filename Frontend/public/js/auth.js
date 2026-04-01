/* ============================================
   VittaWear - Sistema de Autenticação Simulado
   ============================================ */

const AUTH_KEY = 'vittawear_usuario';
const USERS_KEY = 'vittawear_usuarios';

/**
 * Obtém usuário logado
 * @returns {object|null}
 */
function obterUsuarioLogado() {
    try {
        const usuario = localStorage.getItem(AUTH_KEY);
        return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        return null;
    }
}

/**
 * Verifica se usuário está logado
 * @returns {boolean}
 */
function estaLogado() {
    return obterUsuarioLogado() !== null;
}

/**
 * Obtém lista de usuários cadastrados
 * @returns {array}
 */
function obterUsuariosCadastrados() {
    try {
        const usuarios = localStorage.getItem(USERS_KEY);
        return usuarios ? JSON.parse(usuarios) : [];
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        return [];
    }
}

/**
 * Cadastra novo usuário
 * @param {object} dados - { nome, email, senha, telefone }
 * @returns {object} - { sucesso: boolean, mensagem: string }
 */
function cadastrarUsuario(dados) {
    const { nome, email, senha, telefone } = dados;
    
    // Validações
    if (!nome || !email || !senha) {
        return { sucesso: false, mensagem: 'Preencha todos os campos obrigatórios' };
    }
    
    if (!validarEmail(email)) {
        return { sucesso: false, mensagem: 'E-mail inválido' };
    }
    
    if (senha.length < 6) {
        return { sucesso: false, mensagem: 'A senha deve ter pelo menos 6 caracteres' };
    }
    
    const usuarios = obterUsuariosCadastrados();
    
    // Verifica se e-mail já existe
    if (usuarios.find(u => u.email === email)) {
        return { sucesso: false, mensagem: 'Este e-mail já está cadastrado' };
    }
    
    // Cria novo usuário
    const novoUsuario = {
        id: Date.now().toString(),
        nome,
        email,
        senha, // Em produção, a senha seria hasheada
        telefone: telefone || '',
        dataCadastro: new Date().toISOString()
    };
    
    usuarios.push(novoUsuario);
    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
    
    return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!' };
}

/**
 * Realiza login
 * @param {string} email 
 * @param {string} senha 
 * @returns {object} - { sucesso: boolean, mensagem: string }
 */
function realizarLogin(email, senha) {
    if (!email || !senha) {
        return { sucesso: false, mensagem: 'Preencha todos os campos' };
    }
    
    const usuarios = obterUsuariosCadastrados();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (!usuario) {
        return { sucesso: false, mensagem: 'E-mail ou senha incorretos' };
    }
    
    // Salva sessão (sem a senha)
    const sessao = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(sessao));
    
    return { sucesso: true, mensagem: 'Login realizado com sucesso!' };
}

/**
 * Realiza logout
 */
function realizarLogout() {
    localStorage.removeItem(AUTH_KEY);
    mostrarNotificacao('Você saiu da sua conta', 'info');
    
    // Redireciona para home
    setTimeout(() => {
        window.location.href = window.location.pathname.includes('/pages/') 
            ? '../index.html' 
            : 'index.html';
    }, 1000);
}

/**
 * Valida formato de e-mail
 * @param {string} email 
 * @returns {boolean}
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Atualiza UI do botão de login na navbar
 */
function atualizarBotaoLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const loginText = loginBtn?.querySelector('.login-text');
    const usuario = obterUsuarioLogado();
    
    if (loginBtn && loginText) {
        if (usuario) {
            loginText.textContent = usuario.nome.split(' ')[0]; // Primeiro nome
            loginBtn.href = 'pages/perfil.html';
            
            // Se já estiver em /pages/, ajusta o caminho
            if (window.location.pathname.includes('/pages/')) {
                loginBtn.href = 'perfil.html';
            }
        } else {
            loginText.textContent = 'Entrar';
        }
    }
}

// Atualiza botão de login ao carregar página
document.addEventListener('DOMContentLoaded', atualizarBotaoLogin);
