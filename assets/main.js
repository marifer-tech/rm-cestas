document.addEventListener('DOMContentLoaded', function() {
    // Dados dos produtos
    const products = [
        {
            id: 1,
            name: "Cesta Romântica Premium",
            price: 199.90,
            image: "assets/images/cestaromantica.png",
            category: "Romântica",
            description: "Champagne, chocolates finos, morangos e rosas para noites especiais"
        },
        {
            id: 2,
            name: "Kit Aniversário Luxo",
            price: 159.90,
            image: "assets/images/aniversario.jpg",
            category: "Comemorativa",
            description: "Vinho, queijos, salame e doces para celebrar em grande estilo"
        },
        {
            id: 3,
            name: "Cesta Café da Manhã",
            price: 129.90,
            image: "images/cafe-manha.jpg",
            category: "Comemorativa",
            description: "Pães, frios, geleias e café especial para começar o dia bem"
        },
        {
            id: 4,
            name: "Box Relax",
            price: 149.90,
            image: "images/box-relax.jpg",
            category: "Bem-estar",
            description: "Velas aromáticas, chás especiais, máscara para olhos e chocolate"
        }
    ];

    // Carrinho de compras
    let basket = [];

    // Elementos do DOM
    const productsGrid = document.getElementById('products-grid');
    const basketItems = document.getElementById('basket-items');
    const basketTotal = document.getElementById('basket-total');
    const basketCount = document.getElementById('basket-count');
    const basketToggle = document.getElementById('basket-toggle');
    const closeBasket = document.getElementById('close-basket');
    const basketSidebar = document.querySelector('.basket-sidebar');
    const sendWhatsapp = document.getElementById('send-whatsapp');

    // Carregar produtos
    function loadProducts() {
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-md-6 col-lg-4 col-xl-3 mb-4';
            productCard.innerHTML = `
                <div class="product-card h-100">
                    <img src="${product.image}" alt="${product.name}" class="product-img w-100">
                    <div class="product-body">
                        <h5 class="product-title">${product.name}</h5>
                        <p class="text-muted small">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="product-price">R$ ${product.price.toFixed(2)}</span>
                            <button class="btn btn-sm btn-primary add-to-cart" data-id="${product.id}">
                                <i class="fas fa-plus me-1"></i> Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Adicionar event listeners aos botões
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToBasket(productId);
            });
        });
    }

    // Adicionar ao carrinho
    function addToBasket(productId) {
        const product = products.find(p => p.id === productId);
        
        // Verificar se o produto já está no carrinho
        const existingItem = basket.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            basket.push({
                ...product,
                quantity: 1
            });
        }
        
        updateBasket();
        showBasket();
        
        // Feedback visual
        const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
        button.innerHTML = '<i class="fas fa-check me-1"></i> Adicionado';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-plus me-1"></i> Adicionar';
            button.classList.remove('btn-success');
            button.classList.add('btn-primary');
        }, 2000);
    }

    // Atualizar carrinho
    function updateBasket() {
        // Atualizar contador
        const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
        basketCount.textContent = totalItems;
        
        // Atualizar lista de itens
        if (basket.length === 0) {
            basketItems.innerHTML = `
                <div class="empty-basket">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Sua cesta está vazia</p>
                </div>
            `;
        } else {
            basketItems.innerHTML = '';
            let total = 0;
            
            basket.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const basketItem = document.createElement('div');
                basketItem.className = 'basket-item';
                basketItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="basket-item-img">
                    <div class="basket-item-info">
                        <h6 class="basket-item-title">${item.name}</h6>
                        <span class="basket-item-price">R$ ${item.price.toFixed(2)}</span>
                    </div>
                    <div class="basket-item-actions">
                        <button class="decrease-quantity" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="basket-item-quantity">${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                `;
                
                basketItems.appendChild(basketItem);
            });
            
            // Atualizar total
            basketTotal.textContent = `R$ ${total.toFixed(2)}`;
        }
        
        // Adicionar event listeners aos botões do carrinho
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const item = basket.find(item => item.id === productId);
                item.quantity += 1;
                updateBasket();
            });
        });
        
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const item = basket.find(item => item.id === productId);
                
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    basket = basket.filter(item => item.id !== productId);
                }
                
                updateBasket();
            });
        });
    }

    // Mostrar/ocultar carrinho
    function showBasket() {
        basketSidebar.classList.add('open');
    }
    
    function hideBasket() {
        basketSidebar.classList.remove('open');
    }
    
    // Enviar pedido por WhatsApp
    function sendOrder() {
    // Verifica se há itens no carrinho
    if (basket.length === 0) {
        alert('Seu carrinho está vazio! Adicione produtos antes de enviar.');
        return;
    }

    // Monta a mensagem
    let message = "🛒 *PEDIDO - R&M CESTAS* 🛒\n\n";
    let total = 0;
    
    // Adiciona cada item ao mensagem
    basket.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `▪ ${item.name}\n`;
        message += `Quantidade: ${item.quantity}\n`;
        message += `Valor: R$ ${itemTotal.toFixed(2)}\n\n`;
    });

    // Adiciona o total
    message += `*TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    message += "Por favor, confirme este pedido e informe:\n";
    message += "1. Forma de pagamento (Pix, cartão ou boleto)\n";
    message += "2. Endereço completo para entrega\n";
    message += "3. Data/horário preferencial\n\n";
    message += "Agradecemos sua preferência! ❤️";

    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
   
    const whatsappNumber = "5565998024674"; 
    
    // Abre o WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
}

// Garanta que o event listener está corretamente configurado
document.getElementById('send-whatsapp').addEventListener('click', sendOrder);
    // Inicializar
    loadProducts();
});