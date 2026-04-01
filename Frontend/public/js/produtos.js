/* ============================================
   VittaWear - Scripts da Página de Produtos
   ============================================ */

// Estado dos filtros
let filtrosAtivos = {
    categoria: 'todos',
    preco: 'todos',
    tamanho: null,
    ordenacao: 'relevancia'
};

// Cache dos produtos da API
let produtosDinamicos = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutosDestaque();
    carregarProdutosDinamicos();
    inicializarFiltros();
    inicializarMobileFilter();
    verificarParametrosUrl();
});

/**
 * Carrega produtos em destaque (fixos)
 */
function carregarProdutosDestaque() {
    const container = document.getElementById('produtosDestaque');
    
    if (!container) return;
    
    const html = PRODUTOS_FIXOS.map(produto => renderizarCardProduto(produto)).join('');
    container.innerHTML = html;
}

/**
 * Carrega produtos da API (dinâmicos)
 */
async function carregarProdutosDinamicos() {
    const container = document.getElementById('produtosDinamicos');
    const loading = document.getElementById('loadingProdutos');
    const emptyState = document.getElementById('emptyState');
    const countElement = document.getElementById('produtosCount');
    
    if (!container) return;
    
    try {
        // Simula produtos da API (em produção, seria fetch real)
        produtosDinamicos = await simularApiProdutos();
        
        // Esconde loading
        if (loading) loading.style.display = 'none';
        
        // Aplica filtros e renderiza
        renderizarProdutosFiltrados();
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        
        if (loading) loading.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'block';
            emptyState.querySelector('h3').textContent = 'Erro ao carregar produtos';
            emptyState.querySelector('p').textContent = 'Tente novamente mais tarde';
        }
    }
}

/**
 * Simula resposta da API de produtos
 * Em produção, isso seria substituído por fetch('/api/produtos')
 */
async function simularApiProdutos() {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
        {
            id: 'api-1',
            nome: 'Scrub Comfort Fit Azul Marinho',
            categoria: 'scrubs',
            preco: 229.90,
            precoOriginal: null,
            descricao: 'Scrub com modelagem comfort fit, ideal para longas jornadas. Tecido respirável e antibacteriano.',
            tamanhos: ['P', 'M', 'G', 'GG'],
            cores: ['Azul Marinho', 'Preto'],
            imagem: null,
            destaque: false
        },
        {
            id: 'api-2',
            nome: 'Jaleco Slim Feminino',
            categoria: 'jalecos',
            preco: 319.90,
            precoOriginal: 379.90,
            descricao: 'Jaleco feminino com corte slim e bolsos funcionais. Acabamento premium com detalhes elegantes.',
            tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
            cores: ['Branco', 'Azul Claro'],
            imagem: null,
            destaque: false
        },
        {
            id: 'api-3',
            nome: 'Conjunto Scrub Essencial',
            categoria: 'scrubs',
            preco: 199.90,
            precoOriginal: null,
            descricao: 'Conjunto básico de qualidade premium. Perfeito para o dia a dia no ambiente hospitalar.',
            tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
            cores: ['Verde', 'Azul', 'Cinza'],
            imagem: null,
            destaque: false
        },
        {
            id: 'api-4',
            nome: 'Jaleco Unissex Clássico',
            categoria: 'jalecos',
            preco: 289.90,
            precoOriginal: null,
            descricao: 'Jaleco tradicional com corte amplo e confortável. Ideal para diversos profissionais da saúde.',
            tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
            cores: ['Branco'],
            imagem: null,
            destaque: false
        },
        {
            id: 'api-5',
            nome: 'Scrub Cirúrgico Premium',
            categoria: 'scrubs',
            preco: 349.90,
            precoOriginal: 429.90,
            descricao: 'Scrub desenvolvido para ambiente cirúrgico. Tecido com tratamento antimicrobiano avançado.',
            tamanhos: ['P', 'M', 'G', 'GG'],
            cores: ['Verde Oliva', 'Azul Royal'],
            imagem: null,
            destaque: false
        },
        {
            id: 'api-6',
            nome: 'Touca Cirúrgica Estampada',
            categoria: 'acessorios',
            preco: 49.90,
            precoOriginal: null,
            descricao: 'Touca cirúrgica com estampas exclusivas. Elástico confortável e tecido respirável.',
            tamanhos: ['Único'],
            cores: ['Diversas estampas'],
            imagem: null,
            destaque: false
        },
        {
            id: 'api-7',
            nome: 'Calça Scrub Jogger',
            categoria: 'scrubs',
            preco: 159.90,
            precoOriginal: null,
            descricao: 'Calça scrub modelo jogger com punho na barra. Moderna e funcional.',
            tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
            cores: ['Preto', 'Grafite', 'Verde Militar'],
            imagem: null,
            destaque: false
        },
        {
            id: 'api-8',
            nome: 'Kit Máscaras N95',
            categoria: 'acessorios',
            preco: 89.90,
            precoOriginal: null,
            descricao: 'Kit com 10 máscaras N95 de alta proteção. Ajuste perfeito ao rosto.',
            tamanhos: ['Único'],
            cores: ['Branco'],
            imagem: null,
            destaque: false
        }
    ];
}

/**
 * Renderiza produtos filtrados
 */
