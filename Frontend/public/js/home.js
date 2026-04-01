/* ============================================
   VittaWear - Scripts da Home
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutosDestaque();
    inicializarNewsletter();
});

/**
 * Carrega produtos em destaque (fixos)
 */
function carregarProdutosDestaque() {
    const container = document.getElementById('featuredProducts');
    
    if (!container) return;
    
    // Usa os produtos fixos definidos em utils.js
    const html = PRODUTOS_FIXOS.map(produto => renderizarCardProduto(produto)).join('');
    container.innerHTML = html;
}

/**
 * Inicializa formulário de newsletter
 */
function inicializarNewsletter() {
    const form = document.getElementById('newsletterForm');
    
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]').value;
        
        if (email) {
            // Simula cadastro na newsletter
            mostrarNotificacao('E-mail cadastrado com sucesso! Você receberá nossas novidades.', 'success');
            form.reset();
        }
    });
}
