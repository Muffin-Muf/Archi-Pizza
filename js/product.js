let basePrice = 0;
let totalPrice = 0;
let selectedAdd = [];
let currentPizza = null;

async function initProduct() {
    let urlParams = new URLSearchParams(window.location.search);
    let pizzaId = urlParams.get('id'); 

    if (!pizzaId) {
        console.error("ID продукту не знайдено в URL");
        return;
    }

    try {
        const response = await fetch(`https://archi-pizza.onrender.com/products/${pizzaId}`);
        
        if (!response.ok) {
            throw new Error(`Продукт з ID ${pizzaId} не знайдено на сервері`);
        }

        currentPizza = await response.json();

        if (currentPizza) {
            document.getElementById('main-pizza-img').src = currentPizza.img;
            document.getElementById('pizza-name').innerText = currentPizza.name;
            document.getElementById('pizza-description').innerText = currentPizza.description;
            document.getElementById('pizza-weight').innerText = currentPizza.weight;
            
            basePrice = currentPizza.price;
            totalPrice = basePrice;
            
            updatePriceDisplay();
            updateCartCounter(); 
            checkCartStatus(); 
        }
    } catch (error) {
        console.error("Помилка при завантаженні продукту з бекенду:", error);
        document.getElementById('pizza-description').innerText = "Не вдалося завантажити дані про товар.";
    }
}

document.addEventListener('DOMContentLoaded', initProduct);

window.updateCartCounter = function() {
    let cartStr = localStorage.getItem('archi_cart');
    let cart = cartStr ? JSON.parse(cartStr) : [];
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].quantity;
    }
    
    let countElem = document.querySelector('.cart-count');
    if (countElem) countElem.innerText = total;
    
    let countOverlay = document.querySelector('.cart-count-overlay');
    if (countOverlay) countOverlay.innerText = total;
};

window.changeProductQty = function(delta) {
    const qtyDisplay = document.getElementById('product-qty-value');
    if (!qtyDisplay) return;

    let currentQty = parseInt(qtyDisplay.innerText);
    let newQty = currentQty + delta;
    if (newQty < 1) newQty = 1;

    qtyDisplay.innerText = newQty;

    let cartStr = localStorage.getItem('archi_cart');
    if (cartStr && currentPizza) {
        let cart = JSON.parse(cartStr);
        let itemIndex = cart.findIndex(item => String(item.originalId) === String(currentPizza.id));
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = newQty;
            localStorage.setItem('archi_cart', JSON.stringify(cart));
            updateCartCounter();
            if (typeof window.renderCart === 'function') window.renderCart();
        }
    }
};

window.toggleAddon = function(element, price, name) {
    element.classList.toggle('active');
    
    if (element.classList.contains('active')) {
        totalPrice = totalPrice + price;
        selectedAdd.push(name);
    } else {
        totalPrice = totalPrice - price;
        selectedAdd = selectedAdd.filter(item => item !== name);
    }
    updatePriceDisplay();
}

function updatePriceDisplay() {
    let priceElem = document.getElementById('pizza-price');
    if (priceElem) {
        priceElem.innerText = totalPrice + " грн";
    }
}

window.addProductToCart = function() {
    if (!currentPizza) return;

    const qtyDisplay = document.getElementById('product-qty-value');
    let selectedQuantity = qtyDisplay ? parseInt(qtyDisplay.innerText) : 1;

    let cartItem = {
        id: currentPizza.id + "_" + Date.now(), 
        originalId: currentPizza.id,
        name: currentPizza.name,          
        price: totalPrice,                
        img: currentPizza.img,
        quantity: selectedQuantity,
        addons: [...selectedAdd]          
    };

    let cartStr = localStorage.getItem('archi_cart');
    let cart = cartStr ? JSON.parse(cartStr) : [];
    
    cart.push(cartItem);
    localStorage.setItem('archi_cart', JSON.stringify(cart));

    updateCartCounter();
    checkCartStatus();
    
    if (typeof window.renderCart === 'function') window.renderCart(); 
};

window.checkCartStatus = function() {
    let btn = document.querySelector('.buy-btn');
    let qtyDisplay = document.getElementById('product-qty-value');
    if (!btn || !currentPizza) return;

    let cartStr = localStorage.getItem('archi_cart');
    let cart = cartStr ? JSON.parse(cartStr) : [];
    
    let foundItem = cart.find(item => String(item.originalId) === String(currentPizza.id));

    if (foundItem) {
        btn.innerText = "В кошику";
        btn.classList.add('in-cart');
        if (qtyDisplay) qtyDisplay.innerText = foundItem.quantity; 
    } else {
        btn.innerText = "Купити піцу";
        btn.classList.remove('in-cart');
        btn.disabled = false;
    }
};


window.addEventListener('storage', (event) => {
    if (event.key === 'archi_cart') {
        updateCartCounter();
        checkCartStatus();
    }
});


function scrollToAddons() {
    const addonsSection = document.querySelector('.addons-section');
    if (addonsSection) {
        addonsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'     
        });
    }
}

// ================= ПЕРЕХІД ДО ОФОРМЛЕННЯ ЗАМОВЛЕННЯ =================
window.checkout = function() {
    let cartStr = localStorage.getItem('archi_cart');
    let cart = cartStr ? JSON.parse(cartStr) : [];

    if (cart.length === 0) {
        alert("Ваш кошик порожній! Додайте піцу або напої перед оформленням.");
        return;
    }

    const user = JSON.parse(sessionStorage.getItem('current_user'));
    
    if (!user) {
        alert("Для оформлення замовлення, будь ласка, увійдіть у свій акаунт.");
        if (typeof toggleAuthModal === 'function') {
            toggleAuthModal();
        } else {
            let authModal = document.getElementById('auth-modal');
            if (authModal) authModal.classList.add('active');
        }
        return;
    }

    window.location.href = 'order.html'; 
};