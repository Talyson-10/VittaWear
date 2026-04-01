/* ============================================
   VittaWear - Sistema de Carrinho
   ============================================ */

const CART_KEY = 'vittawear_carrinho';

/**
 * Obtém carrinho do localStorage
 * @returns {array}
 */
function obterCarrinho() {
    try {
        const carrinho = localStorage.getItem(CART_KEY);
        return carrinho ? JSON.parse(carrinho) : [];
    } catch (error) {
        console.error('Erro ao obter carrinho:', error);
        return [];
    }
}

/**
 * Salva carrinho no localStorage
 * @param {array} carrinho 
 */
function salvarCarrinho(carrinho) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
        atualizarContadorCarrinho();
    } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
    }
}

/**
 * Atualiza contador do carrinho na navbar
 */
function atualizarContadorCarrinho() {
    const contador = document.getElementById('cartCount');
    if (contador) {
        const carrinho = obterCarrinho();
        const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
        contador.textContent = total;
        contador.style.display = total > 0 ? 'flex' : 'none';
    }
}

/**
 * Adiciona produto ao carrinho
 * @param {string} produtoId 
 * @param {number} quantidade 
 * @param {string} tamanho 
 * @param {string} cor 
 */
async function adicionarAoCarrinho(produtoId, quantidade = 1, tamanho = null, cor = null) {
    const produto = await buscarProdutoPorId(produtoId);
    
    if (!produto) {
        mostrarNotificacao('Produto não encontrado', 'error');
        return;
    }
    
    const carrinho = obterCarrinho();
    
    // Verifica se produto já existe no carrinho (mesmo tamanho e cor)
    const itemExistente = carrinho.find(item => 
        item.id === produtoId && 
        item.tamanho === tamanho && 
        item.cor === cor
    );
    
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: produtoId,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: quantidade,
            tamanho: tamanho || (produto.tamanhos ? produto.tamanhos[0] : null),
            cor: cor || (produto.cores ? produto.cores[0] : null)
        });
    }
    
    salvarCarrinho(carrinho);
    mostrarNotificacao('Produto adicionado ao carrinho!', 'success');
}

/**
 * Remove item do carrinho
 * @param {number} index 
 */
function removerDoCarrinho(index) {
    const carrinho = obterCarrinho();
    carrinho.splice(index, 1);
    salvarCarrinho(carrinho);
    
    // Se estiver na página do carrinho, atualiza a visualização
    if (typeof renderizarCarrinho === 'function') {
        renderizarCarrinho();
    }
    
    mostrarNotificacao('Produto removido do carrinho', 'info');
}

/**
 * Atualiza quantidade de item no carrinho
 * @param {number} index 
 * @param {number} novaQuantidade 
 */
function atualizarQuantidadeCarrinho(index, novaQuantidade) {
    if (novaQuantidade < 1) {
        removerDoCarrinho(index);
        return;
    }
    
    const carrinho = obterCarrinho();
    if (carrinho[index]) {
        carrinho[index].quantidade = novaQuantidade;
        salvarCarrinho(carrinho);
        
        // Se estiver na página do carrinho, atualiza a visualização
        if (typeof renderizarCarrinho === 'function') {
            renderizarCarrinho();
        }
    }
}

/**
 * Calcula total do carrinho
 * @returns {number}
 */
function calcularTotalCarrinho() {
    const carrinho = obterCarrinho();
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

/**
 * Limpa o carrinho
 */
function limparCarrinho() {
    localStorage.removeItem(CART_KEY);
    atualizarContadorCarrinho();
    
    if (typeof renderizarCarrinho === 'function') {
        renderizarCarrinho();
    }
}

/**
 * Gera mensagem para WhatsApp com itens do carrinho
 * @returns {string}
 */
function gerarMensagemWhatsApp() {
    const carrinho = obterCarrinho();
    
    if (carrinho.length === 0) {
        return '';
    }
    
    let mensagem = '*Pedido VittaWear*\n\n';
    mensagem += '━━━━━━━━━━━━━━━━━━━━\n';
    
    carrinho.forEach((item, index) => {
        mensagem += `\n*${index + 1}. ${item.nome}*\n`;
        if (item.tamanho) mensagem += `   Tamanho: ${item.tamanho}\n`;
        if (item.cor) mensagem += `   Cor: ${item.cor}\n`;
        mensagem += `   Qtd: ${item.quantidade}\n`;
        mensagem += `   Valor: ${formatarMoeda(item.preco * item.quantidade)}\n`;
    });
    
    mensagem += '\n━━━━━━━━━━━━━━━━━━━━\n';
    mensagem += `\n*TOTAL: ${formatarMoeda(calcularTotalCarrinho())}*\n`;
    
    return mensagem;
}

/**
 * Finaliza compra via WhatsApp
 * @param {string} telefone - Número do WhatsApp (com código do país)
 */
function finalizarCompraWhatsApp(telefone = '5511999999999') {
    const carrinho = obterCarrinho();
    
    if (carrinho.length === 0) {
        mostrarNotificacao('Seu carrinho está vazio', 'warning');
        return;
    }
    
    const mensagem = gerarMensagemWhatsApp();
    const mensagemCodificada = encodeURIComponent(mensagem);
    const url = `https://wa.me/${telefone}?text=${mensagemCodificada}`;
    
    window.open(url, '_blank');
}

// Inicializa contador ao carregar página
document.addEventListener('DOMContentLoaded', atualizarContadorCarrinho);
