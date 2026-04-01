/* ============================================
   VittaWear - Utilitários JavaScript
   ============================================ */

/**
 * Produtos fixos/destacados (hardcoded)
 * Esses produtos NÃO vêm do backend
 */
const PRODUTOS_FIXOS = [
    {
        id: 'fixo-1',
        nome: 'Scrub Premium Verde Oliva',
        categoria: 'scrubs',
        preco: 289.90,
        precoOriginal: 349.90,
        descricao: 'Conjunto de scrub premium confeccionado em tecido dry-fit de alta qualidade. Proporciona conforto térmico e liberdade de movimentos durante todo o dia de trabalho.',
        tamanhos: ['P', 'M', 'G', 'GG'],
        cores: ['Verde Oliva', 'Azul Marinho', 'Cinza'],
        imagem: null,
        destaque: true
    },
    {
        id: 'fixo-2',
        nome: 'Jaleco Feminino Elegance',
        categoria: 'jalecos',
        preco: 349.90,
        precoOriginal: null,
        descricao: 'Jaleco feminino com corte acinturado e detalhes em dourado fosco. Design exclusivo que une elegância e funcionalidade para profissionais que valorizam a estética.',
        tamanhos: ['P', 'M', 'G', 'GG'],
        cores: ['Branco', 'Off-White'],
        imagem: null,
        destaque: true
    },
    {
        id: 'fixo-3',
        nome: 'Conjunto Scrub Classic',
        categoria: 'scrubs',
        preco: 249.90,
        precoOriginal: 299.90,
        descricao: 'O clássico que nunca sai de moda. Conjunto scrub com modelagem confortável, bolsos funcionais e tecido que não amassa. Perfeito para longas jornadas.',
        tamanhos: ['PP', 'P', 'M', 'G', 'GG', 'XG'],
        cores: ['Azul Petróleo', 'Verde Água', 'Grafite'],
        imagem: null,
        destaque: true
    },
    {
        id: 'fixo-4',
        nome: 'Jaleco Masculino Executive',
        categoria: 'jalecos',
        preco: 379.90,
        precoOriginal: null,
        descricao: 'Jaleco masculino de corte reto com acabamento premium. Tecido com tratamento antimicrobiano e resistente a manchas. A escolha dos profissionais exigentes.',
        tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
        cores: ['Branco', 'Azul Claro'],
        imagem: null,
        destaque: true
    }
];

/**
 * Formata valor para moeda brasileira
 * @param {number} valor 
 * @returns {string}
 */
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

/**
 * Gera URL para página de produto
 * @param {string} id 
 * @returns {string}
 */
function gerarUrlProduto(id) {
    const basePath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    return `${basePath}produto.html?id=${id}`;
}

/**
 * Obtém parâmetro da URL
 * @param {string} nome 
 * @returns {string|null}
 */
function obterParametroUrl(nome) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nome);
}

/**
 * Busca produto por ID (fixo ou dinâmico)
 * @param {string} id 
 * @returns {Promise<object|null>}
 */
async function buscarProdutoPorId(id) {
    // Primeiro verifica nos produtos fixos
    const produtoFixo = PRODUTOS_FIXOS.find(p => p.id === id);
    if (produtoFixo) {
        return produtoFixo;
    }
    
    // Se não encontrou, busca na API
    try {
        const response = await fetch(`/api/produtos/${id}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    }
    
    return null;
}

/**
 * Busca produtos da API
 * @param {object} filtros 
 * @returns {Promise<array>}
 */
async function buscarProdutosApi(filtros = {}) {
    try {
        let url = '/api/produtos';
        const params = new URLSearchParams();
        
        if (filtros.categoria) {
            params.append('categoria', filtros.categoria);
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
    
    return [];
}

/**
 * Renderiza card de produto
 * @param {object} produto 
 * @returns {string}
 */
function renderizarCardProduto(produto) {
    const urlProduto = gerarUrlProduto(produto.id);
    const badge = produto.destaque ? '<span class="product-badge">Destaque</span>' : '';
    const precoOriginal = produto.precoOriginal 
        ? `<span class="original">${formatarMoeda(produto.precoOriginal)}</span>` 
        : '';
    
    return `
        <article class="product-card" onclick="window.location.href='${urlProduto}'">
            <div class="product-image">
                ${badge}
                ${produto.imagem 
                    ? `<img src="${produto.imagem}" alt="${produto.nome}">` 
                    : `<div class="product-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                        </svg>
                    </div>`
                }
                <div class="product-actions">
                    <button onclick="event.stopPropagation(); adicionarAoCarrinho('${produto.id}')" aria-label="Adicionar ao carrinho">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="product-content">
                <span class="product-category">${produto.categoria}</span>
                <h3 class="product-name">${produto.nome}</h3>
                <div class="product-price">
                    <span class="current">${formatarMoeda(produto.preco)}</span>
                    ${precoOriginal}
                </div>
            </div>
        </article>
    `;
}

/**
 * Mostra notificação toast
 * @param {string} mensagem 
 * @param {string} tipo - success, error, warning, info
 */
function mostrarNotificacao(mensagem, tipo = 'success') {
    // Remove notificação existente
    const existente = document.querySelector('.toast-notification');
    if (existente) {
        existente.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${tipo}`;
    toast.innerHTML = `
        <span>${mensagem}</span>
        <button onclick="this.parentElement.remove()" aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    // Estilos inline para o toast
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: ${tipo === 'success' ? '#768857' : tipo === 'error' ? '#dc3545' : '#C2A878'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    // Adiciona keyframes se não existir
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Inicializa navbar com scroll e menu mobile
 */
function inicializarNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks?.classList.toggle('active');
    });
    
    // Fecha menu ao clicar em link
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });
}

// Inicializa navbar em todas as páginas
document.addEventListener('DOMContentLoaded', inicializarNavbar);
