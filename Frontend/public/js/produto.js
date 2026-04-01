/* ============================================
   VittaWear - Scripts da Página de Produto
   ============================================ */

// Estado do produto atual
let produtoAtual = null;
let tamanhoSelecionado = null;
let corSelecionada = null;
let quantidade = 1;

document.addEventListener('DOMContentLoaded', () => {
    carregarProduto();
    inicializarQuantidade();
});

/**
 * Carrega dados do produto
 */
async function carregarProduto() {
    const loading = document.getElementById('loadingProduto');
    const productDetail = document.getElementById('productDetail');
    const notFound = document.getElementById('productNotFound');
    
    const produtoId = obterParametroUrl('id');
    
    if (!produtoId) {
        mostrarNaoEncontrado();
        return;
    }
    
    try {
        // Busca produto (pode ser fixo ou da API)
        produtoAtual = await buscarProdutoPorId(produtoId);
        
        if (!produtoAtual) {
            // Se não encontrou nos fixos, tenta simular busca na API
            produtoAtual = await buscarProdutoSimulado(produtoId);
        }
        
        if (produtoAtual) {
            renderizarProduto();
            loading.style.display = 'none';
            productDetail.style.display = 'block';
        } else {
            mostrarNaoEncontrado();
        }
        
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        mostrarNaoEncontrado();
    }
}

/**
 * Simula busca na API para produtos dinâmicos
 */
async function buscarProdutoSimulado(id) {
    // Lista de produtos simulados da API
    const produtosApi = [
        {
            id: 'api-1',
            nome: 'Scrub Comfort Fit Azul Marinho',
            categoria: 'scrubs',
            preco: 229.90,
            precoOriginal: null,
            descricao: 'Scrub com modelagem comfort fit, ideal para longas jornadas. Tecido respirável e antibacteriano. Possui bolsos funcionais e costuras reforçadas para maior durabilidade.',
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
            descricao: 'Jaleco feminino com corte slim e bolsos funcionais. Acabamento premium com detalhes elegantes. Tecido com tratamento anti-manchas.',
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
            descricao: 'Conjunto básico de qualidade premium. Perfeito para o dia a dia no ambiente hospitalar. Tecido leve e confortável.',
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
            descricao: 'Jaleco tradicional com corte amplo e confortável. Ideal para diversos profissionais da saúde. Botões reforçados e bolsos amplos.',
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
            descricao: 'Scrub desenvolvido para ambiente cirúrgico. Tecido com tratamento antimicrobiano avançado. Costuras seladas e acabamento de alta qualidade.',
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
            descricao: 'Touca cirúrgica com estampas exclusivas. Elástico confortável e tecido respirável. Lavável e durável.',
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
            descricao: 'Calça scrub modelo jogger com punho na barra. Moderna e funcional. Cintura elástica com cordão de ajuste.',
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
            descricao: 'Kit com 10 máscaras N95 de alta proteção. Ajuste perfeito ao rosto. Certificação de qualidade.',
            tamanhos: ['Único'],
            cores: ['Branco'],
            imagem: null,
            destaque: false
        }
    ];
    
    return produtosApi.find(p => p.id === id) || null;
}

/**
 * Renderiza produto na página
 */
