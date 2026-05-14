let basePrice = 0;
let totalPrice = 0;
let selectedAdd = [];
let currentPizza = null;

function initProduct() {

    let urlParams = new URLSearchParams(window.location.search);
    let pizzaId = parseInt(urlParams.get('id'));

    if (typeof products !== 'undefined' && products !== null) {
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === pizzaId) {
                currentPizza = products[i];
                break;
            }
        }
    } else {
        setTimeout(initProduct, 100);
        return;
    }

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
}

document.addEventListener('DOMContentLoaded', initProduct);

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
        let itemIndex = cart.findIndex(item => item.originalId === currentPizza.id);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = newQty;
            localStorage.setItem('archi_cart', JSON.stringify(cart));
            updateCartCounter();
            if (typeof window.renderCart === 'function') window.renderCart();
        }
    }
};


function updateCartIcon() {
    let total = 0;
    for (let k = 0; k < cart.length; k++) {
        total += cart[k].quantity;
    }

    let cartCount1 = document.querySelector('.cart-count');
    if (cartCount1) {
        cartCount1.innerText = total;
    }

    let cartCount2 = document.querySelector('.cart-count-overlay');
    if (cartCount2) {
        cartCount2.innerText = total;
    }
}

window.toggleAddon = function(element, price, name) {
    element.classList.toggle('active');
    
    if (element.classList.contains('active')) {
        totalPrice = totalPrice + price;
        selectedAdd.push(name);
    } else {
        totalPrice = totalPrice - price;

        let newAdd = [];
        for (let i = 0; i < selectedAdd.length; i++) {
            if (selectedAdd[i] !== name) {
                newAdd.push(selectedAdd[i]);
            }
        }
        selectedAdd = newAdd;
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

    // Отримуємо кількість з лічильника
    const qtyDisplay = document.getElementById('product-qty-value');
    let selectedQuantity = qtyDisplay ? parseInt(qtyDisplay.innerText) : 1;

    let finalName = currentPizza.name;
    if (selectedAdd.length > 0) {
        finalName += " (" + selectedAdd.join(", ") + ")";
    }

    let cartItem = {
        id: currentPizza.id + "_" + Date.now(), // Краще використовувати Date.now() замість Random
        originalId: currentPizza.id,
        name: finalName,
        price: totalPrice,
        img: currentPizza.img,
        quantity: selectedQuantity // Використовуємо вибрану кількість
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
    
    let foundItem = cart.find(item => item.originalId === currentPizza.id);

    if (foundItem) {
        btn.innerText = "В кошику";
        btn.classList.add('in-cart');
        btn.disabled = true;
        if (qtyDisplay) qtyDisplay.innerText = foundItem.quantity; // Відображаємо кількість із кошика
    } else {
        btn.innerText = "Купити піцу";
        btn.classList.remove('in-cart');
        btn.disabled = false;
        // Якщо товару немає в кошику, можна залишити 1 або те, що вибрав користувач
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