function renderizarProdutosFiltrados() {
    const container = document.getElementById('produtosDinamicos');
    const emptyState = document.getElementById('emptyState');
    const countElement = document.getElementById('produtosCount');
    
    if (!container) return;
    
    // Aplica filtros
    let produtosFiltrados = [...produtosDinamicos];
    
    // Filtro de categoria
    if (filtrosAtivos.categoria !== 'todos') {
        produtosFiltrados = produtosFiltrados.filter(p => 
            p.categoria === filtrosAtivos.categoria
        );
    }
    
    // Filtro de preço
    if (filtrosAtivos.preco !== 'todos') {
        produtosFiltrados = produtosFiltrados.filter(p => {
            switch (filtrosAtivos.preco) {
                case '0-200':
                    return p.preco <= 200;
                case '200-350':
                    return p.preco > 200 && p.preco <= 350;
                case '350+':
                    return p.preco > 350;
                default:
                    return true;
            }
        });
    }
    
    // Filtro de tamanho
    if (filtrosAtivos.tamanho) {
        produtosFiltrados = produtosFiltrados.filter(p => 
            p.tamanhos && p.tamanhos.includes(filtrosAtivos.tamanho)
        );
    }
    
    // Ordenação
    switch (filtrosAtivos.ordenacao) {
        case 'menor-preco':
            produtosFiltrados.sort((a, b) => a.preco - b.preco);
            break;
        case 'maior-preco':
            produtosFiltrados.sort((a, b) => b.preco - a.preco);
            break;
        case 'nome':
            produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
    }
    
    // Atualiza contador
    if (countElement) {
        countElement.textContent = `${produtosFiltrados.length} produto${produtosFiltrados.length !== 1 ? 's' : ''}`;
    }
    
    // Renderiza ou mostra empty state
    if (produtosFiltrados.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        const html = produtosFiltrados.map(produto => renderizarCardProduto(produto)).join('');
        container.innerHTML = html;
    }
}

/**
 * Inicializa filtros
 */
function inicializarFiltros() {
    // Filtros de categoria
    document.querySelectorAll('input[name="categoria"]').forEach(input => {
        input.addEventListener('change', (e) => {
            // Desmarca outros checkboxes de categoria
            document.querySelectorAll('input[name="categoria"]').forEach(cb => {
                if (cb !== e.target) cb.checked = false;
            });
            
            filtrosAtivos.categoria = e.target.value;
            renderizarProdutosFiltrados();
        });
    });
    
    // Filtros de preço
    document.querySelectorAll('input[name="preco"]').forEach(input => {
        input.addEventListener('change', (e) => {
            filtrosAtivos.preco = e.target.value;
            renderizarProdutosFiltrados();
        });
    });
    
    // Filtros de tamanho
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const isActive = btn.classList.contains('active');
            
            // Remove active de todos
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            
            if (!isActive) {
                btn.classList.add('active');
                filtrosAtivos.tamanho = btn.dataset.size;
            } else {
                filtrosAtivos.tamanho = null;
            }
            
            renderizarProdutosFiltrados();
        });
    });
    
    // Ordenação
    const sortSelect = document.getElementById('sortSelect');
    sortSelect?.addEventListener('change', (e) => {
        filtrosAtivos.ordenacao = e.target.value;
        renderizarProdutosFiltrados();
    });
}

/**
 * Inicializa toggle de filtros mobile
 */
function inicializarMobileFilter() {
    const mobileBtn = document.getElementById('mobileFilterBtn');
    const sidebar = document.querySelector('.products-sidebar');
    const overlay = document.getElementById('filterOverlay');
    
    mobileBtn?.addEventListener('click', () => {
        sidebar?.classList.add('active');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    overlay?.addEventListener('click', fecharFiltrosMobile);
}

/**
 * Fecha filtros mobile
 */
function fecharFiltrosMobile() {
    const sidebar = document.querySelector('.products-sidebar');
    const overlay = document.getElementById('filterOverlay');
    
    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Verifica parâmetros da URL (ex: ?categoria=scrubs)
 */
function verificarParametrosUrl() {
    const categoria = obterParametroUrl('categoria');
    
    if (categoria) {
        // Marca checkbox correspondente
        const checkbox = document.querySelector(`input[name="categoria"][value="${categoria}"]`);
        if (checkbox) {
            // Desmarca 'todos'
            document.querySelector('input[name="categoria"][value="todos"]').checked = false;
            checkbox.checked = true;
            filtrosAtivos.categoria = categoria;
            renderizarProdutosFiltrados();
        }
    }
}

/**
 * Limpa todos os filtros
 */
function limparFiltros() {
    // Reset categoria
    document.querySelectorAll('input[name="categoria"]').forEach(cb => cb.checked = false);
    document.querySelector('input[name="categoria"][value="todos"]').checked = true;
    
    // Reset preço
    document.querySelectorAll('input[name="preco"]').forEach(cb => cb.checked = false);
    document.querySelector('input[name="preco"][value="todos"]').checked = true;
    
    // Reset tamanho
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    
    // Reset ordenação
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'relevancia';
    
    // Reset estado
    filtrosAtivos = {
        categoria: 'todos',
        preco: 'todos',
        tamanho: null,
        ordenacao: 'relevancia'
    };
    
    renderizarProdutosFiltrados();
}