function renderizarProduto() {
    const produto = produtoAtual;
    
    // Atualiza título da página
    document.title = `${produto.nome} - VittaWear`;
    
    // Breadcrumb
    document.getElementById('breadcrumbProduto').textContent = produto.nome;
    
    // Badge de destaque
    const badge = document.getElementById('productBadge');
    if (produto.destaque) {
        badge.style.display = 'block';
    }
    
    // Imagem
    const mainImage = document.getElementById('productMainImage');
    if (produto.imagem) {
        mainImage.innerHTML = `<img src="${produto.imagem}" alt="${produto.nome}">`;
    }
    
    // Informações básicas
    document.getElementById('productCategory').textContent = produto.categoria;
    document.getElementById('productTitle').textContent = produto.nome;
    document.getElementById('productPrice').textContent = formatarMoeda(produto.preco);
    document.getElementById('productDescription').textContent = produto.descricao;
    
    // Preço original e desconto
    const precoOriginal = document.getElementById('productPriceOriginal');
    const desconto = document.getElementById('productDiscount');
    
    if (produto.precoOriginal) {
        precoOriginal.textContent = formatarMoeda(produto.precoOriginal);
        const percentDesconto = Math.round((1 - produto.preco / produto.precoOriginal) * 100);
        desconto.textContent = `-${percentDesconto}%`;
    } else {
        precoOriginal.style.display = 'none';
        desconto.style.display = 'none';
    }
    
    // Tamanhos
    renderizarTamanhos(produto.tamanhos);
    
    // Cores
    renderizarCores(produto.cores);
    
    // Botões de ação
    document.getElementById('addToCartBtn').addEventListener('click', handleAddToCart);
    document.getElementById('buyNowBtn').addEventListener('click', handleBuyNow);
}

/**
 * Renderiza opções de tamanho
 */
function renderizarTamanhos(tamanhos) {
    const container = document.getElementById('sizeOptions');
    
    if (!tamanhos || tamanhos.length === 0) {
        container.parentElement.style.display = 'none';
        return;
    }
    
    container.innerHTML = tamanhos.map((tamanho, index) => `
        <button type="button" 
                class="size-option ${index === 0 ? 'active' : ''}" 
                data-size="${tamanho}">
            ${tamanho}
        </button>
    `).join('');
    
    // Define tamanho inicial
    tamanhoSelecionado = tamanhos[0];
    
    // Event listeners
    container.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tamanhoSelecionado = btn.dataset.size;
        });
    });
}

/**
 * Renderiza opções de cor
 */
function renderizarCores(cores) {
    const container = document.getElementById('colorOptions');
    const containerWrapper = document.getElementById('colorOptionContainer');
    
    if (!cores || cores.length === 0) {
        containerWrapper.style.display = 'none';
        return;
    }
    
    container.innerHTML = cores.map((cor, index) => `
        <button type="button" 
                class="color-option ${index === 0 ? 'active' : ''}" 
                data-color="${cor}">
            ${cor}
        </button>
    `).join('');
    
    // Define cor inicial
    corSelecionada = cores[0];
    
    // Event listeners
    container.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            corSelecionada = btn.dataset.color;
        });
    });
}

/**
 * Inicializa controles de quantidade
 */
function inicializarQuantidade() {
    const minusBtn = document.getElementById('qtyMinus');
    const plusBtn = document.getElementById('qtyPlus');
    const input = document.getElementById('quantity');
    
    minusBtn?.addEventListener('click', () => {
        if (quantidade > 1) {
            quantidade--;
            input.value = quantidade;
        }
    });
    
    plusBtn?.addEventListener('click', () => {
        if (quantidade < 10) {
            quantidade++;
            input.value = quantidade;
        }
    });
}

/**
 * Handler para adicionar ao carrinho
 */
async function handleAddToCart() {
    if (!produtoAtual) return;
    
    await adicionarAoCarrinho(
        produtoAtual.id, 
        quantidade, 
        tamanhoSelecionado, 
        corSelecionada
    );
}

/**
 * Handler para comprar agora
 */
async function handleBuyNow() {
    if (!produtoAtual) return;
    
    await adicionarAoCarrinho(
        produtoAtual.id, 
        quantidade, 
        tamanhoSelecionado, 
        corSelecionada
    );
    
    // Redireciona para o carrinho
    window.location.href = 'carrinho.html';
}

/**
 * Mostra estado de produto não encontrado
 */
function mostrarNaoEncontrado() {
    document.getElementById('loadingProduto').style.display = 'none';
    document.getElementById('productDetail').style.display = 'none';
    document.getElementById('productNotFound').style.display = 'block';
}
